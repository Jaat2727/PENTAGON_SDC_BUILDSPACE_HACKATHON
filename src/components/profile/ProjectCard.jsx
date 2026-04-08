import React from 'react';
import { motion } from 'framer-motion';
import { Star, GitBranch, Terminal, Trash2 } from 'lucide-react';

const languageColors = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  React: '#61dafb',
  default: '#e8ff47'
};

const isCreatedToday = (createdAt) => {
  if (!createdAt) return false;

  const created = new Date(createdAt);
  const today = new Date();

  return (
    created.getDate() === today.getDate() &&
    created.getMonth() === today.getMonth() &&
    created.getFullYear() === today.getFullYear()
  );
};

export default function ProjectCard({ project, onDelete, isOwner, className }) {
  const {
    title,
    description,
    stars_count = 0,
    language = 'TypeScript',
    code_snippet = 'export const init = async () => {\n  console.log("Building...")\n}',
    tech_stack = [],
    created_at,
    id,
    owner_id
  } = project;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("// PROTOCOL_TERMINATION: Are you sure you want to permanently delete this repository archive?")) {
      onDelete(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-[#0a0a0a] border border-[#1f1f1f] hover:border-[#e8ff47] transition-all duration-300 rounded-none overflow-hidden h-full ${className || ''}`}
    >
      {/* Premium subtle glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(400px circle at center, rgba(232,255,71,0.04), transparent 60%)'
        }}
      />

      <div className="relative p-5 space-y-4 z-10">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#050505] border border-[#1f1f1f] group-hover:border-[#e8ff47]/20 transition-colors">
              <GitBranch size={16} className="text-[#666] group-hover:text-[#e8ff47] transition-colors" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-mono text-[#444] uppercase tracking-widest">protocol_v1.0.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#050505] border border-[#1f1f1f] group-hover:border-[#e8ff47]/20">
              <Star size={12} className="text-[#e8ff47]" />
              <span className="text-[10px] font-mono text-white">{stars_count}</span>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="p-2 text-[#222] hover:text-red-500 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/20"
                title="Delete Project"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#666] leading-relaxed line-clamp-2 min-h-[32px]">
          {description}
        </p>

        {/* Code Snippet Preview */}
        <div className="relative group/code">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#e8ff47]/20 to-transparent opacity-0 group-hover/code:opacity-100 transition-opacity" />
          <div className="relative bg-[#050505] border border-[#111] p-3 font-mono text-[10px] overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2 opacity-30">
              <div className="w-1.5 h-1.5 bg-red-500/50" />
              <div className="w-1.5 h-1.5 bg-yellow-500/50" />
              <div className="w-1.5 h-1.5 bg-green-500/50" />
              <span className="ml-2 lowercase text-[9px]">{title.toLowerCase()}.ts</span>
            </div>
            <pre className="text-[#888] leading-tight select-none">
              <code>{code_snippet}</code>
            </pre>

            {/* Terminal Overlay for interactive feel */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover/code:opacity-40 transition-opacity">
              <Terminal size={14} className="text-[#e8ff47]" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2"
              style={{ backgroundColor: languageColors[language] || languageColors.default }}
            />
            <span className="text-[10px] font-mono text-[#666]">{language}</span>
          </div>

          <div className="flex gap-1.5">
            {tech_stack.slice(0, 2).map(tech => (
              <span key={tech} className="text-[9px] font-mono text-[#444] border border-[#1f1f1f] px-1.5 py-0.5">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle border line on bottom that grows on hover */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-[#e8ff47] w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
    </motion.div>
  );
}
