/*
  Input.jsx
  ---------
  Standard text input that matches the project's visual style.
  Handles labels, placeholders, and error states in one place.
*/

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-heading dark:text-slate-200"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={
          "w-full rounded-lg border bg-white dark:bg-slate-800 px-4 py-2.5 text-sm " +
          "text-heading dark:text-slate-200 placeholder:text-muted " +
          "border-border dark:border-slate-600 " +
          "focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent " +
          "transition-colors duration-200 " +
          (error ? "border-red-500 ring-1 ring-red-500 " : "") +
          className
        }
        {...props}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
