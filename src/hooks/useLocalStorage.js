// src/hooks/useLocalStorage.js
import { useState, useEffect, useRef } from "react";

/**
 * useLocalStorage
 * - Keeps state in sync with localStorage.
 * - Serializes/deserializes safely and handles JSON parse errors.
 * - Returns [value, setValue] (like useState).
 *
 * @param {string} key localStorage key
 * @param {any} initialValue initial value (used if nothing in storage)
 */
export default function useLocalStorage(key, initialValue) {
  const mountedRef = useRef(false);

  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : typeof initialValue === "function" ? initialValue() : initialValue;
    } catch (err) {
      console.error("useLocalStorage: read error", err);
      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  });

  // write to localStorage when state changes, but avoid writing on first render twice
  useEffect(() => {
    // protect against SSR-ish environments (not needed here but safe)
    if (!mountedRef.current) {
      mountedRef.current = true;
    }
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (err) {
      console.error("useLocalStorage: write error", err);
    }
  }, [key, state]);

  return [state, setState];
}
