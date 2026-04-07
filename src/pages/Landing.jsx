import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, ArrowRight, GitBranch, Users, Zap, Code2, Trophy, Calendar, X } from "lucide-react"

// Noise overlay component
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
      }}
    />
  )
}

// Magnetic cursor component
function MagneticCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { stiffness: 500, damping: 28 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      if (target.closest("a, button, [data-magnetic]")) {
        setIsHovering(true)
      }
    }

    const handleMouseOut = (e) => {
      const target = e.target
      if (target.closest("a, button, [data-magnetic]")) {
        setIsHovering(false)
      }
    }

    window.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <motion.div
        className="bg-[#e8ff47]"
        animate={{
          width: isHovering ? 40 : 8,
          height: isHovering ? 40 : 8,
          opacity: isHovering ? 0.3 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ borderRadius: "50%" }}
      />
    </motion.div>
  )
}

// Command palette modal
function CommandPalette({ isOpen, onClose }) {
  const commands = [
    { icon: Search, label: "Search projects...", shortcut: "↵" },
    { icon: Users, label: "Find developers", shortcut: "D" },
    { icon: Zap, label: "Browse opportunities", shortcut: "O" },
    { icon: Code2, label: "Create new project", shortcut: "N" },
    { icon: Trophy, label: "View hackathons", shortcut: "H" },
  ]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-[20%] z-[70] w-full max-w-xl -translate-x-1/2"
          >
            <div className="border border-[#e8ff47]/30 bg-[#0a0a0a]/95 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-[#1f1f1f] px-4 py-3">
                <Search className="h-5 w-5 text-[#666]" />
                <input
                  type="text"
                  placeholder="Search BuildSpace..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-[#666] focus:outline-none"
                  autoFocus
                />
                <button onClick={onClose} className="text-[#666] hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-2">
                {commands.map((cmd, i) => (
                  <motion.button
                    key={cmd.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-sm text-[#999] transition-colors hover:bg-[#1f1f1f] hover:text-white"
                  >
                    <cmd.icon className="h-4 w-4" />
                    <span className="flex-1">{cmd.label}</span>
                    <kbd className="bg-[#1f1f1f] px-1.5 py-0.5 font-mono text-xs text-[#666]">{cmd.shortcut}</kbd>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// 3D Terminal component for hero
function Terminal3D({ scrollProgress }) {
  const rotateX = useTransform(scrollProgress, [0, 1], [60, 0])
  const rotateZ = useTransform(scrollProgress, [0, 1], [-45, 0])
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.85])

  const lines = [
    { prefix: "$", text: "buildspace init my-project", color: "text-[#e8ff47]" },
    { prefix: ">", text: "Initializing project...", color: "text-[#666]" },
    { prefix: ">", text: "Found 3 collaborators nearby", color: "text-[#666]" },
    { prefix: "$", text: "buildspace team add @sarah @alex @mike", color: "text-[#e8ff47]" },
    { prefix: ">", text: "Team synced successfully ✓", color: "text-green-500" },
    { prefix: "$", text: "buildspace deploy --prod", color: "text-[#e8ff47]" },
    { prefix: ">", text: "Deploying to buildspace.dev...", color: "text-[#666]" },
    { prefix: ">", text: "Live at buildspace.dev/my-project ✓", color: "text-green-500" },
  ]

  return (
    <div className="perspective-[1000px] hidden md:block">
      <motion.div
        style={{ rotateX, rotateZ, scale }}
        className="w-[500px] border border-[#1f1f1f] bg-[#0a0a0a] p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 bg-[#ff5f57]" />
          <div className="h-3 w-3 bg-[#febc2e]" />
          <div className="h-3 w-3 bg-[#28c840]" />
          <span className="ml-4 font-mono text-xs text-[#666]">terminal</span>
        </div>
        <div className="space-y-2 font-mono text-sm">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="flex gap-2"
            >
              <span className="text-[#666]">{line.prefix}</span>
              <span className={line.color}>{line.text}</span>
            </motion.div>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-[#666]">$</span>
            <span className="h-4 w-2 animate-pulse bg-[#e8ff47]" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Bento box with cursor flashlight effect
function BentoBox({ children, className, index }) {
  const ref = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: index * 0.1,
      }}
      onMouseMove={handleMouseMove}
      className={`group relative min-h-[180px] overflow-visible border border-[#1f1f1f] bg-[#0a0a0a] p-6 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(232, 255, 71, 0.06), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  )
}

// Code diff simulation
function CodeDiff() {
  const lines = [
    { type: "context", text: "  const team = useTeam();" },
    { type: "removed", text: "-  const [members, setMembers] = useState([]);" },
    { type: "added", text: "+  const { members, addMember } = useCollaboration();" },
    { type: "context", text: "" },
    { type: "removed", text: "-  // Manual sync required" },
    { type: "added", text: "+  // Real-time sync enabled" },
    { type: "added", text: "+  useEffect(() => subscribeToChanges(), []);" },
  ]

  return (
    <div className="mt-4 font-mono text-xs">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className={`px-2 py-0.5 ${
            line.type === "added"
              ? "bg-green-500/10 text-green-400"
              : line.type === "removed"
                ? "bg-red-500/10 text-red-400"
                : "text-[#666]"
          }`}
        >
          {line.text || " "}
        </motion.div>
      ))}
    </div>
  )
}

// Radar chart for skills
function SkillRadar() {
  const skills = [
    { name: "React", value: 0.9, angle: 0 },
    { name: "Node", value: 0.7, angle: 60 },
    { name: "Python", value: 0.6, angle: 120 },
    { name: "Design", value: 0.8, angle: 180 },
    { name: "DevOps", value: 0.5, angle: 240 },
    { name: "Mobile", value: 0.7, angle: 300 },
  ]

  const size = 120
  const center = size / 2
  const maxRadius = size / 2 - 20

  const getPoint = (angle, value) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return {
      x: center + Math.cos(rad) * maxRadius * value,
      y: center + Math.sin(rad) * maxRadius * value,
    }
  }

  const points = skills.map((s) => getPoint(s.angle, s.value))
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z"

  return (
    <div className="flex items-center justify-center py-4">
      <svg width={size} height={size}>
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={skills.map((s) => {
              const p = getPoint(s.angle, level)
              return `${p.x},${p.y}`
            }).join(" ")}
            fill="none"
            stroke="#1f1f1f"
            strokeWidth="1"
          />
        ))}
        {skills.map((s) => {
          const p = getPoint(s.angle, 1)
          return <line key={s.name} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#1f1f1f" strokeWidth="1" />
        })}
        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, type: "spring" }}
          points={pathD.replace(/[MLZ]/g, "").trim()}
          fill="rgba(232, 255, 71, 0.2)"
          stroke="#e8ff47"
          strokeWidth="2"
        />
        {skills.map((s) => {
          const p = getPoint(s.angle, 1.25)
          return (
            <text key={s.name} x={p.x} y={p.y} fill="#666" fontSize="8" textAnchor="middle" dominantBaseline="middle">
              {s.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// Scrolling hackathon tags
function HackathonTags() {
  const tags = ["ETHGlobal", "HackMIT", "TreeHacks", "CalHacks", "PennApps", "HackNY", "MHacks", "HackGT"]

  return (
    <div className="relative mt-4 overflow-hidden">
      <motion.div
        animate={{ x: [0, -400] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="flex gap-2"
      >
        {[...tags, ...tags].map((tag, i) => (
          <span key={i} className="shrink-0 border border-[#1f1f1f] bg-[#040404] px-3 py-1 font-mono text-xs text-[#999]">
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// Live feed card
function FeedCard({ item, index, scrollProgress }) {
  const y = useTransform(scrollProgress, [(index * 0.15), (index * 0.15) + 0.2], [0, -300])
  const opacity = useTransform(scrollProgress, [(index * 0.15), (index * 0.15) + 0.15], [1, 0])
  const scale = useTransform(scrollProgress, [(index * 0.15), (index * 0.15) + 0.2], [1, 0.9])

  return (
    <motion.div
      style={{ y, opacity, scale, zIndex: 10 - index }}
      className="absolute left-1/2 w-full max-w-md -translate-x-1/2 border border-[#1f1f1f] bg-[#0a0a0a] p-6"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center bg-[#1f1f1f] font-mono text-sm text-[#e8ff47]">
          {item.avatar}
        </div>
        <div>
          <div className="font-medium text-white">{item.name}</div>
          <div className="text-xs text-[#666]">{item.time}</div>
        </div>
      </div>
      <p className="text-sm text-[#999]">{item.content}</p>
      <div className="mt-4 flex gap-2">
        {item.tags.map((tag) => (
          <span key={tag} className="bg-[#1f1f1f] px-2 py-0.5 text-xs text-[#666]">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const heroRef = useRef(null)
  const feedRef = useRef(null)

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  })

  const { scrollYProgress: feedProgress } = useScroll({
    target: feedRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCmdOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const feedItems = [
    {
      avatar: "SK",
      name: "Sarah Kim",
      time: "2m ago",
      content: "Just shipped our AI-powered code review bot. Looking for frontend devs to help build the dashboard!",
      tags: ["React", "AI", "Open Source"],
    },
    {
      avatar: "AJ",
      name: "Alex Johnson",
      time: "15m ago",
      content: "Our hackathon project won first place! Now turning it into a real startup. DMs open for co-founders.",
      tags: ["Startup", "Web3", "Hiring"],
    },
    {
      avatar: "MP",
      name: "Maya Patel",
      time: "1h ago",
      content: "Released v2.0 of our design system. 50+ components, fully accessible, and open source.",
      tags: ["Design", "Components", "OSS"],
    },
    {
      avatar: "TC",
      name: "Tom Chen",
      time: "3h ago",
      content: "Building a new devtools startup. Looking for passionate engineers who want to shape the future of DX.",
      tags: ["DevTools", "Startup", "Remote"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#040404] text-white font-sans">
      <NoiseOverlay />
      <MagneticCursor />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Hero Section - 200vh scroll-jacked */}
      <section ref={heroRef} className="relative h-[200vh] -mt-16">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-12 px-6 pt-14">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl"
              >
                The platform for developers who{" "}
                <span className="text-[#e8ff47]">build together.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-6 text-lg text-[#999]"
              >
                Connect with ambitious developers. Ship projects faster. Turn ideas into reality with the right team.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-8 flex items-center gap-4"
              >
                <Link
                  to="/auth"
                  className="group flex items-center gap-2 bg-[#e8ff47] px-6 py-3 font-medium text-black transition-all hover:gap-3"
                  data-magnetic
                >
                  Start Building
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/projects"
                  className="border border-[#1f1f1f] px-6 py-3 text-sm text-white transition-colors hover:bg-[#0a0a0a]"
                  data-magnetic
                >
                  View Projects
                </Link>
              </motion.div>
            </div>
            <Terminal3D scrollProgress={heroProgress} />
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="relative mx-auto min-h-screen max-w-6xl overflow-visible px-6 py-32 z-10 bg-[#040404]">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="mb-12 text-center text-4xl font-bold tracking-tight md:text-5xl"
        >
          Everything you need to{" "}
          <span className="text-[#e8ff47]">collaborate</span>
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2"
        >
          <BentoBox className="lg:col-span-2" index={0}>
            <div className="flex items-center gap-2 text-[#e8ff47]">
              <GitBranch className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">Project Collaboration</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Real-time code collaboration</h3>
            <p className="mt-2 text-sm text-[#666]">Work together seamlessly with live cursors, instant sync, and smart conflict resolution.</p>
            <CodeDiff />
          </BentoBox>

          <BentoBox className="lg:row-span-2" index={1}>
            <div className="flex items-center gap-2 text-[#e8ff47]">
              <Users className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">Developer Profiles</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Skill-based matching</h3>
            <p className="mt-2 text-sm text-[#666]">Find collaborators with complementary skills.</p>
            <SkillRadar />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#666]">React</span>
                <span className="text-[#e8ff47]">Expert</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#666]">TypeScript</span>
                <span className="text-[#999]">Advanced</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#666]">Node.js</span>
                <span className="text-[#999]">Advanced</span>
              </div>
            </div>
          </BentoBox>

          <BentoBox index={2}>
            <div className="flex items-center gap-2 text-[#e8ff47]">
              <Calendar className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">Opportunity Board</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">Find your next hackathon</h3>
            <p className="mt-2 text-xs text-[#666]">Browse upcoming events and competitions.</p>
            <HackathonTags />
          </BentoBox>

          <BentoBox index={3}>
            <div className="flex items-center gap-2 text-[#e8ff47]">
              <Zap className="h-5 w-5" />
              <span className="font-mono text-xs uppercase tracking-wider">Quick Stats</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-white">12K+</div>
                <div className="text-xs text-[#666]">Active developers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">3.2K</div>
                <div className="text-xs text-[#666]">Projects shipped</div>
              </div>
            </div>
          </BentoBox>
        </motion.div>
      </section>

      {/* 3D Stacked Live Feed - 300vh */}
      <section ref={feedRef} className="relative h-[300vh] bg-[#040404]">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-4xl font-bold tracking-tight md:text-5xl"
          >
            What's happening
            <span className="ml-2 inline-block h-6 w-0.5 animate-pulse bg-[#e8ff47]" />
          </motion.h2>

          <div className="relative h-64 w-full max-w-md">
            {feedItems.map((item, i) => (
              <FeedCard key={i} item={item} index={i} scrollProgress={feedProgress} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[#1f1f1f] py-32 bg-[#040404]">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Ready to build{" "}
            <span className="text-[#e8ff47]">something great?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-[#999]"
          >
            Join thousands of developers building the future together.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-[#e8ff47] px-8 py-4 text-lg font-medium text-black transition-opacity hover:opacity-90"
              data-magnetic
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
