import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiBell, FiSettings, FiUser } from "react-icons/fi";
import useAuthStore from "../../store/authStore";

const NAV_LINKS = [
  { id: "home", label: "Home", path: "/" },
  { id: "dashboard", label: "Dashboard", path: "/dashboard" },
  { id: "opportunities", label: "Opportunities", path: "/opportunities" },
  { id: "teams", label: "Your Teams", path: "/teams" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Handle search submission (Enter key)
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      const value = searchValue.trim();

      // Check if it looks like an identity hash (starts with 0x)
      if (value.startsWith('0x')) {
        // Navigate to hash-based profile route
        navigate(`/h/${encodeURIComponent(value)}`);
      } else {
        // Treat as regular search or username
        navigate(`/search?q=${encodeURIComponent(value)}`);
      }

      // Clear and blur the input
      setSearchValue('');
      searchRef.current?.blur();
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-8 transition-colors duration-300 tracking-tight font-sans ${scrolled ? "bg-[#040404]/80 backdrop-blur-md" : "bg-[#040404]"
        } border-b border-[#1f1f1f]`}
    >
      {/* 1. LEFT SECTION - Logo */}
      <div className="flex items-center shrink-0">
        <Link to="/" className="text-white font-mono font-bold text-xl tracking-tighter">
          [ BS ]
        </Link>
      </div>

      {/* 2. CENTER SECTION - Links */}
      <div className="flex items-center gap-6 md:gap-8">
        {NAV_LINKS
          .filter(link => !(isLoggedIn && link.id === 'home'))
          .map((link) => {
            const isActive = link.path === '/' ? location.pathname === '/' : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.id}
                to={link.path}
                className={`relative h-full flex items-center text-sm font-medium transition-colors whitespace-nowrap ${isActive ? "text-white" : "text-[#888888] hover:text-white"
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
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden xl:flex items-center group">
          <FiSearch className={`absolute left-3 w-4 h-4 transition-colors ${isFocused ? 'text-[#e8ff47]' : 'text-[#888888]'}`} />
          <input
            ref={searchRef}
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearchSubmit}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search or paste IDENTITY_HASH..."
            className={`w-48 lg:w-56 bg-[#0a0a0a] border transition-all duration-300 text-sm h-9 pl-9 pr-10 focus:outline-none rounded-none placeholder:text-[#555555] ${isFocused
                ? 'border-[#e8ff47] text-[#e8ff47] font-mono'
                : 'border-[#1f1f1f] text-white'
              }`}
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

        {/* Profile - Show only when logged in */}
        {isLoggedIn && (
          <Link
            to="/profile"
            className="text-[#888888] hover:text-white transition-colors p-1.5 flex items-center justify-center rounded-none"
            title="Profile"
          >
            <FiUser className="w-5 h-5" />
          </Link>
        )}

        {/* Authentication Section */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-3 md:px-4 h-9 flex items-center justify-center text-sm font-medium text-white hover:text-[#e8ff47] transition-colors rounded-none border border-[#1f1f1f] hover:border-[#e8ff47] whitespace-nowrap"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/auth"
              className="px-3 md:px-4 h-9 flex items-center justify-center text-sm font-medium text-white hover:text-[#e8ff47] transition-colors rounded-none border border-[#1f1f1f] hover:border-[#e8ff47] whitespace-nowrap"
            >
              Login
            </Link>

            <Link
              to="/auth?mode=signup"
              className="px-3 md:px-4 h-9 flex items-center justify-center text-sm font-bold text-black bg-[#e8ff47] hover:bg-[#e8ff47]/90 transition-colors rounded-none whitespace-nowrap"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
