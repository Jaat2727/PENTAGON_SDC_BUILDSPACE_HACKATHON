import { useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Calendar,
  X,
  Zap,
  Briefcase,
  Plus
} from "lucide-react"

// Noise overlay SVG
function NoiseOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

// 3D Magnetic Button Component
function MagneticButton({
  children,
  onClick,
  className = "",
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY

    x.set(distX * 0.3)
    y.set(distY * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`flex items-center gap-2 bg-[#e8ff47] px-4 py-2 text-sm font-bold text-black transition-shadow hover:shadow-[0_0_20px_rgba(232,255,71,0.3)] rounded-none ${className}`}
    >
      {children}
    </motion.button>
  )
}

// 3D Tilt Card Component
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
        className="h-full transition-shadow duration-300 group-hover:shadow-[0_5px_30px_rgba(232,255,71,0.08)]"
      >
        {children}
      </div>
    </motion.div>
  )
}

function OpportunityCard({ opportunity }) {
  const typeColors = {
    role: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Open Role" },
    hackathon: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Hackathon" },
    closed: { bg: "bg-[#333]", text: "text-[#666]", label: "Closed" },
  }

  const typeStyle = typeColors[opportunity.type]

  return (
    <TiltCard className="w-full">
      <div className="flex h-full flex-col border border-[#1f1f1f] bg-[#0a0a0a] p-3 rounded-none">
        <div className="mb-2 flex items-center justify-between">
          <span className={`${typeStyle.bg} ${typeStyle.text} px-2 py-1 text-xs font-medium`}>{typeStyle.label}</span>
          {opportunity.company && <span className="text-xs text-[#666]">{opportunity.company}</span>}
        </div>
        <h3 className="mb-2 text-sm font-medium tracking-tight text-white">{opportunity.title}</h3>
        <p className="mb-3 flex-1 text-xs leading-relaxed text-[#666]">{opportunity.description}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {opportunity.skills.map((skill) => (
            <span key={skill} className="bg-[#111] px-2 py-1 text-xs text-[#888]">
              {skill}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-2">
          <div className="flex items-center gap-1 text-xs text-[#555]">
            <Calendar className="h-3 w-3" />
            {opportunity.deadline}
          </div>
          <button className="border border-[#1f1f1f] bg-transparent px-3 py-1 text-xs text-white transition-colors hover:border-[#e8ff47] hover:text-[#e8ff47] cursor-pointer rounded-none">
            View
          </button>
        </div>
      </div>
    </TiltCard>
  )
}

// Sample data
const opportunities = [
  {
    id: "1",
    type: "role",
    title: "Senior Frontend Engineer",
    description: "Build next-gen developer tools with React and TypeScript. Remote-first team.",
    skills: ["React", "TypeScript", "Node.js"],
    deadline: "Apr 15, 2026",
    company: "Vercel",
  },
  {
    id: "2",
    type: "role",
    title: "Staff Design Engineer",
    description: "Shape the future of design systems and component architecture.",
    skills: ["Figma", "React", "CSS"],
    deadline: "Apr 20, 2026",
    company: "Linear",
  },
  {
    id: "3",
    type: "role",
    title: "Platform Engineer",
    description: "Scale infrastructure to millions of deployments per day.",
    skills: ["Go", "Kubernetes", "AWS"],
    deadline: "Apr 18, 2026",
    company: "Railway",
  },
  {
    id: "4",
    type: "hackathon",
    title: "AI Agents Hackathon",
    description: "Build autonomous agents that solve real developer problems. $50k in prizes.",
    skills: ["LLMs", "Python", "APIs"],
    deadline: "May 1, 2026",
  },
  {
    id: "5",
    type: "hackathon",
    title: "Web3 DevTools Sprint",
    description: "Create the next generation of blockchain development tools.",
    skills: ["Solidity", "React", "Ethers.js"],
    deadline: "May 10, 2026",
  },
  {
    id: "6",
    type: "hackathon",
    title: "Real-time Collab Challenge",
    description: "Build multiplayer experiences for developer workflows.",
    skills: ["WebSockets", "CRDT", "React"],
    deadline: "Apr 25, 2026",
  },
  {
    id: "7",
    type: "closed",
    title: "DevRel Engineer",
    description: "Position filled. Thanks for the incredible applications!",
    skills: ["Writing", "Video", "Community"],
    deadline: "Closed",
    company: "Supabase",
  },
  {
    id: "8",
    type: "closed",
    title: "Founding Engineer",
    description: "Founding round complete. Team assembled.",
    skills: ["Full-Stack", "System Design"],
    deadline: "Closed",
    company: "Stealth",
  },
]

function KanbanColumn({
  title,
  opportunities,
  index,
  icon: Icon,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="flex h-full flex-1 min-w-[280px] max-w-[500px] shrink-0 flex-col"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-[#1f1f1f] pb-2">
        <Icon className="h-4 w-4 text-[#666]" />
        <h2 className="text-sm font-medium tracking-tight text-white">{title}</h2>
        <span className="ml-auto bg-[#111] px-2 py-0.5 text-xs text-[#666]">{opportunities.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f transparent' }}>
        <AnimatePresence>
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 + i * 0.08 }}
            >
              <OpportunityCard opportunity={opp} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function PostOpportunityModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-[#1f1f1f] bg-[#0a0a0a] p-6 rounded-none font-sans"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium tracking-tight text-white">Post Opportunity</h2>
              <button onClick={onClose} className="text-[#666] transition-colors hover:text-[#e8ff47] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Senior Frontend Engineer"
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Type</label>
                <select className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none">
                  <option value="role">Open Role</option>
                  <option value="hackathon">Hackathon Team</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the opportunity..."
                  className="w-full resize-none border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., React, TypeScript, Node.js"
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Deadline</label>
                <input
                  type="date"
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none [color-scheme:dark]"
                />
              </div>
              <MagneticButton className="mt-2 w-full justify-center">
                <Zap className="h-4 w-4" />
                Post Opportunity
              </MagneticButton>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Opportunities() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openRoles = opportunities.filter((o) => o.type === "role")
  const hackathons = opportunities.filter((o) => o.type === "hackathon")
  const closed = opportunities.filter((o) => o.type === "closed")

  return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden bg-[#040404] font-sans">
      <NoiseOverlay />

      <motion.div
        animate={{ scale: isModalOpen ? 0.97 : 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-[calc(100vh-64px)] flex-col origin-center relative z-10"
      >
        <main className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden px-6 md:px-8 pt-6">
          <div className="mb-5 shrink-0 flex items-center justify-between">
            <h1 className="text-[28px] font-medium tracking-tight text-white focus:outline-none">Opportunities</h1>
            <div className="md:hidden">
              <MagneticButton onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Post
              </MagneticButton>
            </div>
            <div className="hidden md:block">
              <MagneticButton onClick={() => setIsModalOpen(true)}>
                <Zap className="h-4 w-4" />
                Post Opportunity
              </MagneticButton>
            </div>
          </div>

          <motion.div
            layout
            className="flex flex-1 gap-6 md:gap-8 justify-start lg:justify-center overflow-x-auto overflow-y-hidden pb-4"
            style={{ perspective: "1200px", scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f transparent' }}
          >
            <KanbanColumn title="Open Roles" opportunities={openRoles} index={0} icon={Briefcase} />
            <KanbanColumn title="Hackathon Teams" opportunities={hackathons} index={1} icon={Zap} />
            <KanbanColumn title="Closed" opportunities={closed} index={2} icon={X} />
          </motion.div>
        </main>
      </motion.div>

      <PostOpportunityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
