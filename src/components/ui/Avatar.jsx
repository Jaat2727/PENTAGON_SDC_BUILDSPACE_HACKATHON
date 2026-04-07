/*
  Avatar.jsx
  ----------
  Circular user avatar. Falls back to initials when there's no image URL.
  Sizes: sm (32px), md (40px), lg (64px), xl (96px).
*/

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name, size = "md", className = "" }) {
  const sizeClass = sizeMap[size] || sizeMap.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white dark:ring-slate-700 ${className}`}
      />
    );
  }

  // fallback — coloured circle with initials
  return (
    <div
      className={
        `${sizeClass} rounded-full flex items-center justify-center ` +
        "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 " +
        "font-semibold select-none " +
        className
      }
    >
      {getInitials(name)}
    </div>
  );
}
