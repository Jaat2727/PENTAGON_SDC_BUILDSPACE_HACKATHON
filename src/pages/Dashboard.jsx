import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, ChevronDown, X, Compass, Bookmark, User, TrendingUp, Users, ExternalLink, ArrowLeft } from "lucide-react"

// --- Sample Data ---
const sampleProjects = [
  {
    id: "1",
    title: "AI Code Reviewer",
    description: "An intelligent code review assistant that uses GPT-4 to analyze pull requests and provide actionable feedback.",
    techStack: ["Python", "TypeScript", "React", "Docker"],
    status: "open",
    owner_id: "fake_owner",
    repo_url: "https://github.com/example/ai-code-reviewer",
    team: [
      { user_id: "m1", profiles: { display_name: "Alex Chen", username: "alexc", avatar_url: "" }, role: "owner" },
      { user_id: "m2", profiles: { display_name: "Sarah Kim", username: "sarahk", avatar_url: "" }, role: "member" },
      { user_id: "m3", profiles: { display_name: "Mike Ross", username: "miker", avatar_url: "" }, role: "pending" },
    ],
  },
  {
    id: "2",
    title: "DevMetrics Dashboard",
    description: "Real-time developer productivity metrics with beautiful visualizations and team insights.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "GraphQL"],
    status: "open",
    team: [
      { user_id: "m4", profiles: { display_name: "Emma Wilson", username: "emmaw" }, role: "owner" },
      { user_id: "m5", profiles: { display_name: "John Doe", username: "johnd" }, role: "member" },
    ],
  },
  {
    id: "3",
    title: "Rust Game Engine",
    description: "A lightweight, high-performance game engine written in Rust with WebGPU support.",
    techStack: ["Rust", "TypeScript"],
    status: "open",
    team: [
      { user_id: "m6", profiles: { display_name: "David Park" }, role: "owner" },
      { user_id: "m7", profiles: { display_name: "Lisa Wang" }, role: "member" },
      { user_id: "m8", profiles: { display_name: "Tom Harris" }, role: "member" },
    ],
  },
  {
    id: "4",
    title: "ML Pipeline Builder",
    description: "Visual drag-and-drop interface for building and deploying machine learning pipelines.",
    techStack: ["Python", "React", "Docker", "MongoDB"],
    status: "closed",
    team: [
      { user_id: "m9", profiles: { display_name: "James Brown" }, role: "owner" },
    ],
  },
]

const availableTech = ["React", "Next.js", "TypeScript", "Python", "Node.js", "Rust", "Go", "PostgreSQL", "MongoDB", "GraphQL", "TailwindCSS", "Docker"]

const topSkills = [
  { name: "React", count: 124 },
  { name: "TypeScript", count: 98 },
  { name: "Python", count: 86 },
  { name: "Rust", count: 42 },
  { name: "Go", count: 35 },
]

// --- Left Navigation Sidebar ---
function LeftSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'projects', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'profile', label: 'My Projects', icon: <User className="w-4 h-4" /> },
  ]

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="mb-6 px-4">
        <h2 className="text-[#888] font-mono text-xs uppercase tracking-widest">Workspace</h2>
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-none font-mono text-sm transition-all duration-200 cursor-pointer
            ${activeTab === tab.id 
              ? "bg-[#e8ff47]/10 text-[#e8ff47] border-l-2 border-[#e8ff47]" 
              : "text-[#666] hover:text-white hover:bg-white/5 border-l-2 border-transparent"
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
      <div className="mt-auto px-4 py-4">
        <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none">
          <p className="text-xs text-[#666] font-mono">
            // Connected as<br/>
            <span className="text-[#e8ff47]">{"{ currentUser }"}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// --- Right Profile Context Sidebars ---
function FeedRightSidebar() {
  return (
    <div className="p-6">
      <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#e8ff47]" />
        Trending Tech
      </h3>
      <div className="space-y-4">
        {topSkills.map((skill, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-mono text-[#888] group-hover:text-white transition-colors">{skill.name}</span>
            <span className="text-xs font-mono bg-[#111] px-2 py-1 text-[#e8ff47] border border-[#1f1f1f]">
              {skill.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectRightSidebar({ project }) {
  const [isRequesting, setIsRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const isClosed = project?.status === "closed"

  const handleJoinTeam = () => {
    setIsRequesting(true)
    setTimeout(() => {
      setIsRequesting(false)
      setRequested(true)
    }, 1500)
  }

  const members = project?.team || []

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#1f1f1f]">
        <button
          onClick={handleJoinTeam}
          disabled={isClosed || isRequesting || requested}
          className={`
            w-full px-4 py-3 font-mono text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 rounded-none
            ${isClosed 
              ? "bg-[#111] text-[#444] cursor-not-allowed border border-[#1f1f1f]" 
              : requested
                ? "bg-[#e8ff47]/10 text-[#e8ff47] border border-[#e8ff47]/30"
                : "bg-[#e8ff47] text-black hover:shadow-[0_0_20px_rgba(232,255,71,0.3)]"
            }
          `}
        >
          {isRequesting ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
          ) : requested ? (
            "Request Sent ✓"
          ) : isClosed ? (
             "Team Closed"
          ) : (
            "Request to Join"
          )}
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-[#e8ff47]" />
          Team ({members.length})
        </h3>
        
        <div className="space-y-4">
          {members.map((m, i) => (
            <div key={i} className="flex flex-col gap-2 p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none group hover:border-[#e8ff47]/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#111] border border-[#1f1f1f] flex items-center justify-center">
                  <span className="text-[#888] font-mono text-xs uppercase">
                    {(m.profiles?.display_name || "??").substring(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.profiles?.display_name}</p>
                </div>
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                  m.role === "owner" ? "border-[#e8ff47]/50 text-[#e8ff47] bg-[#e8ff47]/5" : "border-[#333] text-[#666]"
                }`}>
                  {m.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Center Active Views ---
function ProjectCard({ project, onClick, index }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(project.id)}
      className={`
        relative group cursor-pointer bg-[#0a0a0a] p-5 border rounded-none transition-all duration-300
        ${isHovered ? "border-[#e8ff47]/50 shadow-[0_0_20px_rgba(232,255,71,0.05)]" : "border-[#1f1f1f]"}
      `}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${project.status === "open" ? "text-[#e8ff47]" : "text-[#555]"}`}>
           {project.status}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-[#e8ff47] transition-colors pr-16">{project.title}</h3>
      <p className="text-sm text-[#777] mb-4 line-clamp-2 h-10">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.techStack.map((tech) => (
          <span key={tech} className="px-2 py-1 bg-[#111] text-[#999] border border-[#1f1f1f] font-mono text-[10px] uppercase">{tech}</span>
        ))}
      </div>
    </motion.div>
  )
}

function FeedCenterView({ projects, searchQuery, setSearchQuery, selectedTech, setSelectedTech, statusFilter, setStatusFilter, onProjectClick, setIsModalOpen }) {
  const [isTechOpen, setIsTechOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) { setSelectedTech(selectedTech.filter((t) => t !== tech)) }
    else { setSelectedTech([...selectedTech, tech]) }
  }

  return (
    <motion.div 
      key="feed"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 overflow-y-auto p-6 lg:p-10 scrollbar-hide"
    >
      <div className="flex items-center justify-between mb-8">
         <h1 className="text-3xl font-bold text-white font-mono tracking-tight">
          Explore <span className="text-[#e8ff47]">Projects</span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#e8ff47] text-black font-bold hover:bg-[#e8ff47]/90 cursor-pointer font-mono text-sm px-4 py-2 rounded-none"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>

      <div className="w-full border border-[#1f1f1f] bg-[#0a0a0a]/50 p-4 mb-8 rounded-none">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e8ff47] font-mono text-sm">{">"}</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="find_project..."
              className="w-full bg-[#040404] border border-[#1f1f1f] pl-8 pr-10 py-2.5 text-sm font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#e8ff47] transition-all rounded-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsTechOpen(!isTechOpen)}
              className="flex items-center cursor-pointer gap-2 bg-[#040404] border border-[#1f1f1f] px-4 py-2.5 text-sm font-mono text-white hover:border-[#e8ff47]/50 min-w-[160px] justify-between rounded-none"
            >
              <span className="text-[#888]">tech:</span>
              <span className="text-[#e8ff47]">{selectedTech.length > 0 ? `[${selectedTech.length}]` : "all"}</span>
              <ChevronDown className={`w-4 h-4 text-[#888] transition-transform ${isTechOpen ? "rotate-180" : ""}`} />
            </button>
            {isTechOpen && (
              <div className="absolute top-full right-0 lg:left-0 mt-2 w-64 bg-[#0a0a0a] border border-[#1f1f1f] shadow-2xl z-50 rounded-none">
                <div className="max-h-64 overflow-y-auto p-2">
                  {availableTech.map((tech) => (
                    <button key={tech} onClick={() => toggleTech(tech)} className={`w-full text-left px-3 py-2 cursor-pointer font-mono text-sm transition-colors rounded-none ${selectedTech.includes(tech) ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "text-[#aaa] hover:bg-[#111]"}`}>
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex bg-[#040404] border border-[#1f1f1f] p-1 rounded-none">
            {["all", "open", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`font-mono text-xs px-4 py-2 cursor-pointer transition-colors rounded-none ${statusFilter === status ? "bg-[#e8ff47] text-black font-bold" : "text-[#888] hover:text-white"}`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        <AnimatePresence>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onClick={onProjectClick} />
          ))}
        </AnimatePresence>
        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center border border-[#1f1f1f] bg-[#0a0a0a] rounded-none">
             <p className="text-[#666] font-mono">No projects found matching criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ProjectDetailCenterView({ project, onBack }) {
  if (!project) return null

  return (
    <motion.div 
      key="detail"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 overflow-y-auto p-6 lg:p-10 scrollbar-hide bg-[#040404]"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#888] hover:text-white font-mono text-sm mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        back_to_feed
      </button>

      <div className="border border-[#1f1f1f] bg-[#0a0a0a] p-8 md:p-12 mb-8 rounded-none relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8ff47]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-mono tracking-tight">{project.title}</h1>
          <span className={`px-3 py-1 text-xs font-mono font-bold uppercase border rounded-none ${project.status === 'open' ? 'border-[#e8ff47]/30 text-[#e8ff47] bg-[#e8ff47]/10' : 'border-[#444] text-[#888] bg-[#111]'}`}>
            {project.status}
          </span>
        </div>

        <p className="text-[#aaa] text-base md:text-lg leading-relaxed mb-8 max-w-3xl relative z-10">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1.5 bg-[#111] text-[#ccc] border border-[#1f1f1f] font-mono text-xs uppercase rounded-none tracking-wider">
              {tech}
            </span>
          ))}
        </div>

        {project.repo_url && (
           <a
             href={project.repo_url}
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-bold text-black bg-[#e8ff47] hover:bg-white transition-colors cursor-pointer rounded-none relative z-10"
           >
             <ExternalLink className="w-4 h-4 text-black" />
             View Repository
           </a>
        )}
      </div>
      
      <div className="border border-[#1f1f1f] bg-[#0a0a0a] rounded-none p-8">
        <h2 className="text-xl font-bold font-mono text-white mb-4 border-b border-[#1f1f1f] pb-4">Project Overview</h2>
        <div className="text-[#888] leading-relaxed space-y-4 text-sm">
          <p>
            This project provides a unique opportunity to collaborate with dedicated developers.
            By joining, you will be expected to contribute to the core features and participate in code reviews.
          </p>
          <p>
            Whether you specialize in frontend UI, backend architecture, or DevOps, there is a place for your expertise. 
            The owner is looking for dynamic individuals ready to push boundaries and build secure, performant software.
          </p>
          <div className="mt-6 p-4 border-l-4 border-[#e8ff47] bg-[#e8ff47]/5">
            <p className="font-mono text-[#e8ff47]">System Note: Full documentation and contributing guidelines are distributed internally to approved members.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CreateProjectModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTech, setSelectedTech] = useState([])
  const [githubUrl, setGithubUrl] = useState("")
  const [currentLine, setCurrentLine] = useState(0)

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech))
    } else {
      setSelectedTech([...selectedTech, tech])
    }
  }

  const handleSubmit = () => {
    if (name && description) {
      onSubmit({ name, description, techStack: selectedTech, githubUrl })
      setName("")
      setDescription("")
      setSelectedTech([])
      setGithubUrl("")
      onClose()
    }
  }

  const lines = [
    { label: "project_name", value: name, active: currentLine === 0 },
    { label: "description", value: description, active: currentLine === 1 },
    { label: "tech_stack", value: `[${selectedTech.join(", ")}]`, active: currentLine === 2 },
    { label: "github_url", value: githubUrl || "optional", active: currentLine === 3 },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[70] px-4">
            <div className="bg-[#040404] border border-[#1f1f1f] rounded-none shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-[#1f1f1f]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-[#666]">buildspace://new_project</span>
                <button onClick={onClose} className="text-[#666] hover:text-white transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#666] mb-2">{">"} project_name <span className="text-red-500">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setCurrentLine(0)} placeholder="Enter project name..." className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm font-mono text-white focus:border-[#e8ff47] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#666] mb-2">{">"} description <span className="text-red-500">*</span></label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} onFocus={() => setCurrentLine(1)} placeholder="Describe..." rows={3} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm font-mono text-white focus:border-[#e8ff47] transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#666] mb-2">{">"} tech_stack</label>
                    <div className="flex flex-wrap gap-2" onFocus={() => setCurrentLine(2)} tabIndex={0}>
                      {availableTech.map((tech) => (
                        <button key={tech} onClick={(e) => { e.preventDefault(); toggleTech(tech) }} className={`px-3 py-1.5 rounded-none text-xs font-mono cursor-pointer ${selectedTech.includes(tech) ? "bg-[#e8ff47] text-black" : "text-[#666] hover:text-white border border-[#1f1f1f]"}`}>{tech}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f1f1f]">
                  <button onClick={onClose} className="font-mono text-sm px-4 py-2 text-[#666] cursor-pointer hover:text-white">cancel</button>
                  <button onClick={handleSubmit} disabled={!name || !description} className="font-mono text-sm px-4 py-2 bg-[#e8ff47] text-black disabled:opacity-50 cursor-pointer rounded-none">{">"} create_project</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// --- MAIN WORKSPACE PAGE ---
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("projects")
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectsDB, setProjectsDB] = useState(sampleProjects) // Replace with Supabase eventually

  // Derive the active project object if any
  const activeProjectPayload = useMemo(() => {
    if (!activeProjectId) return null;
    return projectsDB.find(p => p.id === activeProjectId) || null;
  }, [activeProjectId, projectsDB])

  // Filter projects for feed
  const filteredProjects = useMemo(() => {
    return projectsDB.filter((p) => {
      const matchS = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchT = selectedTech.length === 0 || selectedTech.some((t) => p.techStack.includes(t))
      const matchF = statusFilter === "all" || p.status === statusFilter
      return matchS && matchT && matchF
    })
  }, [projectsDB, searchQuery, selectedTech, statusFilter])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#040404] text-white flex overflow-hidden">
      
      {/* 1. Left Sidebar Navigation */}
      <div className="hidden md:block w-64 shrink-0 border-r border-[#1f1f1f] bg-[#070707] z-20 shadow-xl shadow-black relative">
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 2. Center Dynamic Content Wrapper */}
      <div className="flex-1 relative bg-[#040404] overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeProjectId ? (
            <FeedCenterView 
              key="feed-center"
              projects={filteredProjects}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              selectedTech={selectedTech} setSelectedTech={setSelectedTech}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              onProjectClick={setActiveProjectId}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <ProjectDetailCenterView 
              key="detail-center"
              project={activeProjectPayload}
              onBack={() => setActiveProjectId(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3. Right Contextual Sidebar */}
      <div className="hidden xl:block w-80 shrink-0 border-l border-[#1f1f1f] bg-[#070707] z-20 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeProjectId ? (
            <motion.div
              key="feed-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <FeedRightSidebar />
            </motion.div>
          ) : (
            <motion.div
              key="project-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ProjectRightSidebar project={activeProjectPayload} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(newP) => {
          setProjectsDB([{
              id: Date.now().toString(),
              title: newP.name,
              description: newP.description,
              techStack: newP.techStack,
              status: "open",
              team: [{ user_id: 'me', profiles: { display_name: "You" }, role: "owner" }],
              repo_url: newP.githubUrl
          }, ...projectsDB])
        }}
      />
    </div>
  )
}
