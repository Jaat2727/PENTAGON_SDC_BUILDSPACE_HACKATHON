/*
  useProjects.js
  ---------------
  Manages projects with Supabase persistence.
  - Logged-in users can create projects that are stored in the DB
  - All users can view projects from the DB
  - Falls back to sample data when Supabase is not configured
*/

import { useState, useEffect, useCallback } from "react";
import { supabase, SUPABASE_CONFIG_VALID } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";

// Seed projects shown when DB is empty or user is not logged in
const SEED_PROJECTS = [
  {
    id: "seed-1",
    title: "AI Code Reviewer",
    description: "An intelligent code review assistant that uses GPT-4 to analyze pull requests and provide actionable feedback.",
    tech_stack: ["Python", "TypeScript", "React", "Docker"],
    status: "open",
    owner_id: "seed-owner-1",
    repo_url: "https://github.com/example/ai-code-reviewer",
    owner_email: "alex@example.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "DevMetrics Dashboard",
    description: "Real-time developer productivity metrics with beautiful visualizations and team insights.",
    tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL"],
    status: "open",
    owner_id: "seed-owner-2",
    repo_url: "",
    owner_email: "emma@example.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "Rust Game Engine",
    description: "A lightweight, high-performance game engine written in Rust with WebGPU support.",
    tech_stack: ["Rust", "TypeScript"],
    status: "open",
    owner_id: "seed-owner-3",
    repo_url: "",
    owner_email: "david@example.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "seed-4",
    title: "ML Pipeline Builder",
    description: "Visual drag-and-drop interface for building and deploying machine learning pipelines.",
    tech_stack: ["Python", "React", "Docker", "MongoDB"],
    status: "closed",
    owner_id: "seed-owner-4",
    repo_url: "",
    owner_email: "james@example.com",
    created_at: new Date().toISOString(),
  },
];

export function useProjects() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all projects from Supabase
  const fetchProjects = useCallback(async () => {
    if (!SUPABASE_CONFIG_VALID) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      // Merge DB projects on top of seed projects (seeds are fallback)
      const dbIds = data.map((p) => p.id);
      const filteredSeeds = SEED_PROJECTS.filter((s) => !dbIds.includes(s.id));
      setProjects([...data, ...filteredSeeds]);
    }
    setLoading(false);
  }, []);

  // Fetch projects owned by the current user
  const fetchMyProjects = useCallback(async () => {
    if (!SUPABASE_CONFIG_VALID || !user) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMyProjects(data);
    }
  }, [user]);

  // Load on mount and when user changes
  useEffect(() => {
    fetchProjects();
    if (user) fetchMyProjects();
  }, [fetchProjects, fetchMyProjects, user]);

  // Create a new project
  const createProject = useCallback(
    async ({ title, description, techStack, repoUrl }) => {
      const newProject = {
        id: `local-${Date.now()}`,
        title,
        description,
        tech_stack: techStack,
        status: "open",
        owner_id: user?.id || "anonymous",
        repo_url: repoUrl || "",
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setProjects((prev) => [newProject, ...prev]);
      if (user) setMyProjects((prev) => [newProject, ...prev]);

      // Persist to Supabase
      if (user && SUPABASE_CONFIG_VALID) {
        const { data, error } = await supabase
          .from("projects")
          .insert({
            owner_id: user.id,
            title,
            description,
            tech_stack: techStack,
            status: "open",
            repo_url: repoUrl || null,
          })
          .select()
          .single();

        if (!error && data) {
          // Replace the optimistic entry with the real one
          setProjects((prev) =>
            prev.map((p) => (p.id === newProject.id ? data : p))
          );
          setMyProjects((prev) =>
            prev.map((p) => (p.id === newProject.id ? data : p))
          );
        }
      }
    },
    [user]
  );

  // Delete a project
  const deleteProject = useCallback(async (projectId) => {
    if (!projectId) return;

    // Optimistic update
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setMyProjects(prev => prev.filter(p => p.id !== projectId));

    if (SUPABASE_CONFIG_VALID && user) {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId)
        .eq("owner_id", user.id);

      if (error) {
        console.error("Failed to delete project:", error);
        // Re-fetch to sync state if there was an error
        fetchProjects();
        if (user) fetchMyProjects();
      }
    }
  }, [user, fetchProjects, fetchMyProjects]);

  // Fetch projects owned by a specific user
  const fetchUserProjects = useCallback(async (userId) => {
    if (!SUPABASE_CONFIG_VALID || !userId) return [];

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false });

    return error ? [] : data;
  }, []);

  return { projects, myProjects, loading, createProject, deleteProject, fetchUserProjects, refetch: fetchProjects };
}

