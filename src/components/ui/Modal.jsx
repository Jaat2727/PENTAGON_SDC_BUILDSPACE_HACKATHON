/*
  Modal.jsx
  ---------
  Generic modal overlay — handles the dark backdrop, centering,
  and escape-key dismissal. Wraps whatever children you pass in.
*/

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  // close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal body */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl animate-fade-up">
        {/* header row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-heading dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-heading dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
