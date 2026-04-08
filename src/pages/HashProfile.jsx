/*
  HashProfile.jsx
  ---------------
  Renders a user profile based on an IDENTITY_HASH from the URL.
  Falls back to a custom terminal-style 404 if the hash is not found.
*/

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import ProfileSkeleton from "./ProfileSkeleton";
import ProfileView from "../components/profile/ProfileView";
import { useProjects } from "../hooks/useProjects";
import { useOpportunities } from "../hooks/useOpportunities";

const categorizeSkills = (skills = []) => {
  const categories = {
    Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "TailwindCSS", "Vue", "Angular", "Svelte"],
    Backend: ["Node.js", "Express", "Python", "Django", "Flask", "Go", "Rust", "PostgreSQL", "MongoDB", "SQL", "GraphQL", "Supabase", "Firebase"],
    Tools: ["Git", "Docker", "AWS", "Kubernetes", "Vercel", "Linux", "Figma", "Prisma", "Zustand", "Redux"]
  };

  const result = { Frontend: [], Backend: [], Tools: [] };

  skills.forEach(skill => {
    let found = false;
    for (const [cat, list] of Object.entries(categories)) {
      if (list.includes(skill)) {
        result[cat].push(skill);
        found = true;
        break;
      }
    }
    if (!found) result.Tools.push(skill);
  });

  return result;
};

const formatStat = (num) => {
  if (!num) return 0;
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

// Generate a hash from a username to match against
const generateHash = (username) => {
  if (!username) return '';
  const hash = `0x${Math.abs(username.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0)).toString(16).toUpperCase()}...${username.toUpperCase().slice(-4)}`;
  return hash;
};

export default function HashProfile() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { fetchUserProjects } = useProjects();
  const { opportunities: allOpportunities } = useOpportunities();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProfileByHash() {
      if (!hash) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Fetch all profiles and find the one whose generated hash matches
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*");

        if (error || !profiles) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Find profile with matching hash
        const matchedProfile = profiles.find(p => {
          const generatedHash = generateHash(p.username || p.display_name);
          // Check if the searched hash starts with the same prefix or matches exactly
          return generatedHash.startsWith(hash) || hash.startsWith(generatedHash.split('...')[0]);
        });

        if (matchedProfile) {
          setProfile(matchedProfile);
          
          // Fetch projects for this profile
          const userProjects = await fetchUserProjects(matchedProfile.id);
          setProjects(userProjects);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching profile by hash:', err);
        setNotFound(true);
      }

      setLoading(false);
    }

    fetchProfileByHash();
  }, [hash, fetchUserProjects]);

  // Show loading skeleton
  if (loading) {
    return <ProfileSkeleton />;
  }

  // Show custom 404 page
  if (notFound) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center bg-[#040404] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Terminal Error Message */}
          <div className="font-mono">
            <p className="text-red-500 text-lg md:text-xl tracking-widest mb-2">
              &gt; ERROR 404: IDENTITY_HASH_NOT_FOUND_IN_REGISTRY
            </p>
            <p className="text-[#444] text-xs tracking-wider">
              The hash "{hash}" does not match any profile in the database.
            </p>
          </div>

          {/* Decorative Terminal Border */}
          <div className="w-64 h-px bg-gradient-to-r from-transparent via-[#1f1f1f] to-transparent my-4" />

          {/* Return Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="group px-6 py-3 bg-transparent border border-[#1f1f1f] text-[#888] hover:text-[#e8ff47] hover:border-[#e8ff47]/40 font-mono text-xs uppercase tracking-widest transition-all rounded-none flex items-center gap-2"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return_To_Base</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Render the profile view
  const p = profile || {};
  const userData = {
    profile: {
      avatarUrl: p.avatar_url,
      name: p.display_name || "Unknown User",
      handle: p.username || "user",
      isLive: false,
      bio: p.bio,
      location: p.location,
      joinDate: p.created_at
        ? new Date(p.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "Recently"
    },
    skills: {
      categorized: categorizeSkills(p.skills || [])
    },
    connect: {
      githubUrl: p.github_url,
      linkedinUrl: p.linkedin_url,
      websiteUrl: p.website_url,
      twitterUrl: p.twitter_url
    },
    stats: {
      projects: projects.length,
      commits: formatStat(p.commits_count),
      followers: formatStat(p.followers_count),
      stars: formatStat(projects.reduce((acc, curr) => acc + (curr.stars_count || 0), 0))
    },
    projects: projects,
    opportunities: (allOpportunities || []).filter(opp => opp.poster_id === profile?.id)
  };

  return (
    <ProfileView
      userData={userData}
      isOwn={false}
      onEdit={() => {}}
    />
  );
}
