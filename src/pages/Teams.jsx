import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Plus, ExternalLink } from "lucide-react";

// Noise overlay (matches Landing page)
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
      }}
    />
  );
}

// Dummy team data for populated state
const dummyTeams = [
  {
    id: 1,
    name: "Project Nova",
    status: "Active",
    role: "Frontend Developer",
    members: [
      { initials: "LM", color: "#e8ff47" },
      { initials: "AJ", color: "#888" },
      { initials: "SK", color: "#666" },
      { initials: "RN", color: "#555" },
    ],
    description: "Real-time collaborative code editor with AI assistance.",
  },
  {
    id: 2,
    name: "HackGT IX",
    status: "Active",
    role: "Full-Stack Engineer",
    members: [
      { initials: "PK", color: "#e8ff47" },
      { initials: "DR", color: "#888" },
      { initials: "MV", color: "#666" },
    ],
    description: "Accessible transit planning tool for urban communities.",
  },
  {
    id: 3,
    name: "Archon CLI",
    status: "Archived",
    role: "Backend Developer",
    members: [
      { initials: "TS", color: "#e8ff47" },
      { initials: "JD", color: "#888" },
    ],
    description: "Developer productivity CLI with plugin ecosystem.",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.15 },
  },
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Team Card Component
function TeamCard({ team, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative bg-[#0a0a0a] border p-5 rounded-none transition-all duration-300 flex flex-col justify-between
        ${isHovered ? "border-[#e8ff47]/40 shadow-[0_0_30px_rgba(232,255,71,0.04)]" : "border-[#1f1f1f]"}
      `}
    >
      {/* Top Row: Name + Status */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-bold text-white tracking-tight font-sans leading-tight">
            {team.name}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.15em] border rounded-none ${
              team.status === "Active"
                ? "text-[#e8ff47] border-[#e8ff47]/30 bg-[#e8ff47]/5"
                : "text-[#555] border-[#1f1f1f] bg-[#0a0a0a]"
            }`}
          >
            {team.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#666] font-sans leading-relaxed mb-4 line-clamp-2">
          {team.description}
        </p>

        {/* Role */}
        <div className="text-[11px] text-[#888] font-mono tracking-wide mb-5">
          Role:{" "}
          <span className="text-[#aaa]">{team.role}</span>
        </div>
      </div>

      {/* Bottom section */}
      <div>
        {/* Members Preview */}
        <div className="flex items-center mb-5">
          <div className="flex -space-x-2">
            {team.members.map((m, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center border border-[#1f1f1f] bg-[#040404] font-mono text-[9px] font-bold rounded-none"
                style={{ color: m.color, zIndex: team.members.length - i }}
              >
                {m.initials}
              </div>
            ))}
          </div>
          <span className="ml-3 text-[11px] text-[#555] font-mono">
            {team.members.length} member{team.members.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Go to Workspace */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium font-sans border rounded-none transition-all duration-200 cursor-pointer ${
            isHovered
              ? "border-[#e8ff47] bg-[#e8ff47] text-black"
              : "border-[#1f1f1f] bg-transparent text-[#888] hover:text-white hover:border-[#333]"
          }`}
        >
          Go to Workspace
          <ExternalLink size={12} />
        </button>
      </div>
    </motion.div>
  );
}

export default function TeamsPage() {
  const [myTeams, setMyTeams] = useState([]);

  const toggleData = () => {
    setMyTeams((prev) => (prev.length === 0 ? dummyTeams : []));
  };

  return (
    <div className="min-h-screen bg-[#040404] text-white font-sans">
      <NoiseOverlay />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto pt-12 px-6 pb-20 relative z-10">
        <AnimatePresence mode="wait">
          {myTeams.length === 0 ? (
            /* ─────────── EMPTY STATE ─────────── */
            <motion.div
              key="empty-state"
              variants={emptyVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="border-2 border-dashed border-[#1f1f1f] bg-[#0a0a0a]/50 p-12 flex flex-col items-center text-center max-w-2xl mx-auto rounded-none">
                <div className="flex items-center justify-center w-20 h-20 border border-[#1f1f1f] bg-[#040404] rounded-none mb-6">
                  <Users size={48} className="text-[#333333]" />
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight font-sans">
                  You haven't joined any teams yet.
                </h2>

                <p className="text-[#888888] text-sm mt-2 max-w-md leading-relaxed font-sans">
                  Discover projects looking for your specific skills or start
                  your own to build a squad.
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center gap-4 mt-8">
                  <Link to="/opportunities">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 bg-[#e8ff47] text-black px-6 py-3 text-sm font-bold rounded-none transition-all duration-200 hover:brightness-110 cursor-pointer"
                    >
                      Explore Opportunities
                      <ArrowRight size={14} />
                    </motion.button>
                  </Link>

                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 border border-[#1f1f1f] bg-transparent text-white px-6 py-3 text-sm font-medium rounded-none transition-all duration-200 hover:border-[#333] cursor-pointer"
                    >
                      <Plus size={14} />
                      Create a Project
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ─────────── POPULATED STATE ─────────── */
            <motion.div
              key="populated-state"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <motion.div variants={cardVariants}>
                <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
                  Your Active Teams
                </h1>
                <p className="text-[#888] text-sm mt-2 font-mono">
                  {myTeams.length} team{myTeams.length !== 1 ? "s" : ""} ·{" "}
                  {myTeams.filter((t) => t.status === "Active").length} active
                </p>
              </motion.div>

              {/* Grid */}
              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
              >
                {myTeams.map((team, index) => (
                  <TeamCard key={team.id} team={team} index={index} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dev Toggle Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleData}
            className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1f1f1f] text-[#888] px-4 py-2.5 text-xs font-mono rounded-none transition-all hover:border-[#e8ff47]/50 hover:text-white cursor-pointer shadow-xl"
          >
            <span className="w-2 h-2 bg-[#e8ff47] rounded-none inline-block" />
            Toggle Data
          </motion.button>
        </div>
      </div>
    </div>
  );
}
