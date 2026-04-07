/*
  SkillsGrid.jsx
  --------------
  Renders a user's skills as editable chips.
  If `editable` is true, shows a tiny input to add new skills
  and clicking a chip removes it.
*/

import { useState } from "react";
import Badge from "../ui/Badge";

export default function SkillsGrid({ skills = [], editable = false, onChange }) {
  const [input, setInput] = useState("");

  function addSkill(e) {
    e.preventDefault();
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
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <button
            key={skill}
            onClick={() => removeSkill(skill)}
            disabled={!editable}
            className={editable ? "cursor-pointer hover:opacity-70 transition-opacity" : "cursor-default"}
          >
            <Badge>
              {skill}
              {editable && " ×"}
            </Badge>
          </button>
        ))}
      </div>

      {editable && (
        <form onSubmit={addSkill} className="mt-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill…"
            className="flex-1 rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 cursor-pointer"
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
}
