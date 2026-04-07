/*
  PageWrapper.jsx
  ---------------
  Simple layout wrapper — centers content, adds consistent padding,
  and sets a max-width so pages don't stretch on ultra-wide monitors.
*/

export default function PageWrapper({ children, className = "" }) {
  return (
    <main className={`mx-auto max-w-7xl px-4 sm:px-6 py-8 ${className}`}>
      {children}
    </main>
  );
}
