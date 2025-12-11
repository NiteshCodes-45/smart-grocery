// src/hooks/useDebounce.js
import { useState, useEffect } from "react";

/**
 * useDebounce
 * - Returns a debounced version of any value.
 * - Useful to delay expensive operations (suggestions, API calls).
 *
 * @param value any
 * @param delay number milliseconds (default 300)
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
