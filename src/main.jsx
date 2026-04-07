/*
  main.jsx
  --------
  Entry point — mounts the React app, initializes the auth
  store, and hydrates the theme so the page loads in the
  right mode immediately.
*/

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import useAuthStore from "./store/authStore";
import useThemeStore from "./store/themeStore";
import "./index.css";

// kick off auth session restore (runs before first render)
useAuthStore.getState().initialize();

// apply saved theme class to <html> right away
useThemeStore.getState().hydrate();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
