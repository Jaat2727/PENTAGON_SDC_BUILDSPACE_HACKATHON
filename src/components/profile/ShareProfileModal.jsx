import React, { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import { FiTwitter, FiLinkedin } from "react-icons/fi"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"

const cn = (...classes) => classes.filter(Boolean).join(" ")

export default function ShareProfileModal({ isOpen, onClose, username }) {
  const [copied, setCopied] = useState(false)

  const profileUrl = `${window.location.origin}/u/${username}`
  const hash = `0x${Math.abs(username.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)).toString(16).toUpperCase()}...${username.toUpperCase().slice(-4)}`

  const handleCopy = () => {
    const textToCopy = hash
    console.log("[CLIPBOARD] Attempting to copy HASH:", textToCopy)

    // Modern API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          console.log("[CLIPBOARD] Success via API")
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
        .catch(err => {
          console.warn("[CLIPBOARD] API failed, using fallback:", err)
          fallbackCopy(textToCopy)
        })
    } else {
      console.log("[CLIPBOARD] Navigator API unavailable, using fallback")
      fallbackCopy(textToCopy)
    }
  }

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement("textarea")
      textArea.value = text

      // Ensure the textarea is not visible but can be selected
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      textArea.style.top = "0"
      textArea.style.opacity = "0"

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)

      if (successful) {
        console.log("[CLIPBOARD] Success via Fallback")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        console.error("[CLIPBOARD] Fallback command unsuccessful")
      }
    } catch (err) {
      console.error('[CLIPBOARD] Total failure in fallback:', err)
    }
  }

  const socialLinks = {
    x: `https://twitter.com/intent/tweet?text=Check%20out%20my%20developer%20profile%20on%20BuildSpace&url=${encodeURIComponent(profileUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop - lightened for visibility during debug */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Container - higher z-index and simplified animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#0a0a0a] border border-[#1f1f1f] w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[10001]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white transition-colors p-2"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Share Profile</h2>
          <p className="text-[#555] text-xs font-mono mt-1 uppercase tracking-widest">Registry_ID: {username}</p>
        </div>

        {/* QR Code Section */}
        <div className="relative group mb-8">
          {/* Decorative Corner Borders */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#e8ff47]/40" />
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#e8ff47]/40" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#e8ff47]/40" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#e8ff47]/40" />

          <div className="border border-[#1f1f1f] bg-[#040404] p-10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#e8ff47 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />
            
            {/* Static Reticle Lines */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-[#1f1f1f] -translate-x-1/2" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-[#1f1f1f] -translate-y-1/2" />

            <div className="relative z-0 p-4 bg-white/[0.02] border border-white/5 shadow-2xl">
              {/* Corner Pulsing Status */}
              <div className="absolute -top-1 -left-1 flex items-center gap-1.5 px-2 py-0.5 bg-[#0a0a0a] border border-[#1f1f1f] z-20">
                <div className="w-1 h-1 bg-[#e8ff47] rounded-full animate-pulse" />
                <span className="text-[8px] font-mono text-[#e8ff47] tracking-widest">READY</span>
              </div>

              <QRCodeSVG
                value={profileUrl || window.location.href}
                size={180}
                fgColor="#e8ff47"
                bgColor="transparent"
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="mt-6 flex flex-col items-center gap-1 relative z-10">
              <span className="text-[10px] font-mono text-[#e8ff47] uppercase tracking-[0.3em] font-bold">
                Identity_Archive_Scan
              </span>
              <span className="text-[8px] font-mono text-[#444] uppercase">
                // Protocol: SDC_Buildspace_V2
              </span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="space-y-6">
          <div className="bg-[#040404] border border-[#1f1f1f] p-4 relative overflow-hidden">
            <span className="text-[9px] font-mono text-[#444] uppercase tracking-widest absolute top-2 left-4">
              &gt; Registry_Hash
            </span>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-[#e8ff47] font-mono text-sm tracking-tight truncate">
                {hash}
              </span>
              <button
                onClick={handleCopy}
                className={cn(
                  "p-2 border transition-all duration-300 flex items-center gap-2 font-mono text-[10px] uppercase group cursor-pointer",
                  copied 
                    ? "bg-[#e8ff47] text-black border-[#e8ff47]" 
                    : "bg-white/5 text-[#888] border-[#1f1f1f] hover:border-[#e8ff47]/50 hover:text-white"
                )}
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} className="group-hover:scale-110 transition-transform" />
                    <span>Copy_Hash</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Row */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 border border-[#1f1f1f] bg-[#040404] text-[#888] hover:text-white hover:border-[#333] font-mono text-[10px] uppercase transition-colors"
            >
              <FiTwitter size={16} />
              Share_X
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 border border-[#1f1f1f] bg-[#040404] text-[#888] hover:text-white hover:border-[#333] font-mono text-[10px] uppercase transition-colors"
            >
              <FiLinkedin size={16} />
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
