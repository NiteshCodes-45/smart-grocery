import React, { useState, useRef, useEffect } from "react";

export default function SettingsMenu({ onImportClick, clearData }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="settings-wrap" ref={ref} style={{ position: "relative" }}>
      <button className="nav-icon" title="Settings" onClick={() => setOpen(v => !v)}>⚙️</button>

      {open && (
        <div className="settings-dropdown" role="menu" aria-label="Settings">
          <button className="settings-item" onClick={() => { alert("Theme toggle (demo)"); }}>Toggle Theme</button>

          <label className="settings-item" style={{ cursor: "pointer" }}>
            <input
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (f && onImportClick) onImportClick(f);
                e.target.value = "";
                setOpen(false);
              }}
            />
            Import JSON
          </label>

          <button className="settings-item" onClick={() => { alert("Open advanced settings (demo)"); }}>Advanced</button>
          <button
            onClick={() => {
                if (clearData) clearData();
                setOpen(false);
            }}
            className="settings-item"
          >
            Clear All Data
          </button>
        </div>
      )}
    </div>
  );
}
