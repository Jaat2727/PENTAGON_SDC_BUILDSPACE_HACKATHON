import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  UserCircle, 
  Palette, 
  Shield, 
  Camera,
  AlertTriangle,
  Trash2,
  X,
  Check,
  Terminal,
  RotateCcw,
  Moon,
  Sun
} from "lucide-react"

// Simple class names utility to replace clsx/tailwind-merge
const cn = (...classes) => classes.filter(Boolean).join(" ");

const initialFormData = {
  email: "developer@buildspace.dev",
  displayName: "Alex Chen",
  bio: "Full-stack developer passionate about building elegant solutions.",
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account")
  const [formData, setFormData] = useState(initialFormData)
  const [savedData, setSavedData] = useState(initialFormData)
  const [hasChanges, setHasChanges] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [theme, setTheme] = useState("dark")
  const [profileImage, setProfileImage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState("idle")
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(savedData)
    setHasChanges(changed)
    setStatus(changed ? "unsaved_changes" : "idle")
  }, [formData, savedData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setStatus("saving...")
    await new Promise(resolve => setTimeout(resolve, 1200))
    setSavedData(formData)
    setIsSaving(false)
    setStatus("saved")
    setTimeout(() => setStatus("idle"), 2000)
  }

  const handleReset = () => {
    setFormData(savedData)
    setProfileImage(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
        setHasChanges(true)
        setStatus("unsaved_changes")
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "profile", label: "Profile", icon: UserCircle },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
  ]

  const canDelete = deleteConfirmText === "DELETE"

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#040404] relative">
      {/* Fixed CSS Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-b border-white/5 bg-[#0A0A0C]/95 backdrop-blur-xl overflow-hidden sticky top-0 z-30"
          >
            <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-[#e8ff47]/10 text-[#e8ff47] border-l-2 border-[#e8ff47]"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-[250px] flex-shrink-0">
            <nav className="sticky top-24">
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
                <p className="text-sm text-slate-500 mt-1 font-mono">{"> "} configure your workspace</p>
              </div>
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative cursor-pointer",
                      activeTab === tab.id
                        ? "bg-[#e8ff47]/10 text-[#e8ff47]"
                        : "text-slate-500 hover:text-white hover:bg-white/[0.03]"
                    )}
                  >
                    {/* Active indicator bar */}
                    <div className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r-full transition-all",
                      activeTab === tab.id ? "bg-[#e8ff47]" : "bg-transparent group-hover:bg-white/20"
                    )} />
                    <tab.icon className={cn(
                      "w-5 h-5 transition-colors",
                      activeTab === tab.id ? "text-[#e8ff47]" : "text-slate-500 group-hover:text-white"
                    )} />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#e8ff47]/10 rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Status indicator */}
              <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500">{"> "} status:</span>
                  <span className={cn(
                    "transition-colors",
                    status === "unsaved_changes" && "text-amber-400",
                    status === "saving..." && "text-[#e8ff47] animate-pulse",
                    status === "saved" && "text-emerald-400",
                    status === "idle" && "text-slate-600"
                  )}>
                    {status}
                  </span>
                </div>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-24 relative z-10 pt-4">
            {/* Mobile Title & Menu Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 border border-[#1f1f1f] rounded-none bg-[#0a0a0a] text-white"
              >
                {tabs.find(t => t.id === activeTab)?.label} menu ▼
              </button>
            </div>

            {/* Mobile Status Bar */}
            <div className="lg:hidden mb-6 flex items-center gap-2 font-mono text-xs p-3 rounded-lg bg-white/[0.02] border border-white/5">
              <span className="text-slate-500">{"> "} status:</span>
              <span className={cn(
                "transition-colors",
                status === "unsaved_changes" && "text-amber-400",
                status === "saving..." && "text-[#e8ff47] animate-pulse",
                status === "saved" && "text-emerald-400",
                status === "idle" && "text-slate-600"
              )}>
                {status}
              </span>
            </div>

            {/* Account Section */}
            <AnimatePresence mode="wait">
              {activeTab === "account" && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard title="Account Information" description="Manage your account credentials and email settings">
                    <div className="space-y-5">
                      <FormField
                        label="EMAIL_ADDRESS"
                        value={formData.email}
                        onChange={(v) => handleInputChange("email", v)}
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                  </GlassCard>

                  <GlassCard title="Account ID" description="Your unique identifier in the BuildSpace system">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <code className="w-full sm:flex-1 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-3 text-sm font-mono text-slate-400">
                        usr_2kL8mN3pQ9rS4tU5vW6xY7zA
                      </code>
                      <button className="px-4 py-3 cursor-pointer bg-[#0a0a0a] hover:bg-[#111] border border-[#1f1f1f] rounded-none text-sm font-mono text-slate-400 hover:text-white transition-all">
                        Copy
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Profile Section */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard title="Avatar" description="Upload a profile picture to personalize your account">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                      {/* Avatar Upload Zone */}
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-none border-2 border-[#1f1f1f] overflow-hidden bg-[#0A0A0C]">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                              <UserCircle className="w-14 h-14 text-slate-700" />
                            </div>
                          )}
                        </div>
                        {/* Hover overlay with frosted glass effect */}
                        <label className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0C]/80 backdrop-blur-sm rounded-none opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200 border-2 border-[#e8ff47]">
                          <Camera className="w-6 h-6 text-[#e8ff47]" />
                          <span className="text-[10px] font-mono text-[#e8ff47] mt-1">Upload New</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            aria-label="Upload profile picture"
                          />
                        </label>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="text-sm font-medium text-white mb-1">Profile Picture</div>
                        <p className="text-xs text-slate-500 font-mono mb-3">
                          {"// "} hover over image to upload
                        </p>
                        <p className="text-xs text-slate-600">
                          Recommended: 256x256px or larger, PNG or JPG
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard title="Profile Details" description="Information displayed on your public profile">
                    <div className="space-y-5">
                      <FormField
                        label="DISPLAY_NAME"
                        value={formData.displayName}
                        onChange={(v) => handleInputChange("displayName", v)}
                        placeholder="Your name"
                      />
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                          BIO
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e8ff47] focus:border-[#e8ff47] transition-all resize-none"
                        />
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Appearance Section */}
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard title="Interface Theme" description="Choose between dark and light mode for the interface">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
                          MODE_SWITCHER
                        </label>
                        <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
                      </div>
                      
                      <div className="pt-4 border-t border-[#1f1f1f]">
                        <p className="text-xs text-slate-500 font-mono">
                          {`// current_theme: "${theme === "dark" ? "buildspace_dark" : "buildspace_light"}"`}
                        </p>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard title="Accent Color" description="Primary color used throughout the interface">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-none bg-[#e8ff47] shadow-[0_0_20px_rgba(232,255,71,0.3)]" />
                      <div>
                        <div className="text-sm font-medium text-white">Lime</div>
                        <code className="text-xs font-mono text-slate-500">#e8ff47</code>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Security Section */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <GlassCard title="Password" description="Update your password to keep your account secure">
                    <div className="space-y-5">
                      <FormField
                        label="CURRENT_PASSWORD"
                        value={formData.currentPassword}
                        onChange={(v) => handleInputChange("currentPassword", v)}
                        type="password"
                        placeholder="Enter current password"
                      />
                      <FormField
                        label="NEW_PASSWORD"
                        value={formData.newPassword}
                        onChange={(v) => handleInputChange("newPassword", v)}
                        type="password"
                        placeholder="Enter new password"
                      />
                      <FormField
                        label="CONFIRM_PASSWORD"
                        value={formData.confirmPassword}
                        onChange={(v) => handleInputChange("confirmPassword", v)}
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </GlassCard>

                  <GlassCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-none bg-emerald-500/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">2FA Status</div>
                          <div className="text-xs text-emerald-400 font-mono">enabled</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-none text-sm text-slate-400 hover:text-white transition-all font-mono">
                        Manage
                      </button>
                    </div>
                  </GlassCard>

                  {/* Danger Zone */}
                  <div className="rounded-none border border-red-500/30 bg-[#0a0a0a] overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-11 h-11 rounded-none bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
                          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                            Permanently delete your account and all associated data. This action is irreversible and cannot be undone.
                          </p>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="mt-5 px-5 py-2.5 cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-none text-sm font-mono transition-all flex items-center gap-2 hover:border-red-500/50 w-full sm:w-auto justify-center"
                            aria-label="Delete account"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Floating Save Bar */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-white/5 p-4 z-50"
          >
            <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm text-slate-400 font-mono">
                  <span className="text-[#e8ff47]">{"> "}</span>
                  unsaved_changes_detected
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 text-sm font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-2 hover:bg-white/[0.03] rounded-none cursor-pointer border border-transparent hover:border-[#1f1f1f]"
                  aria-label="Reset changes"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#e8ff47] text-[#000000] rounded-none text-sm font-mono font-bold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  aria-label="Save changes"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#000000]/30 border-t-[#000000] rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowDeleteModal(false)
              setDeleteConfirmText("")
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#0A0A0C] border border-[#1f1f1f] rounded-none p-6 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmText("")
                }}
                className="absolute top-4 right-4 p-1 text-slate-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-none bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Delete Account</h2>
                  <p className="text-sm text-slate-500 font-mono">{"// "}irreversible action</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                This will permanently delete your account, all your projects, data, and settings. This action cannot be reversed.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                  TYPE &quot;DELETE&quot; TO CONFIRM
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  placeholder="DELETE"
                  className="w-full bg-[#050505] border border-red-500/30 rounded-none px-4 py-3 text-sm text-white placeholder:text-slate-700 font-mono focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                  autoFocus
                />
              </div>
              
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteConfirmText("")
                  }}
                  className="px-5 py-2.5 text-sm font-mono text-slate-400 hover:text-white transition-colors hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={!canDelete}
                  className={cn(
                    "px-5 py-2.5 rounded-none text-sm font-mono font-bold transition-all flex items-center gap-2 cursor-pointer",
                    canDelete
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-red-500/20 text-red-500/50 cursor-not-allowed"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Glass-morphic Section Card Component
function GlassCard({ 
  title, 
  description, 
  children 
}) {
  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#1f1f1f] rounded-none p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      {children}
    </div>
  )
}

// Code Editor Style Form Field
function FormField({ 
  label, 
  value, 
  onChange, 
  type = "text",
  placeholder = ""
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#e8ff47] focus:border-[#e8ff47] transition-all"
      />
    </div>
  )
}

// High-Tech Physical Switch Theme Toggle
function ThemeToggle({ 
  theme, 
  onToggle 
}) {
  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={onToggle}
        className="relative w-28 h-14 bg-[#0A0A0C] border-2 border-white/10 rounded-none p-1.5 transition-all hover:border-[#e8ff47]/30 group focus:outline-none cursor-pointer"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        {/* Track background glow */}
        <div className={cn(
          "absolute inset-1 rounded-none transition-all duration-500",
          isDark 
            ? "bg-gradient-to-r from-[#e8ff47]/10 via-transparent to-transparent" 
            : "bg-gradient-to-l from-amber-500/10 via-transparent to-transparent"
        )} />
        
        {/* Track markers */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none z-10">
          <Moon className={cn(
            "w-3.5 h-3.5 transition-all duration-300",
            isDark ? "text-[#e8ff47] scale-110" : "text-slate-700 scale-100"
          )} />
          <Sun className={cn(
            "w-3.5 h-3.5 transition-all duration-300",
            !isDark ? "text-amber-400 scale-110" : "text-slate-700 scale-100"
          )} />
        </div>

        {/* Switch knob */}
        <motion.div
          animate={{ x: isDark ? 0 : 56 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          className={cn(
            "relative w-11 h-11 rounded-none shadow-lg flex items-center justify-center z-20",
            isDark 
              ? "bg-[#e8ff47]" 
              : "bg-amber-400"
          )}
        >
          {/* LED indicator */}
          <div className={cn(
            "absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-none transition-all",
            isDark 
              ? "bg-white shadow-[0_0_8px_white]" 
              : "bg-white shadow-[0_0_8px_white]"
          )} />
        </motion.div>
      </button>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
        <span className="text-xs text-slate-500 font-mono mt-0.5">
          theme: {isDark ? "dark_terminal" : "light_studio"}
        </span>
      </div>
    </div>
  )
}
