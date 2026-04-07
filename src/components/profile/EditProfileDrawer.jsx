/*
  EditProfileDrawer.jsx
  ---------------------
  Futuristic slide-over drawer with BuildSpace aesthetics.
*/

import { useState, useEffect } from "react";
import { X, Save, User, Globe, MapPin } from "lucide-react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import SkillsGrid from "./SkillsGrid";

export default function EditProfileDrawer({ open, onClose, profile, onSave }) {
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    location: "",
    skills: [],
    avatar_url: "",
    commits_count: 0,
    followers_count: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        website_url: profile.website_url || "",
        location: profile.location || "",
        skills: profile.skills || [],
        avatar_url: profile.avatar_url || "",
        commits_count: profile.commits_count || 0,
        followers_count: profile.followers_count || 0,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await onSave(form);
      if (result?.error) {
        setError(result.error.message || "Failed to update profile. Check if database columns exist.");
        setSaving(false);
      } else {
        setSaving(false);
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setSaving(false);
    }
  }

  if (!isVisible) return null;

  const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-mono uppercase tracking-wider text-[#666] flex items-center gap-2">
        {Icon && <Icon size={12} className="text-[#444]" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-2 text-sm text-white focus:outline-none focus:border-[#e8ff47]/50 font-mono placeholder:text-[#333]"
      />
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* drawer panel */}
      <div className={`relative w-full max-w-lg border-l border-[#1f1f1f] shadow-2xl transform transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="h-full bg-[#040404] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#1f1f1f]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#e8ff47]/10 border border-[#e8ff47]/20">
                <User size={20} className="text-[#e8ff47]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Edit Profile</h2>
                <p className="text-[10px] font-mono text-[#666]">Customize your developer presence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#666] hover:text-white transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                <p className="font-bold mb-1 uppercase tracking-widest">SYSTEM_ERROR_CODE: DATABASE_SYNC_FAILED</p>
                <p>{error}</p>
                <p className="mt-2 text-[10px] opacity-70 italic">Please ensure you have run the latest migration (003_update_profiles_and_projects.sql) in your Supabase SQL Editor.</p>
              </div>
            )}
            {/* Basic Info */}
            <div className="space-y-6">
              <InputField
                label="Display Name"
                icon={User}
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="Alex Chen"
              />
              
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-[#666] flex items-center gap-2">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Full-stack developer passionate about building beautiful experiences..."
                  className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e8ff47]/50 font-mono placeholder:text-[#333] resize-none"
                />
              </div>

               <InputField
                label="Location"
                icon={MapPin}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="San Francisco, CA"
              />

              <InputField
                label="Avatar URL"
                icon={User}
                value={form.avatar_url}
                onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            {/* Skills */}
            <div className="space-y-4 pt-4 border-t border-[#1f1f1f]">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#666]">Technical Arsenal</label>
              <SkillsGrid
                skills={form.skills}
                editable
                onChange={(skills) => setForm({ ...form, skills })}
              />
            </div>

            {/* Socials */}
            <div className="space-y-6 pt-4 border-t border-[#1f1f1f]">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#666]">Connect</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="GitHub"
                  icon={FiGithub}
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  placeholder="github.com/..."
                />
                <InputField
                  label="LinkedIn"
                  icon={FiLinkedin}
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  placeholder="linkedin.com/in/..."
                />
                <InputField
                  label="Twitter"
                  icon={FiTwitter}
                  value={form.twitter_url}
                  onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                  placeholder="twitter.com/..."
                />
                <InputField
                  label="Website"
                  icon={Globe}
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="portfolio.com"
                />
              </div>
            </div>

            {/* Mock Stats (Optional for user convenience) */}
            <div className="space-y-6 pt-4 border-t border-[#1f1f1f]">
              <label className="text-[10px] font-mono uppercase tracking-wider text-[#666]">Performance Stats</label>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Commits"
                  type="number"
                  value={form.commits_count}
                  onChange={(e) => setForm({ ...form, commits_count: parseInt(e.target.value) || 0 })}
                />
                <InputField
                  label="Followers"
                  type="number"
                  value={form.followers_count}
                  onChange={(e) => setForm({ ...form, followers_count: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#1f1f1f] bg-[#0a0a0a]/50 flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-mono font-bold border border-[#1f1f1f] text-[#666] hover:text-white hover:border-[#333] transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 bg-[#e8ff47] text-black text-xs font-bold font-mono border border-[#e8ff47] shadow-[0_0_20px_rgba(232,255,71,0.2)] hover:shadow-[0_0_30px_rgba(232,255,71,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <div className="size-4 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : <Save size={16} />}
              SAVE_CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

