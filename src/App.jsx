/*
  App.jsx
  -------
  Root component — sets up React Router with all routes.
  Premium dark cyberpunk container with animated background.
*/

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import GlobalFooter from "./components/layout/GlobalFooter";
import AmbientParticles from "./components/ui/AmbientParticles";

import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import HashProfile from "./pages/HashProfile";
import Opportunities from "./pages/Opportunities";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Teams from "./pages/Teams";

export default function App() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 transition-colors duration-300 relative">
      {/* Ambient floating particles */}
      <AmbientParticles />

      {/* Global background pattern */}
      <div className="fixed inset-0 cyber-grid opacity-[0.02] pointer-events-none" />

      {/* Animated accent glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />


        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="/h/:hash" element={<HashProfile />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>

        <GlobalFooter />
      </div>
    </div>
  );
}
