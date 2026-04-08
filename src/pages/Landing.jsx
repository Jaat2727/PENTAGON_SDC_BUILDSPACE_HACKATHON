import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Search, ArrowRight, GitBranch, Users, Zap, Code2, Trophy, Calendar, X } from "lucide-react"
import TextDecrypt from "../components/ui/TextDecrypt"

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
  // Smoother, more refined scroll-linked animations
  const rotateX = useTransform(scrollProgress, [0, 0.5, 1], [55, 25, 0])
  const rotateZ = useTransform(scrollProgress, [0, 0.5, 1], [-35, -15, 0])
  const rotateY = useTransform(scrollProgress, [0, 0.5, 1], [-10, -5, 0])
  const scale = useTransform(scrollProgress, [0, 0.5, 1], [0.95, 0.9, 0.85])
  const y = useTransform(scrollProgress, [0, 1], [0, 50])
  const opacity = useTransform(scrollProgress, [0, 0.8, 1], [1, 1, 0.6])

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
    <div className="perspective-[1200px] relative hidden md:block">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#e8ff47] opacity-20 blur-[100px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
      <motion.div
        style={{ rotateX, rotateZ, rotateY, scale, y, opacity }}
        className="w-[500px] border border-[#1f1f1f] bg-[#0a0a0a] p-6 shadow-2xl origin-center"
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

// Profile Snippet for Dev Profiles Card
function ProfileSnippet() {
  return (
    <div className="mt-8 flex items-center gap-3 border-t border-[#1f1f1f] pt-4">
      <div className="flex h-10 w-10 items-center justify-center border border-[#1f1f1f] bg-[#040404] font-mono text-sm text-white rounded-none">
        JD
      </div>
      <div>
        <div className="text-sm font-medium text-white font-sans">Jane Doe</div>
        <div className="text-xs text-[#666] font-mono">Full Stack Developer</div>
      </div>
    </div>
  )
}

// Code diff simulation for Card 1
function CodeDiff() {
  const lines = [
    { type: "context", text: "const team = useTeam()" },
    { type: "removed", text: "const status = 'offline'" },
    { type: "added", text: "const status = 'collaborating'" },
    { type: "added", text: "team.sync({ realtime: true })" },
    { type: "added", text: "team.notify('Project updated')" },
  ]

  return (
    <div className="mt-6 border border-[#1f1f1f] bg-[#040404] p-4 text-sm shadow-xl rounded-none font-mono">
      {lines.map((line, i) => {
        let bgColor = "transparent";
        let textColor = "text-[#666]";
        let prefix = "  ";

        if (line.type === "added") {
          bgColor = "bg-[#e8ff47]/10";
          textColor = "text-[#e8ff47]";
          prefix = "+ ";
        } else if (line.type === "removed") {
          bgColor = "bg-[#ff4444]/15";
          textColor = "text-[#ff4444]";
          prefix = "- ";
        }

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`mb-1 px-3 py-1 text-xs md:text-sm ${bgColor} ${textColor} rounded-none`}
          >
            {prefix}{line.text}
          </motion.div>
        );
      })}
    </div>
  )
}

// Radar chart for skills for Card 3
function SkillRadar() {
  const skills = [
    { name: "React", value: 1, angle: 0 },
    { name: "Node", value: 0.8, angle: 60 },
    { name: "Python", value: 0.6, angle: 120 },
    { name: "Design", value: 0.7, angle: 180 },
    { name: "DevOps", value: 0.5, angle: 240 },
    { name: "Mobile", value: 0.9, angle: 300 },
  ]

  const size = 200
  const center = size / 2
  const maxRadius = size / 2 - 30

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
    <div className="flex flex-col flex-1 items-center justify-center py-8">
      <svg width={size} height={size} className="overflow-visible">
        {[0.33, 0.66, 1].map((level) => (
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
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          points={pathD.replace(/[MLZ]/g, "").trim()}
          fill="rgba(232, 255, 71, 0.1)"
          stroke="#e8ff47"
          strokeWidth="2"
        />
        {skills.map((s) => {
          const p = getPoint(s.angle, 1.25)
          return (
            <text key={s.name} x={p.x} y={p.y} fill="#666" fontSize="10" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
              {s.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// Scrolling hackathon tags for Card 2
function HackathonTags() {
  const allTags = ["TreeHacks", "CalHacks", "PennApps", "HackGT", "MHacks", "HackNY", "HackTX", "Bitcamp", "BoilerMake", "HackIllinois", "HackMIT 2026", "LAHacks", "nwHacks", "HackTheNorth", "SB Hacks", "HackDavis"]

  const row1 = [...allTags, ...allTags]

  const offset2 = [...allTags.slice(6), ...allTags.slice(0, 6)]
  const row2 = [...offset2, ...offset2]

  const offset3 = [...allTags.slice(11), ...allTags.slice(0, 11)]
  const row3 = [...offset3, ...offset3]

  return (
    <div className="relative mt-6 overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex flex-col gap-3">
        {/* Row 1: LTR */}
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-3 w-max pr-3"
        >
          {row1.map((tag, i) => (
            <span key={`r1-${i}`} className="shrink-0 border border-[#1f1f1f] bg-transparent text-[#888888] px-3 py-1 text-sm whitespace-nowrap rounded-none hover:border-[#e8ff47] hover:text-white transition-colors duration-200 cursor-pointer">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Row 2: RTL. Start at -50% and go to 0. */}
        <motion.div
          animate={{ x: ["-50%", 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="flex gap-3 w-max pr-3"
        >
          {row2.map((tag, i) => (
            <span key={`r2-${i}`} className="shrink-0 border border-[#1f1f1f] bg-transparent text-[#888888] px-3 py-1 text-sm whitespace-nowrap rounded-none hover:border-[#e8ff47] hover:text-white transition-colors duration-200 cursor-pointer">
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Row 3: LTR */}
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="flex gap-3 w-max pr-3"
        >
          {row3.map((tag, i) => (
            <span key={`r3-${i}`} className="shrink-0 border border-[#1f1f1f] bg-transparent text-[#888888] px-3 py-1 text-sm whitespace-nowrap rounded-none hover:border-[#e8ff47] hover:text-white transition-colors duration-200 cursor-pointer">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Feed card data
const feedCardData = [
  {
    avatar: "LM",
    name: "Lucas Miller",
    time: "Just now",
    content: "Just joined! Setting up a new project template with Supabase and Next.js. Any tips on handling auth state globally?",
    tags: ["Next.js", "Supabase"]
  },
  {
    avatar: "AJ",
    name: "Alex Johnson",
    time: "45m ago",
    content: "Looking for a designer to team up for HackGT. We have a solid backend, just need someone to help with UI/UX.",
    tags: ["Design", "Figma"]
  },
  {
    avatar: "JD",
    name: "Jane Doe",
    time: "2h ago",
    content: "Launched my first project using the new stack! So excited to see what people build.",
    tags: ["React", "Tailwind"]
  },
  {
    avatar: "MK",
    name: "Mike Chen",
    time: "3h ago",
    content: "Found my co-founder through BuildSpace last week. We just closed our first funding round! 🚀",
    tags: ["Startup", "Funding"]
  }
];

// FeedCard component to handle Framer Motion math per index
function ScrollFeedCard({ item, index, scrollProgress, totalCards }) {
  const inputPoints = [];
  const yRange = [];
  const scaleRange = [];
  const opacityRange = [];

  // We want to handle steps:
  // Step 0: Card 0 Front
  // Step 1: Card 0 Deals Away, Card 1 becomes Front
  // Step 2: Card 1 Deals Away, Card 2 becomes Front
  // Step 3: Card 2 Deals Away, Card 3 stays visible (last card)

  const isLastCard = index === totalCards - 1;
  const steps = totalCards - 1; // Stop one step earlier so last card stays

  for (let s = 0; s <= steps; s++) {
    inputPoints.push(s / steps);

    // relative distance between current scroll step and this card's index
    const relativePos = index - s;

    if (relativePos === 0) {
      // Front and center
      yRange.push(0);
      scaleRange.push(1);
      opacityRange.push(1);
    } else if (relativePos < 0) {
      // Dealt away (moved UP) - but keep last card visible
      if (isLastCard) {
        yRange.push(0);
        scaleRange.push(1);
        opacityRange.push(1);
      } else {
        yRange.push(-300);
        scaleRange.push(0.9);
        opacityRange.push(0);
      }
    } else if (relativePos === 1) {
      // One back
      yRange.push(30);
      scaleRange.push(0.94);
      opacityRange.push(0.5);
    } else if (relativePos === 2) {
      // Two back
      yRange.push(60);
      scaleRange.push(0.88);
      opacityRange.push(0.2);
    } else {
      // Deep back
      yRange.push(60 + (relativePos - 2) * 30);
      scaleRange.push(Math.max(0.7, 0.88 - (relativePos - 2) * 0.05));
      opacityRange.push(0);
    }
  }

  const y = useTransform(scrollProgress, inputPoints, yRange);
  const scale = useTransform(scrollProgress, inputPoints, scaleRange);
  const opacity = useTransform(scrollProgress, inputPoints, opacityRange);

  return (
    <motion.div
      style={{ y, scale, opacity, zIndex: totalCards - index }}
      className="absolute top-0 left-0 w-full max-w-md border border-[#1f1f1f] bg-[#0a0a0a] p-6 rounded-none shadow-2xl origin-top z-10"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center border border-[#1f1f1f] bg-[#040404] font-mono text-sm text-[#e8ff47] rounded-none">
          {item.avatar}
        </div>
        <div>
          <div className="font-semibold text-white font-sans">{item.name}</div>
          <div className="text-xs text-[#666] font-mono">{item.time}</div>
        </div>
      </div>
      <p className="text-sm text-[#999] font-sans">{item.content}</p>
      <div className="mt-4 flex gap-2">
        {item.tags.map((tag, i) => (
          <span key={i} className="border border-[#1f1f1f] bg-[#040404] px-2 py-0.5 text-xs text-[#666] font-mono rounded-none">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedFeedColumn() {
  const containerRef = useRef(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 90%"],
    layoutEffect: false
  });

  const scrollYProgress = useSpring(rawProgress, { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full">
      <div className="sticky top-32 flex flex-col items-start justify-start overflow-hidden pt-4 h-[500px]">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <TextDecrypt
              as="h2"
              text="What's happening"
              speed={700}
              className="text-5xl font-bold tracking-tight text-white font-mono"
            />
            <span className="block h-10 w-3 bg-[#e8ff47] animate-cursor-blink rounded-none" />
          </div>
          <p className="mt-4 text-[#888888] font-mono text-sm">Real-time activity from the BuildSpace community.</p>
        </div>
        <div className="relative w-full max-w-md h-[300px]">
          {/* Ambient radial glow - light source beneath cards */}
          <div
            className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 z-0 w-[600px] h-[300px] rounded-full bg-[#e8ff47] opacity-[0.04] blur-[120px] pointer-events-none"
          />
          {feedCardData.map((item, index) => (
            <ScrollFeedCard
              key={index}
              item={item}
              index={index}
              scrollProgress={scrollYProgress}
              totalCards={feedCardData.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const heroRef = useRef(null)
  const feedRef = useRef(null)

  const { scrollYProgress: rawHeroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  })

  const { scrollYProgress: rawFeedProgress } = useScroll({
    target: feedRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  })

  // Smooth out the scroll progress with spring physics
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const heroProgress = useSpring(rawHeroProgress, springConfig)
  const feedProgress = useSpring(rawFeedProgress, springConfig)

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
              <TextDecrypt
                as="h1"
                text="The platform for developers who build together."
                speed={800}
                className="text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl font-mono"
              />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          className="mb-16 text-center"
        >
          <TextDecrypt
            as="h2"
            text="Everything you need to collaborate"
            speed={600}
            className="text-4xl font-bold tracking-tight md:text-5xl text-white font-mono text-center"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { perspective: 1000 },
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          {/* CARD 1 - PROJECT COLLABORATION */}
          <motion.div
            variants={{
              hidden: { opacity: 0, rotateX: 90, scale: 0.95, transformOrigin: 'top' },
              visible: { opacity: 1, rotateX: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="col-span-1 lg:col-span-2 lg:row-span-1 border border-[#1f1f1f] bg-[#0a0a0a] p-8 flex flex-col justify-between overflow-hidden relative rounded-none shadow-2xl"
          >
            <div>
              <div className="text-xs uppercase text-[#888] tracking-widest font-mono mb-2">PROJECT COLLABORATION</div>
              <h3 className="text-3xl font-bold text-white font-sans">Real-time code collaboration</h3>
            </div>
            <CodeDiff />
          </motion.div>

          {/* CARD 3 - DEVELOPER PROFILES (Right Column) */}
          <motion.div
            variants={{
              hidden: { opacity: 0, rotateX: 90, scale: 0.95, transformOrigin: 'top' },
              visible: { opacity: 1, rotateX: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="col-span-1 lg:col-span-1 lg:row-span-2 border border-[#1f1f1f] bg-[#0a0a0a] p-8 flex flex-col overflow-hidden relative rounded-none shadow-2xl"
          >
            <div>
              <div className="text-xs uppercase text-[#888] tracking-widest font-mono mb-2">DEVELOPER PROFILES</div>
              <h3 className="text-3xl font-bold text-white font-sans text-balance">Showcase your skills</h3>
            </div>
            <SkillRadar />
            <ProfileSnippet />
          </motion.div>

          {/* CARD 2 - OPPORTUNITY BOARD */}
          <motion.div
            variants={{
              hidden: { opacity: 0, rotateX: 90, scale: 0.95, transformOrigin: 'top' },
              visible: { opacity: 1, rotateX: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
            }}
            className="col-span-1 lg:col-span-2 lg:row-span-1 border border-[#1f1f1f] bg-[#0a0a0a] p-8 flex flex-col justify-between overflow-hidden relative rounded-none shadow-2xl"
          >
            <div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at bottom right, rgba(232,255,71,0.05) 0%, transparent 60%)' }}
            />
            <div className="relative z-10 flex flex-col">
              <div>
                <div className="text-xs uppercase text-[#888] tracking-widest font-mono mb-2">OPPORTUNITY BOARD</div>
                <h3 className="text-3xl font-bold text-white font-sans">Never miss a hackathon</h3>
              </div>
              <HackathonTags />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Community Stats & Feed Section */}
      <section className="bg-[#040404] text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

            {/* LEFT COLUMN: The Feed */}
            <AnimatedFeedColumn />

            {/* RIGHT COLUMN: Stats & CTA */}
            <div className="sticky top-32 grid grid-cols-2 gap-4 auto-rows-max h-max">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col justify-center border border-[#1f1f1f] bg-[#0a0a0a] p-8 rounded-none">
                <div className="text-4xl font-bold text-[#e8ff47] tracking-tight font-sans">2,400+</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888]">Active developers</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col justify-center border border-[#1f1f1f] bg-[#0a0a0a] p-8 rounded-none">
                <div className="text-4xl font-bold text-white tracking-tight font-sans">180+</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888]">Projects launched</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col justify-center border border-[#1f1f1f] bg-[#0a0a0a] p-8 rounded-none">
                <div className="text-4xl font-bold text-white tracking-tight font-sans">40+</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888]">Universities</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex flex-col justify-center border border-[#1f1f1f] bg-[#0a0a0a] p-8 rounded-none">
                <div className="text-4xl font-bold text-white tracking-tight font-sans">12</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#888]">Hackathon wins</div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="col-span-2 mt-4 flex flex-col justify-center border border-[#e8ff47]/30 bg-[#0a0a0a] p-8 rounded-none">
                <TextDecrypt
                  as="h3"
                  text="Join the community"
                  speed={500}
                  className="text-2xl font-bold text-white tracking-tight font-mono"
                />
                <p className="mb-6 mt-2 text-[#888] font-mono text-sm tracking-tight">Connect with student developers building the future.</p>
                <Link
                  to="/auth"
                  className="inline-block bg-[#e8ff47] border border-[#e8ff47] px-6 py-3 font-bold text-black transition-all hover:brightness-110 rounded-none cursor-pointer w-max"
                >
                  Get Started Free
                </Link>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
