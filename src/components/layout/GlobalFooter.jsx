import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiDisc } from 'react-icons/fi';

export default function GlobalFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Activity Feed", href: "/feed" },
        { label: "Opportunities", href: "/opportunities" },
        { label: "Teams", href: "/teams" }
      ]
    },
    {
      title: "Account",
      links: [
        { label: "My Profile", href: "/profile" },
        { label: "Notifications", href: "/notifications" },
        { label: "Security & Settings", href: "/settings" },
        { label: "Authentication", href: "/auth" }
      ]
    }
  ];

  return (
    <footer className="bg-[#040404] border-t border-[#1f1f1f] selection:bg-[#e8ff47] selection:text-black mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-12 gap-6">
          
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <Link to="/" className="text-base font-black tracking-tighter text-white hover:text-[#e8ff47] transition-colors">
              [ BS ]
            </Link>
            <p className="text-[11px] text-[#555] leading-relaxed max-w-[200px] font-mono uppercase tracking-tight">
              Protocol: BUILD_TOGETHER // V2.0
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FiGithub, href: "https://github.com/Jaat2727/PENTAGON_SDC_BUILDSPACE_HACKATHON" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="p-1.5 border border-[#1f1f1f] text-[#444] hover:text-[#e8ff47] hover:border-[#e8ff47]/20 transition-all duration-300 rounded-none bg-[#0a0a0a]"
                >
                  <social.icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns 2-4: Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white text-[10px] font-bold tracking-[0.2em] mb-3 uppercase opacity-40">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-xs text-[#555] hover:text-[#e8ff47] transition-colors duration-200 font-mono uppercase tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-[#1f1f1f] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-[#333] font-mono tracking-widest uppercase opacity-40">
            © {currentYear} // REGISTRY_TERMINAL
          </p>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0a0a0a] border border-[#1f1f1f] font-mono opacity-60">
            <div className="w-1 h-1 bg-[#e8ff47] rounded-none animate-pulse" />
            <span className="text-[9px] text-[#444] uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
