/*
  ProjectCard.jsx
  ---------------
  Premium glassmorphic project card with hover glow effect.
  Shows title, description, tech stack badges, and status.
  Supports join requests — when a user clicks "Join Team",
  a request is sent to the project owner via useJoinRequests.
*/

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { HiOutlineCode } from "react-icons/hi";
import { useState } from "react";
import { useJoinRequests } from "../../hooks/useJoinRequests";
import useAuthStore from "../../store/authStore";

export default function ProjectCard({ project, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const isOpen = project.status === "open";

  const user = useAuthStore((s) => s.user);
  const { sendJoinRequest, hasRequested, getRequestStatus } = useJoinRequests();

  const alreadyRequested = hasRequested(project.id);
  const requestStatus = getRequestStatus(project.id);
  const isOwner = project.owner_id === user?.id;

  const handleJoinTeam = async () => {
    if (!user || alreadyRequested || !isOpen || isOwner) return;
    setIsRequesting(true);
    const result = await sendJoinRequest(project.id, project.owner_id, project.title);
    setIsRequesting(false);
    if (result.error) {
      alert(result.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`card p-6 flex flex-col h-full group relative transition-all duration-300 ${isHovered ? "shadow-[0_0_30px_rgba(232,255,71,0.15)] border-[#e8ff47]/30" : ""
        }`}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider ${isOpen ? "text-[#e8ff47]" : "text-slate-500"
          }`}>
          <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-[#e8ff47] animate-pulse" : "bg-slate-500"
            }`} />
          {project.status}
        </span>
      </div>

      {/* Project Title */}
      <Link
        to={`/projects/${project.id}`}
        className="text-lg font-semibold text-white pr-16 mb-2 font-mono hover:text-[#e8ff47] transition-colors line-clamp-1"
      >
        {project.title}
      </Link>

      {/* Description */}
      <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
        {project.description}
      </p>

      {/* Tech Stack Pills */}
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack.slice(0, 5).map((tech) => (
            <Badge
              key={tech}
              color="slate"
              className="bg-[#e8ff47]/10 text-[#e8ff47] border-[#e8ff47]/30 font-mono text-xs"
            >
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {/* Team Section */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Team:</span>
          <div className="flex -space-x-2">
            {project.members?.slice(0, 4).map((member, i) => (
              <Avatar
                key={i}
                src={member.profiles?.avatar_url}
                name={member.profiles?.display_name}
                size="sm"
                className="w-7 h-7 border-2 border-[#040404]"
              />
            ))}
            {project.members && project.members.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#040404] flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-mono">
                  +{project.members.length - 4}
                </span>
              </div>
            )}
            {(!project.members || project.members.length === 0) && (
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                <HiOutlineCode className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        </div>

        {/* Join Team Button */}
        <Button
          size="sm"
          onClick={handleJoinTeam}
          disabled={!isOpen || isRequesting || alreadyRequested || isOwner}
          className={`font-mono text-xs transition-all duration-200 ${requestStatus === "accepted"
              ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
              : requestStatus === "declined"
                ? "bg-red-500/20 text-red-400 border border-red-500/30 cursor-default"
                : alreadyRequested
                  ? "bg-[#e8ff47]/20 text-[#e8ff47] border border-[#e8ff47]/30 cursor-default"
                  : isOwner
                    ? "bg-slate-700 text-slate-400 cursor-default"
                    : isHovered && isOpen
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-[#e8ff47] text-black hover:bg-[#e8ff47]/90"
            }`}
        >
          {isRequesting ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⟳
              </motion.span>
              Sending...
            </motion.span>
          ) : requestStatus === "accepted" ? (
            "✓ Joined"
          ) : requestStatus === "declined" ? (
            "Declined"
          ) : alreadyRequested ? (
            "Request Sent"
          ) : isOwner ? (
            "Your Project"
          ) : !isOpen ? (
            "Closed"
          ) : (
            "Join Team"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
