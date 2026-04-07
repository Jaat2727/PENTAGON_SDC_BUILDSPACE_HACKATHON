/*
  debounce.js
  -----------
  Classic debounce — delays execution until the caller
  stops firing for `wait` milliseconds. Used mainly in
  the global search bar so we don't hammer Supabase on
  every keystroke.
*/

export function debounce(fn, wait = 350) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
