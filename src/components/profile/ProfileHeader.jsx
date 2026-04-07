/*
  ProfileHeader.jsx
  -----------------
  Hero section at the top of a user's profile page.
  Shows avatar, name, bio, skill badges, and social links.
  If it's your own profile, shows the "Edit Profile" button.
*/

import { HiOutlinePencil, HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi";
import { useState } from "react";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function ProfileHeader({ profile, isOwn, onEdit }) {
  const [copied, setCopied] = useState(false);

  function copyProfileLink() {
    const url = `${window.location.origin}/u/${profile.username || profile.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Avatar src={profile.avatar_url} name={profile.display_name} size="xl" />

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-heading dark:text-white">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-sm text-muted mt-0.5">@{profile.username}</p>

          {profile.bio && (
            <p className="text-body dark:text-slate-300 mt-3 max-w-xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* skill badges */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          )}

          {/* social links */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-heading dark:hover:text-white transition-colors"
              >
                GitHub ↗
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-heading dark:hover:text-white transition-colors"
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>

        {/* action buttons */}
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={copyProfileLink}>
            {copied ? <HiOutlineCheck className="w-4 h-4" /> : <HiOutlineClipboard className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
          </Button>

          {isOwn && (
            <Button size="sm" onClick={onEdit}>
              <HiOutlinePencil className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
