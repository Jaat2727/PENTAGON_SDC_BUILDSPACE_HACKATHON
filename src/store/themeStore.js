/*
  themeStore.js
  -------------
  Manages dark / light mode globally.
  Reads from localStorage on load, toggles the "dark" class
  on <html> so Tailwind's dark: variants kick in.
*/

import { create } from "zustand";

// figure out what theme the user had last time
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("bs-theme");
  if (saved) return saved;

  // respect OS preference if nothing saved
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  toggle: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("bs-theme", next);

      // apply / remove the class on documentElement
      document.documentElement.classList.toggle("dark", next === "dark");
      return { theme: next };
    }),

  // call this once in main.jsx to sync DOM with stored value
  hydrate: () => {
    const theme = getInitialTheme();
    document.documentElement.classList.toggle("dark", theme === "dark");
  },
}));

export default useThemeStore;
