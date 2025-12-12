// src/components/GroceryInput.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

export default function GroceryInput({ history = [], onAdd, categories}) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState("General");
  const debouncedName = useDebounce(name, 200);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  // suggestions: if user typed something, filter history; else show recent items
  const suggestions = useMemo(() => {
    const q = debouncedName.trim().toLowerCase();
    if (!q) return history.slice(0, 6);
    return history.filter(h => h.toLowerCase().includes(q)).slice(0, 7);
  }, [debouncedName, history]);

  useEffect(() => {
    // hide suggestion box if no suggestions
    if (!suggestions || suggestions.length === 0) setShowSuggestions(false);
  }, [suggestions]);

  const submit = (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      // focus input if empty
      inputRef.current?.focus();
      return;
    }
    onAdd({ name: name.trim(), qty: Number(qty) || 1, category });
    setName("");
    setQty(1);
    setCategory("General");
    setShowSuggestions(false);
  };

  // keyboard: Enter adds, ArrowDown focuses suggestion list (simple)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit(e);
    } else if (e.key === "ArrowDown") {
      // focus first suggestion button if exists
      const firstBtn = document.querySelector(".suggestions button");
      if (firstBtn) firstBtn.focus();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const pickSuggestion = (s) => {
    setName(s);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <form className="grocery-input" onSubmit={submit} style={{ position: "relative" }} autoComplete="off">
      <div className="input-row inputs">
        <input 
          type="text"
          ref={inputRef}
          className="input-name"
          value={name}
          onChange={(e) => { setName(e.target.value); setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Add item (e.g. Milk)"
          aria-label="Item name"
          style={{ flex: 1, padding: 8 }}
        />
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          aria-label="Quantity"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 8 }}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: "8px 12px" }}>Add</button>
      </div>

      {showSuggestions && suggestions && suggestions.length > 0 && name.length > 0 && (
        <ul className="suggestions" role="listbox" aria-label="Suggestions">
          {suggestions.map((s, i) => (
            <li key={s + i} style={{ marginBottom: 6 }}>
              <button
                type="button"
                onClick={() => pickSuggestion(s)}
                style={{ width: "100%", textAlign: "left", padding: "6px 8px", background: "transparent", border: "none", cursor: "pointer" }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
