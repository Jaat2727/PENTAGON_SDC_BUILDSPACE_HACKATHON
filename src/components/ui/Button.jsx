/*
  Button.jsx
  ----------
  Reusable button with a few variants: primary, secondary, ghost, danger.
  Keeps the codebase consistent instead of ad-hoc className strings.
*/

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400 " +
  "focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm",
  secondary:
    "bg-white dark:bg-slate-800 text-heading dark:text-slate-200 border border-border " +
    "dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700",
  ghost:
    "text-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
