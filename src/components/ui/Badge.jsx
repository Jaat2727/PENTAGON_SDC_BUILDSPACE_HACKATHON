/*
  Badge.jsx
  ---------
  Small coloured pill for showing tech-stack tags, status labels, etc.
  Pass a `color` prop (brand, green, red, yellow, slate) to switch palette.
*/

const colors = {
  brand:  "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
  green:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  red:    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  yellow: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  slate:  "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

export default function Badge({ children, color = "brand", className = "" }) {
  return (
    <span
      className={
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " +
        (colors[color] || colors.brand) +
        " " +
        className
      }
    >
      {children}
    </span>
  );
}
