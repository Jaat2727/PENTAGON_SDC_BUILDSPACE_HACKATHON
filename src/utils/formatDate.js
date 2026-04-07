/*
  formatDate.js
  -------------
  Handful of date helpers so we don't scatter Intl calls everywhere.
*/

// "Apr 7, 2026"
export function formatShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

// "2 hours ago", "just now", etc.
export function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (seconds < 60)    return "just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
