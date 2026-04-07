import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiBell, FiSettings, FiUser } from "react-icons/fi";

const NAV_LINKS = [
  { id: "home", label: "Home", path: "/" },
  { id: "dashboard", label: "Dashboard", path: "/dashboard" },
  { id: "opportunities", label: "Opportunities", path: "/opportunities" },
  { id: "teams", label: "Your Teams", path: "/teams" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full h-16 flex justify-between items-center px-4 md:px-8 transition-colors duration-300 tracking-tight font-sans ${
        scrolled ? "bg-[#040404]/80 backdrop-blur-md" : "bg-[#040404]"
      } border-b border-[#1f1f1f]`}
    >
      {/* 1. LEFT SECTION - Logo */}
      <div className="flex items-center min-w-[150px]">
        <Link to="/" className="text-white font-mono font-bold text-xl tracking-tighter">
          [ BS ]
        </Link>
      </div>

      {/* 2. CENTER SECTION - Links */}
      <div className="hidden md:flex h-full relative items-center gap-8">
        {NAV_LINKS.map((link) => {
          // Active state logic
          const isActive = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);
          
          return (
            <Link
              key={link.id}
              to={link.path}
              className={`relative h-full flex items-center text-sm font-medium transition-colors ${
                isActive ? "text-white" : "text-[#888888] hover:text-white"
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="activeNavUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e8ff47]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. RIGHT SECTION - Actions */}
      <div className="flex items-center gap-3 min-w-[150px] justify-end">
        {/* Search Bar */}
        <div className="relative hidden lg:flex items-center group">
          <FiSearch className="absolute left-3 text-[#888888] w-4 h-4 group-focus-within:text-[#e8ff47] transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 bg-[#0a0a0a] border border-[#1f1f1f] text-white text-sm h-9 pl-9 pr-10 focus:outline-none focus:border-[#e8ff47] transition-colors rounded-none placeholder:text-[#555555]"
          />
          <div className="absolute right-2 flex items-center justify-center border border-[#1f1f1f] bg-[#040404] px-1.5 h-5 text-[10px] text-[#888888] rounded-none font-mono">
            ⌘K
          </div>
        </div>

        {/* Notification */}
        <Link 
          to="/notifications"
          className="relative text-[#888888] hover:text-white transition-colors p-1.5 flex items-center justify-center rounded-none cursor-pointer"
          title="Notifications"
        >
          <FiBell className="w-5 h-5" />
          {/* Square Indicator */}
          <div className="absolute top-1 right-1.5 w-2 h-2 bg-[#e8ff47] border-2 border-[#040404] rounded-none"></div>
        </Link>

        {/* Settings */}
        <Link 
          to="/settings"
          className="text-[#888888] hover:text-white transition-colors p-1.5 flex items-center justify-center rounded-none"
          title="Settings"
        >
          <FiSettings className="w-5 h-5" />
        </Link>

        {/* Profile */}
        <Link 
          to="/profile"
          className="text-[#888888] hover:text-white transition-colors p-1.5 flex items-center justify-center rounded-none"
          title="Profile"
        >
          <FiUser className="w-5 h-5" />
        </Link>

        {/* Login Button */}
        <Link 
          to="/auth"
          className="px-4 h-9 flex items-center justify-center text-sm font-medium text-white hover:text-[#e8ff47] transition-colors rounded-none border border-[#1f1f1f] hover:border-[#e8ff47]"
        >
          Login
        </Link>

        {/* Signup Button */}
        <Link 
          to="/auth?mode=signup"
          className="px-4 h-9 flex items-center justify-center text-sm font-bold text-black bg-[#e8ff47] hover:bg-[#e8ff47]/90 transition-colors rounded-none"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
