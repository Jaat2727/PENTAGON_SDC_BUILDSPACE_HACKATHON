import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Mail, Lock, User, ArrowRight } from "lucide-react"
import { FiGithub } from "react-icons/fi"
import { useSearchParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import useAuthStore from "../store/authStore"

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(232, 255, 71, 0.03) 0%, transparent 50%)' }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: 'linear-gradient(to top, #040404, transparent)' }}
      />
    </div>
  )
}

function FloatingCodeSnippet() {
  return (
    <motion.div
      className="absolute top-12 right-8 pointer-events-none"
      initial={{ opacity: 0, y: 20, rotate: 3 }}
      animate={{ opacity: 1, y: [0, -8, 0], rotate: 3 }}
      transition={{
        opacity: { duration: 0.5, delay: 0.5 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <div className="relative">
        <div className="absolute -inset-2 bg-[#e8ff47]/10 rounded-none blur-xl" />
        <div className="relative bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-none p-4 shadow-2xl">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
          </div>
          <pre className="font-mono text-sm leading-relaxed">
            <code>
              <span className="text-[#666]">{"// Let's ship together"}</span>
              {"\n"}
              <span className="text-[#e8ff47]/80">await</span>
              {" "}
              <span className="text-white">buildTogether</span>
              <span className="text-[#e8ff47]">()</span>
              <motion.span
                className="text-[#e8ff47]"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              >
                ;
              </motion.span>
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  )
}

function AnimatedInput({ icon: Icon, label, type, value, onChange, placeholder }) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-medium text-white flex items-center gap-2 font-mono">
        <Icon className="w-4 h-4 text-[#888]" />
        <span>{label}</span>
        {isFocused && (
          <motion.span
            className="text-[#e8ff47]"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          >
            _
          </motion.span>
        )}
      </label>
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 0 20px rgba(232, 255, 71, 0.3), inset 0 0 0 1px #e8ff47'
            : '0 0 0 rgba(232, 255, 71, 0), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
        transition={{ duration: 0.2 }}
        className="rounded-none bg-[#111111]"
      >
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
          className="w-full h-11 bg-transparent px-3 text-white placeholder:text-[#555] focus:outline-none font-mono"
        />
      </motion.div>
    </motion.div>
  )
}

function SlidingTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: "login", label: "login()" },
    { id: "signup", label: "signUp()" },
  ]

  return (
    <div className="relative flex bg-[#111111] border border-white/5 p-1 rounded-none">
      <motion.div
        className="absolute top-1 bottom-1 bg-[#e8ff47] rounded-none"
        initial={false}
        animate={{
          left: activeTab === "login" ? "4px" : "50%",
          width: "calc(50% - 4px)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={`relative z-10 flex-1 py-2 px-4 text-sm font-mono cursor-pointer transition-colors duration-200 ${activeTab === tab.id ? "text-black" : "text-[#888] hover:text-white"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function GlitchButton({ onClick }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence>
        {isHovering && (
          <motion.div className="absolute inset-0 z-10 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute left-0 right-0 h-[2px] bg-black/30" initial={{ top: "-2px" }} animate={{ top: "100%" }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onClick}
        type="button"
        className="relative flex items-center justify-center w-full h-14 bg-[#e8ff47] text-black hover:bg-[#e8ff47] font-bold text-base transition-all duration-200 rounded-none cursor-pointer"
        style={{
          boxShadow: isHovering
            ? '0 0 40px rgba(232, 255, 71, 0.5), 0 0 80px rgba(232, 255, 71, 0.3)'
            : '0 0 20px rgba(232, 255, 71, 0.2)'
        }}
      >
        <motion.div
          className="flex items-center justify-center gap-2"
          animate={isHovering ? { x: [0, -2, 2, -1, 1, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <FiGithub className="w-5 h-5" />
          <span>Continue with GitHub</span>
        </motion.div>
      </button>
    </motion.div>
  )
}

// Subcomponent: LoginForm
function LoginForm({ onSubmit, loading }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(email, password) }}>
      <AnimatedInput icon={Mail} label="email" type="email" placeholder="developer@buildspace.so" value={email} onChange={(e) => setEmail(e.target.value)} />
      <AnimatedInput icon={Lock} label="password" type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex items-center justify-between text-sm pt-2">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative w-4 h-4 rounded-none border border-white/20 bg-[#111111] flex items-center justify-center group-hover:border-[#e8ff47]/50 transition-colors">
            <input type="checkbox" className="sr-only peer" />
            <motion.div className="w-2 h-2 bg-[#e8ff47] rounded-none opacity-0 peer-checked:opacity-100" layout />
          </div>
          <span className="text-[#888] font-mono text-xs">rememberMe</span>
        </label>
        <button type="button" className="text-[#e8ff47] hover:underline cursor-pointer text-xs font-mono">
          forgotPassword()
        </button>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-4 flex items-center justify-center h-11 border border-white/10 bg-[#111111] hover:bg-[#1a1a1a] hover:border-[#e8ff47]/30 text-white cursor-pointer font-mono group transition-all duration-200 rounded-none disabled:opacity-50"
      >
        <span className="text-[#888]">{"await "}</span>
        <span className="text-white ml-1">signIn</span>
        <span className="text-[#e8ff47]">()</span>
        {loading ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="ml-2 inline-block">⟳</motion.span> : <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 text-[#e8ff47]" />}
      </button>
    </form>
  )
}

// Subcomponent: SignupForm
function SignupForm({ onSubmit, loading }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(username, email, password) }}>
      <AnimatedInput icon={User} label="username" type="text" placeholder="coolDeveloper" value={username} onChange={(e) => setUsername(e.target.value)} />
      <AnimatedInput icon={Mail} label="email" type="email" placeholder="developer@buildspace.so" value={email} onChange={(e) => setEmail(e.target.value)} />
      <AnimatedInput icon={Lock} label="password" type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 flex items-center justify-center h-11 border border-white/10 bg-[#111111] hover:bg-[#1a1a1a] hover:border-[#e8ff47]/30 text-white font-mono group transition-all cursor-pointer duration-200 rounded-none disabled:opacity-50"
      >
        <span className="text-[#888]">{"await "}</span>
        <span className="text-white ml-1">createAccount</span>
        <span className="text-[#e8ff47]">()</span>
        {loading ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="ml-2 inline-block">⟳</motion.span> : <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 text-[#e8ff47]" />}
      </button>
    </form>
  )
}

function AuthCard() {
  const [searchParams] = useSearchParams()
  const modeParam = searchParams.get("mode")
  const [activeTab, setActiveTab] = useState(modeParam === "signup" ? "signup" : "login")

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (modeParam === "signup" || modeParam === "login") {
      setActiveTab(modeParam)
    }
  }, [modeParam])

  async function handleLogin(email, password) {
    if (!email || !password) return
    setLoading(true)
    setErrorMsg(null)
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMsg(error.message)
    } else if (user) {
      navigate("/dashboard")
    }
    setLoading(false)
  }

  async function handleSignup(username, email, password) {
    if (!username || !email || !password) return
    setLoading(true)
    setErrorMsg(null)
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: username } }
    })
    if (error) {
      setErrorMsg(error.message)
    } else if (user) {
      handleLogin(email, password)
    }
    setLoading(false)
  }

  async function handleGithubSignIn() {
    await supabase.auth.signInWithOAuth({ provider: 'github' })
  }

  return (
    <div className="relative">
      <div
        className="absolute -inset-4 rounded-none blur-2xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(232, 255, 71, 0.15) 0%, transparent 70%)' }}
      />
      <div className="relative bg-[#0a0a0a]/90 backdrop-blur-md border border-[#1f1f1f] rounded-none overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111111] border-b border-[#1f1f1f]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-[#666] font-mono tracking-wider">buildspace_auth.ts</span>
          </div>
          <div className="w-[52px]" />
        </div>
        <div className="p-6 space-y-6">
          <div className="font-mono text-sm">
            <span className="text-[#666]">{"// "}</span>
            <span className="text-[#e8ff47]">BuildSpace</span>
            <span className="text-[#666]">{" - Developer Portal"}</span>
          </div>
          <SlidingTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-none text-red-500 text-xs font-mono">
              {"// Error: "}
              {errorMsg}
            </div>
          )}

          <div className="min-h-[290px] relative">
            <AnimatePresence mode="wait">
              {activeTab === "login" && (
                <motion.div key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                  <LoginForm onSubmit={handleLogin} loading={loading} />
                </motion.div>
              )}
              {activeTab === "signup" && (
                <motion.div key="signup" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  <SignupForm onSubmit={handleSignup} loading={loading} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1f1f1f]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0a0a0a] px-4 text-[#555] font-mono">{"/* or */"}</span>
            </div>
          </div>
          <GlitchButton onClick={handleGithubSignIn} />
          <p className="text-center text-xs text-[#555] font-mono">
            <span className="text-[#555]">{"// "}</span>
            By continuing, you agree to our{' '}
            <button className="text-[#e8ff47] hover:underline cursor-pointer">Terms</button>
            {' && '}
            <button className="text-[#e8ff47] hover:underline cursor-pointer">Privacy</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  })

  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0])
  const rotateY = useTransform(scrollYProgress, [0, 1], [-15, 0])
  const y3d = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity3d = useTransform(scrollYProgress, [0.5, 1], [1, 0])

  const staggerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  }

  return (
    <div ref={heroRef} className="min-h-[calc(100vh-64px)] bg-[#040404] relative overflow-hidden flex font-sans">
      <GridBackground />
      <div className="relative z-10 w-full flex">

        {/* Left Side - Terminal Auth Card with stagger reveal */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md space-y-4"
          >
            <motion.div variants={childVariants}>
              <AuthCard />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - 3D Scroll-Linked Interactive Placeholder */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative flex-col">
          <motion.div
            style={{
              rotateX,
              rotateY,
              y: y3d,
              opacity: opacity3d,
              transformStyle: "preserve-3d",
              willChange: "transform, opacity",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full max-h-[700px] border border-[#1f1f1f] bg-[#0a0a0a]/50 backdrop-blur-sm flex items-center justify-center relative overflow-hidden rounded-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `linear-gradient(rgba(232, 255, 71, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 255, 71, 0.5) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            {/* Center Orb */}
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-32 h-32 rounded-full border border-[#e8ff47]/20 flex items-center justify-center relative bg-gradient-to-br from-[#e8ff47]/5 to-transparent shadow-[0_0_50px_rgba(232,255,71,0.1)]">
                <div className="absolute inset-0 rounded-full bg-[#e8ff47]/10 blur-xl" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <svg className="w-12 h-12 text-[#e8ff47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-[#666] font-mono text-xs">
                {"// Replace this orb with Spline 3D Scene in production"}
              </p>
            </div>

            <FloatingCodeSnippet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
