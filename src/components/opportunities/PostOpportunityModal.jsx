/*
  PostOpportunityModal.jsx
  ------------------------
  Modal form for posting a new opportunity.
  Inserts into `opportunities` and also drops a feed_post
  so it shows up in the live feed.
*/

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PostOpportunityModal({ open, onClose, onCreated }) {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    type: "teammate",
    title: "",
    description: "",
    skills_needed: "",
    deadline: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give it a title first.");
      return;
    }

    setSaving(true);
    setError(null);

    const skillsArr = form.skills_needed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { data, error: insertErr } = await supabase
      .from("opportunities")
      .insert({
        poster_id:     user.id,
        type:          form.type,
        title:         form.title.trim(),
        description:   form.description.trim(),
        skills_needed: skillsArr,
        deadline:      form.deadline || null,
      })
      .select()
      .single();

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    // toss it on the feed too
    await supabase.from("feed_posts").insert({
      author_id: user.id,
      type:      "opportunity",
      ref_id:    data.id,
      content:   `Posted a new opportunity: ${data.title}`,
    });

    setSaving(false);
    setForm({ type: "teammate", title: "", description: "", skills_needed: "", deadline: "" });
    onCreated?.(data);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Post Opportunity">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* type selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-slate-200">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-heading dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="teammate">Looking for Teammate</option>
            <option value="hackathon">Hackathon</option>
            <option value="role">Role / Job</option>
          </select>
        </div>

        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Need a React dev for weekend hackathon"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-heading dark:text-slate-200">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            placeholder="Tell people what you're looking for…"
          />
        </div>

        <Input
          label="Skills Needed (comma separated)"
          value={form.skills_needed}
          onChange={(e) => setForm({ ...form, skills_needed: e.target.value })}
          placeholder="React, Python, UI/UX"
        />

        <Input
          label="Deadline (optional)"
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Posting…" : "Post Opportunity"}
        </Button>
      </form>
    </Modal>
  );
}
