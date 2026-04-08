/*
  SkillsGrid.jsx
  --------------
  Futuristic skills display with BuildSpace aesthetics.
*/

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function SkillsGrid({ skills = [], editable = false, onChange }) {
  const [input, setInput] = useState("");

  const skillColors = {
    TypeScript: "#e8ff47",
    React: "#e8ff47",
    "Next.js": "#e8ff47",
    "Node.js": "#999",
    PostgreSQL: "#a855f7",
    GraphQL: "#a855f7",
    Rust: "#f97316",
    WebGL: "#3b82f6",
    Docker: "#3b82f6",
    AWS: "#f97316",
  };

  function addSkill(e) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput("");
  }

  function removeSkill(skill) {
    if (!editable) return;
    onChange(skills.filter((s) => s !== skill));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => {
          const color = skillColors[skill] || "#666";
          return (
            <button
              key={skill}
              onClick={() => removeSkill(skill)}
              disabled={!editable}
              className={`group relative px-2.5 py-1 text-[10px] font-mono border transition-all duration-300 ${
                editable 
                  ? "cursor-pointer hover:border-red-500/50 hover:bg-red-500/5" 
                  : "cursor-default"
              } bg-[#0a0a0a] border-[#1f1f1f]`}
              style={{ 
                color: color,
                borderColor: editable ? undefined : `${color}33`,
              }}
            >
              <span className="relative flex items-center gap-2">
                {skill}
                {editable && (
                  <X size={10} className="text-[#444] group-hover:text-red-400 transition-colors" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {editable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addSkill(e);
              }
            }}
            placeholder="Add a skill..."
            className="flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8ff47]/50 font-mono placeholder:text-[#333]"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 bg-[#111] border border-[#1f1f1f] text-[#666] hover:text-[#e8ff47] hover:border-[#e8ff47]/30 transition-all font-mono text-[10px] flex items-center gap-2 cursor-pointer"
          >
            <Plus size={12} />
            ADD
          </button>
        </div>
      )}
    </div>
  );
}

