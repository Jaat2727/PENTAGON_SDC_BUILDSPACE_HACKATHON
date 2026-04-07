import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Calendar, ExternalLink, GitBranch, Star, Check, Copy, Globe, FolderGit2, Pencil, Share2, Terminal, Plus } from "lucide-react"
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"
import ProjectCard from "./ProjectCard"

const cn = (...classes) => classes.filter(Boolean).join(" ")

// --- SHARP BENTO CARD ---
function BentoCard({ children, className, delay = 0 }) {
  const cardRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={cn(
        "relative overflow-hidden border border-[#1f1f1f] bg-[#0a0a0a] rounded-none transition-all duration-300",
        className
      )}
    >
      {/* Interactive Glow Effect */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(232, 255, 71, 0.05), transparent 80%)`,
        }}
      />
      <div className="relative z-10 h-full" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  )
}

// --- GHOST BUTTON ---
const GhostButton = ({ children, onClick, icon: Icon, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 bg-transparent border border-[#1f1f1f] text-[#888] hover:text-[#e8ff47] hover:border-[#e8ff47]/30 font-mono text-xs uppercase tracking-widest transition-all rounded-none flex items-center gap-2 group",
      className
    )}
  >
    {Icon && <Icon size={12} className="group-hover:scale-110 transition-transform" />}
    {children}
  </button>
)

export default function ProfileView({ userData, isOwn, onEdit }) {
  const { profile, skills, connect, stats, projects } = userData
  const [copied, setCopied] = useState(false)

  const copyProfileLink = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasSkills = Object.values(skills?.categorized || {}).some(arr => arr.length > 0)
  const hasSocials = connect && Object.values(connect).some(val => val)
  const hasProjects = projects && projects.length > 0

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-[#e8ff47] selection:text-black font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* --- GRID SYSTEM --- */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-5">
          
          {/* A. PRIMARY PROFILE CARD */}
          <BentoCard className="md:col-span-6 lg:col-span-7 p-8 lg:p-10" delay={0.1}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-10">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#333]">core_identity_v2.1</span>
                {isOwn && (
                  <button 
                    onClick={onEdit}
                    className="flex items-center gap-2 text-[10px] font-mono text-[#444] hover:text-[#e8ff47] transition-colors uppercase tracking-widest group"
                  >
                    <Pencil size={12} className="group-hover:rotate-12 transition-transform" />
                    edit_registry
                  </button>
                )}
              </div>

              <div className="flex items-start gap-8 mb-10">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 bg-[#050505] border border-[#1f1f1f] rounded-none overflow-hidden group">
                    <img 
                      src={profile.avatarUrl || "/default-avatar.png"} 
                      alt={profile.name} 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" 
                    />
                  </div>
                  {profile.isLive && (
                    <div className="absolute -bottom-2 -right-2 bg-black border border-[#e8ff47]/40 px-2 py-0.5 flex items-center gap-2 shadow-2xl rounded-none">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8ff47] opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-[#e8ff47]" />
                      </span>
                      <span className="text-[9px] font-mono text-[#e8ff47] font-bold tracking-tighter">ONLINE</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 pt-2">
                  <h1 className="text-4xl font-bold tracking-tighter text-white mb-1 uppercase">{profile.name}</h1>
                  <p className="text-sm font-mono text-[#444] tracking-widest">@{profile.handle}</p>
                </div>
              </div>

              <div className="flex-1">
                {profile.bio ? (
                  <p className="text-sm text-[#888] leading-relaxed max-w-lg mb-10 border-l border-[#1f1f1f] pl-6 py-2">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-[#333] text-sm italic mb-10 pl-6 border-l border-[#111]">This user hasn't added a bio yet.</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-[#1a1a1a] text-[10px] font-mono text-[#333] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[#222]" />
                  <span>{profile.location || "UNLINKED_LOCATION"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-[#222]" />
                  <span>ACTIVE_SINCE_{profile.joinDate}</span>
                </div>
              </div>
            </div>
          </BentoCard>

          {/* B. SKILLS REGISTRY */}
          <BentoCard className="md:col-span-6 lg:col-span-5 p-8" delay={0.2}>
            <div className="flex flex-col h-full">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#333] mb-10">technical_arsenal</span>
              
              {hasSkills ? (
                <div className="space-y-6">
                  {Object.entries(skills.categorized).map(([category, items]) => (
                    items.length > 0 && (
                      <div key={category} className="space-y-3">
                        <p className="text-[9px] font-mono text-[#555] uppercase tracking-[0.3em] font-bold">[{category}]</p>
                        <div className="flex flex-wrap gap-2">
                          {items.map(skill => (
                            <span key={skill} className="px-3 py-1 text-[10px] font-mono text-[#e8ff47] bg-[#e8ff47]/5 border border-[#e8ff47]/10 rounded-none uppercase">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-[#1f1f1f] p-8 space-y-4">
                  <p className="text-[#444] text-xs font-mono uppercase tracking-widest">No skills added yet.</p>
                  {isOwn && <GhostButton icon={Plus} onClick={onEdit}>Add Skills</GhostButton>}
                </div>
              )}

              <div className="mt-auto pt-10 opacity-5 grayscale pointer-events-none">
                <Terminal size={40} />
              </div>
            </div>
          </BentoCard>

          {/* C. CONNECTION PROTOCOLS */}
          <BentoCard className="md:col-span-3 lg:col-span-4 p-8" delay={0.3}>
            <div className="flex flex-col h-full space-y-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#333]">connection_protocols</span>
              
              <button
                onClick={copyProfileLink}
                className="group relative w-full h-12 bg-[#e8ff47] text-black text-xs font-bold font-mono overflow-hidden transition-all active:scale-95 rounded-none"
              >
                <div className="absolute inset-0 flex items-center justify-center gap-2 group-hover:-translate-y-full transition-transform duration-300">
                  <Share2 size={14} />
                  <span>SHARE_PROFILE</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "COPIED_TO_CLIPBOARD" : "COPY_LINK"}</span>
                </div>
              </button>

              {hasSocials ? (
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: FiGithub, href: connect.githubUrl },
                    { icon: FiLinkedin, href: connect.linkedinUrl },
                    { icon: Globe, href: connect.websiteUrl },
                  ].map(({ icon: Icon, href }, i) => (
                    <a
                      key={i}
                      href={href || "#"}
                      target={href ? "_blank" : undefined}
                      className={cn(
                        "aspect-square border border-[#1f1f1f] bg-[#050505] flex items-center justify-center transition-all rounded-none",
                        href ? "hover:border-[#e8ff47]/50 hover:bg-[#e8ff47]/5 text-[#444] hover:text-[#e8ff47]" : "opacity-10 cursor-not-allowed text-[#222]"
                      )}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                  <div className="aspect-square border border-[#1f1f1f] bg-[#050505] flex items-center justify-center text-[#222] opacity-20">
                    <Terminal size={18} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[#333] text-xs font-mono uppercase tracking-widest text-center">No social links connected.</p>
                  {isOwn && <GhostButton icon={Plus} className="w-full justify-center" onClick={onEdit}>Link Accounts</GhostButton>}
                </div>
              )}
            </div>
          </BentoCard>

          {/* D. ACTIVITY METRICS */}
          <BentoCard className="md:col-span-3 lg:col-span-8 p-8" delay={0.4}>
            <div className="flex flex-col h-full space-y-10">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#333]">activity_metrics</span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { label: "Projects", value: stats.projects },
                  { label: "Commits", value: stats.commits },
                  { label: "Followers", value: stats.followers },
                  { label: "Stars", value: stats.stars },
                ].map((stat, i) => (
                  <div key={i} className="group/stat">
                    <p className="text-5xl font-bold text-white tracking-tighter mb-2 font-mono group-hover:text-[#e8ff47] transition-colors">
                      {stat.value}
                    </p>
                    <p className="text-[9px] font-mono text-[#333] uppercase tracking-[0.3em]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* E. PROJECT GALLERY (Full Width) */}
          <div className="md:col-span-6 lg:col-span-12 mt-16 pb-20">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-bold tracking-tight uppercase">Recent Shipped Projects</h2>
                <div className="h-px w-24 bg-[#1f1f1f]" />
              </div>
              <a href="#" className="flex items-center gap-3 text-[10px] font-mono text-[#333] hover:text-[#e8ff47] transition-colors uppercase tracking-[0.3em]">
                view_all_deployment <ExternalLink size={12} />
              </a>
            </div>

            {hasProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#1f1f1f] bg-[#0a0a0a]/50 p-16 flex flex-col items-center justify-center text-center mt-10 rounded-none">
                <FolderGit2 size={48} className="text-[#333333] mb-6" />
                <p className="text-white text-sm font-bold uppercase tracking-widest mt-6">No projects shipped yet.</p>
                <p className="text-[#888888] text-xs font-mono mt-2 mb-8 uppercase tracking-wider">Add projects to showcase your building skills.</p>
                {isOwn && <GhostButton icon={Plus} onClick={() => window.location.href='/dashboard'}>Add Project</GhostButton>}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
