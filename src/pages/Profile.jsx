import { useState, useRef, useMemo } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Calendar, ExternalLink, GitBranch, Star, Check, Copy, Globe, Pencil, Plus, X } from "lucide-react"
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"

// CSS generic utilities since we removed Radix/Shadcn
const cn = (...classes) => classes.filter(Boolean).join(" ")

// --- TILT CARD ---
function TiltCard({ children, className = "" }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`group relative ${className}`}
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  )
}

// --- BENTO CARD ---
function BentoCard({ children, className, delay = 0 }) {
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Tilt effect values
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    
    // For glow effect
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // For tilt effect
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay * 0.1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        background: isHovered
          ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(232, 255, 71, 0.06), transparent 40%)`
          : undefined,
      }}
      className={cn(
        "relative overflow-hidden rounded-none border border-white/10 bg-black/40 backdrop-blur-xl",
        "transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10 h-full" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(232, 255, 71, 0.03), transparent 40%)`,
        }}
      />
    </motion.div>
  )
}

// --- PROFILE HEADER ---
function ProfileHeader({
  name,
  username,
  bio,
  location,
  joinDate,
  avatarUrl,
  isLive = false,
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    name,
    bio,
    location,
    avatarUrl
  });

  const handleSave = () => {
    // Here you would typically save to backend/database
    console.log('Saving profile data:', editData);
    setIsEditOpen(false);
  };

  return (
    <>
      <BentoCard className="col-span-1 md:col-span-2 row-span-2 p-6 lg:p-8" delay={0}>
        <div className="flex h-full flex-col gap-6">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center text-sm px-3 py-1 cursor-pointer font-mono border border-white/5 text-slate-400 hover:text-[#e8ff47] hover:bg-[#e8ff47]/10 hover:border-[#e8ff47]/30 transition-all rounded-none"
            >
              <Pencil className="size-3.5 mr-1.5" />
              Edit
            </button>
          </div>

          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-none ring-2 ring-[#e8ff47]/20 border border-white/5 overflow-hidden">
                <img src={editData.avatarUrl} alt={editData.name} className="w-full h-full object-cover" />
              </div>
              {isLive && (
                <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 rounded-none bg-black px-2 py-1 border border-[#e8ff47]/30">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8ff47] opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#e8ff47]" />
                  </span>
                  <span className="text-xs font-mono font-medium text-[#e8ff47]">LIVE</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="font-sans text-2xl font-bold tracking-tight text-white lg:text-3xl text-balance">
                {editData.name}
              </h1>
              <p className="text-slate-400 font-mono text-sm mt-1">@{username}</p>
            </div>
          </div>
          <p className="text-slate-300 flex-1 leading-relaxed text-pretty">
            {editData.bio}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="size-4 text-[#e8ff47]" />
              <span>{editData.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="size-4 text-[#e8ff47]" />
              <span>Joined {joinDate}</span>
            </div>
          </div>
        </div>
      </BentoCard>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsEditOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#050505] border border-white/10 w-full max-w-lg p-6 rounded-none relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsEditOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2">Edit Profile</h3>
              <p className="text-slate-400 text-sm mb-6">Update your profile information</p>
              
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-none focus:outline-none focus:border-[#e8ff47] transition-colors"
                    placeholder="Your name"
                  />
                </div>

                {/* Bio Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">Bio</label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-none focus:outline-none focus:border-[#e8ff47] transition-colors resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                {/* Location Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-none focus:outline-none focus:border-[#e8ff47] transition-colors"
                    placeholder="Your location"
                  />
                </div>

                {/* Avatar URL Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">Avatar URL</label>
                  <input
                    type="url"
                    value={editData.avatarUrl}
                    onChange={(e) => setEditData({ ...editData, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-none focus:outline-none focus:border-[#e8ff47] transition-colors"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-mono text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors rounded-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 text-sm font-mono text-black bg-[#e8ff47] hover:bg-[#e8ff47]/90 transition-colors rounded-none"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- 3D SKILL CORE ---
// --- SKILLS GRID ---
const levelColors = {
  beginner: "bg-slate-500/10 text-slate-400",
  intermediate: "bg-blue-500/10 text-blue-400",
  advanced: "bg-purple-500/10 text-purple-400",
  expert: "bg-[#e8ff47]/10 text-[#e8ff47]",
}

const levelBorders = {
  beginner: "border-slate-500/30",
  intermediate: "border-blue-500/30",
  advanced: "border-purple-500/30",
  expert: "border-[#e8ff47]/30 shadow-[0_0_20px_rgba(232,255,71,0.05)]",
}

function SkillsGrid({ initialSkills }) {
  const [skills, setSkills] = useState(initialSkills)
  const [newSkill, setNewSkill] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), level: "intermediate" }])
      setNewSkill("")
    }
  }

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  return (
    <>
      <BentoCard className="col-span-1 md:col-span-2 p-6" delay={1}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Skills</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center text-sm px-3 py-1 cursor-pointer font-mono border border-white/5 text-slate-400 hover:text-[#e8ff47] hover:bg-[#e8ff47]/10 hover:border-[#e8ff47]/30 transition-all rounded-none"
          >
            <Pencil className="size-3.5 mr-1.5" />
            Edit
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name + index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative cursor-default border px-3 py-1 text-xs font-mono transition-all duration-300 ${levelColors[skill.level]} ${levelBorders[skill.level]} rounded-none`}
            >
              <span>{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </BentoCard>

      {/* Skills Edit Modal - Outside BentoCard */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#050505] border border-white/10 w-full max-w-md p-6 rounded-none relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2">Edit Skills</h3>
              <p className="text-slate-400 text-sm mb-6">Add or remove your technical skills</p>
              
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  className="flex-1 bg-[#0a0a0a] border border-white/10 text-white placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:border-[#e8ff47] transition-colors rounded-none"
                />
                <button
                  onClick={addSkill}
                  className="bg-[#e8ff47] text-black hover:bg-[#e8ff47]/90 px-4 py-2 cursor-pointer transition-colors rounded-none font-mono font-bold"
                >
                  +
                </button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {skills.map((skill, index) => (
                  <div
                    key={skill.name + index}
                    className="flex items-center justify-between rounded-none border border-white/10 bg-[#0a0a0a] px-3 py-2"
                  >
                    <span className="text-white text-sm font-mono">{skill.name}</span>
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1 transition-colors rounded-none cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-mono text-slate-400 border border-white/10 hover:text-white hover:border-white/20 transition-colors rounded-none"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// --- SHARE LINKS ---
function ShareLinks({ profileUrl, socialLinks }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socialIcons = [
    { icon: FiGithub, href: socialLinks.github, label: "GitHub" },
    { icon: FiLinkedin, href: socialLinks.linkedin, label: "LinkedIn" },
    { icon: FiTwitter, href: socialLinks.twitter, label: "Twitter" },
    { icon: Globe, href: socialLinks.website, label: "Website" },
  ].filter((item) => item.href)

  return (
    <BentoCard className="p-6 col-span-1" delay={4}>
      <h2 className="text-lg font-semibold text-white mb-4">Connect</h2>
      <div className="space-y-4">
        <button
          onClick={copyToClipboard}
          className="w-full bg-[#e8ff47] text-black border border-transparent hover:border-black cursor-pointer font-bold relative overflow-hidden h-10 flex items-center justify-center rounded-none"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm font-mono"
              >
                <Check className="size-4" />
                Link Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm font-mono"
              >
                <Copy className="size-4" />
                Share Profile
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <div className="flex justify-center gap-3">
          {socialIcons.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-[#e8ff47]/50 hover:bg-[#e8ff47]/10 rounded-none cursor-pointer"
            >
              <Icon className="size-5 text-white group-hover:text-[#e8ff47] transition-colors" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[#e8ff47]/20 to-transparent" />
            </a>
          ))}
        </div>
      </div>
    </BentoCard>
  )
}

// --- STATS CARD ---
function StatsCard({ stats }) {
  return (
    <BentoCard className="p-6 col-span-1" delay={5}>
      <h2 className="text-lg font-semibold text-white mb-4">Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="text-center"
          >
            <p className="text-2xl font-bold text-[#e8ff47]">{stat.value}</p>
            <p className="text-xs text-slate-500 font-mono mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  )
}

// --- PROJECTS SECTION ---
const languageColors = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Rust: "#dea584",
  Go: "#00add8",
}

function ProjectsSection({ projects }) {
  return (
    <BentoCard className="col-span-1 md:col-span-4 p-6" delay={3}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <a
          href="#"
          className="text-sm font-mono text-slate-500 hover:text-[#e8ff47] transition-colors flex items-center gap-1 cursor-pointer"
        >
          View all
          <ExternalLink className="size-3" />
        </a>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="group flex-shrink-0 w-[280px] border border-white/10 bg-black/60 p-4 hover:border-[#e8ff47]/30 transition-all duration-300 rounded-none cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="size-4 text-[#e8ff47]" />
                <h3 className="font-medium text-white group-hover:text-[#e8ff47] transition-colors">
                  {project.name}
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                <Star className="size-3" />
                {project.stars}
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-3 line-clamp-2">
              {project.description}
            </p>
            <div className="bg-[#050505] p-3 font-mono text-xs overflow-hidden border border-white/5 rounded-none">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <div className="flex gap-1">
                  <span className="size-2 rounded-none bg-red-500/60" />
                  <span className="size-2 rounded-none bg-amber-500/60" />
                  <span className="size-2 rounded-none bg-emerald-500/60" />
                </div>
                <span className="text-[10px]">{project.name}.ts</span>
              </div>
              <pre className="text-[#e8ff47]/80 overflow-hidden text-ellipsis whitespace-nowrap">
                {project.codeSnippet}
              </pre>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="size-3 rounded-none"
                style={{ backgroundColor: languageColors[project.language] || "#888" }}
              />
              <span className="text-xs text-slate-500 font-mono">{project.language}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </BentoCard>
  )
}

// --- MAIN PROFILE PAGE ---
const profileData = {
  name: "Alex Chen",
  username: "alexchen",
  bio: "Full-stack developer passionate about building beautiful, performant web experiences. Currently crafting developer tools and open-source libraries. Love exploring the intersection of design and engineering.",
  location: "San Francisco, CA",
  joinDate: "March 2026",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  isLive: true,
}

const skills = [
  { name: "TypeScript", level: "expert" },
  { name: "React", level: "expert" },
  { name: "Next.js", level: "expert" },
  { name: "Node.js", level: "advanced" },
  { name: "PostgreSQL", level: "advanced" },
  { name: "GraphQL", level: "advanced" },
  { name: "Rust", level: "intermediate" },
  { name: "WebGL", level: "intermediate" },
  { name: "Docker", level: "advanced" },
  { name: "AWS", level: "advanced" },
]

const projects = [
  {
    name: "buildspace-cli",
    description: "A powerful CLI tool for scaffolding and managing BuildSpace projects",
    language: "TypeScript",
    stars: 342,
    codeSnippet: "export const init = async () => { ... }",
  },
  {
    name: "react-glow",
    description: "Beautiful glow effects for React components with zero dependencies",
    language: "TypeScript",
    stars: 1289,
    codeSnippet: "const useGlow = (ref) => { ... }",
  },
  {
    name: "neural-canvas",
    description: "AI-powered creative canvas for generative art",
    language: "Python",
    stars: 567,
    codeSnippet: "model.generate(prompt, style)",
  },
  {
    name: "velocity-db",
    description: "High-performance in-memory database for real-time applications",
    language: "Rust",
    stars: 892,
    codeSnippet: "impl Storage for VelocityDB { }",
  },
]

const stats = [
  { label: "Projects", value: "47" },
  { label: "Commits", value: "2.4k" },
  { label: "Followers", value: "1.2k" },
  { label: "Stars", value: "8.9k" },
]

const socialLinks = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  website: "https://alexchen.dev",
}

export default function Profile() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#040404] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#e8ff47]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl px-4 py-8 lg:py-12 z-10">
        <div className="mb-8">
          <h1 className="text-sm font-mono font-medium text-[#e8ff47] tracking-widest uppercase">
            BuildSpace
          </h1>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ProfileHeader {...profileData} />
          <SkillsGrid initialSkills={skills} />
          <ShareLinks profileUrl="https://buildspace.so/alexchen" socialLinks={socialLinks} />
          <StatsCard stats={stats} />
          <ProjectsSection projects={projects} />
        </div>
      </div>
    </div>
  )
}
