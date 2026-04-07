/*
  CreateProjectModal.jsx
  ----------------------
  Terminal-style modal form for creating a new project.
*/

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Button from "../ui/Button";
import { HiX } from "react-icons/hi";

const availableTech = [
  "React", "Next.js", "TypeScript", "Python", "Node.js", "Rust",
  "Go", "PostgreSQL", "MongoDB", "GraphQL", "TailwindCSS", "Docker",
];

export default function CreateProjectModal({ open, onClose, onCreated }) {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTech, setSelectedTech] = useState([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description) {
      setError("Project name and description are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const { data: project, error: insertErr } = await supabase
      .from("projects")
      .insert({
        owner_id: user.id,
        title: name.trim(),
        description: description.trim(),
        tech_stack: selectedTech,
        repo_url: githubUrl.trim() || null,
      })
      .select()
      .single();

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: user.id,
      role: "owner",
    });

    await supabase.from("feed_posts").insert({
      author_id: user.id,
      type: "project",
      ref_id: project.id,
      content: `Created a new project: ${project.title}`,
    });

    setSaving(false);
    setName("");
    setDescription("");
    setSelectedTech([]);
    setGithubUrl("");
    onCreated?.(project);
    onClose();
  };

  const lines = [
    { label: "project_name", value: name, active: currentLine === 0 },
    { label: "description", value: description, active: currentLine === 1 },
    { label: "tech_stack", value: `[${selectedTech.join(", ")}]`, active: currentLine === 2 },
    { label: "github_url", value: githubUrl || "optional", active: currentLine === 3 },
  ];

  if (!open) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50 px-4"
      >
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-slate-500">
              buildspace://new_project
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal Content */}
          <div className="p-6 space-y-6">
            {/* Command Preview */}
            <div className="bg-black/30 rounded-md p-4 font-mono text-sm">
              <div className="text-slate-500 mb-2">
                {"// Initialize new project"}
              </div>
              {lines.map((line, i) => (
                <div key={line.label} className="flex gap-2">
                  <span className="text-[#e8ff47]">{">"}</span>
                  <span className="text-slate-500">{line.label}:</span>
                  <span className={line.value ? "text-white" : "text-slate-500/50"}>
                    {line.value || "..."}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">
                  {">"} project_name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setCurrentLine(0)}
                  placeholder="Enter project name..."
                  className="w-full bg-[#040404] border border-white/10 rounded-md px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-[#e8ff47] focus:border-[#e8ff47] transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">
                  {">"} description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={() => setCurrentLine(1)}
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full bg-[#040404] border border-white/10 rounded-md px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-[#e8ff47] focus:border-[#e8ff47] transition-all resize-none"
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">
                  {">"} tech_stack
                </label>
                <div
                  className="flex flex-wrap gap-2"
                  onFocus={() => setCurrentLine(2)}
                >
                  {availableTech.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleTech(tech)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                        selectedTech.includes(tech)
                          ? "bg-[#e8ff47] text-black"
                          : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">
                  {">"} github_url (optional)
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  onFocus={() => setCurrentLine(3)}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#040404] border border-white/10 rounded-md px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-500/50 focus:outline-none focus:ring-1 focus:ring-[#e8ff47] focus:border-[#e8ff47] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-4 py-3">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={onClose}
                className="font-mono text-sm text-slate-500 hover:text-white"
              >
                cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!name || !description || saving}
                className="font-mono text-sm bg-[#e8ff47] text-black hover:bg-[#e8ff47]/90 disabled:opacity-50"
              >
                {saving ? "Creating..." : "> create_project"}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
