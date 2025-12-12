// src/App.jsx
import React from "react";
import Header from "./components/Header";
import GroceryInput from "./components/GroceryInput";
import GroceryList from "./components/GroceryList";
import Help from "./components/Help";
import Footer from "./components/Footer";
import useLocalStorage from "./hooks/useLocalStorage";
import NavBar from "./components/NavBar";

export default function App() {
  const [store, setStore] = useLocalStorage("grocery-app", {
    items: [],
    history: [],
  });

  // predefined categories
  const categories = [
    "General",
    "Dairy",
    "Vegetables",
    "Fruits",
    "Snacks",
    "Beverages",
  ];

  // add item (from GroceryInput)
  const addItem = ({ name, qty = 1, category = "General" }) => {
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const newItem = {
      id: Date.now().toString(),
      name: trimmed,
      qty: Number(qty) || 1,
      category,
      bought: false,
      createdAt: Date.now(),
    };

    setStore((prev) => {
      const items = [newItem, ...prev.items];

      // update history: most-recent-first, no dupes, keep top 50
      const existing = prev.history.filter(
        (h) => h.toLowerCase() !== trimmed.toLowerCase()
      );
      const history = [trimmed, ...existing].slice(0, 50);

      return { ...prev, items, history };
    });
  };

  const toggleBought = (id) => {
    setStore((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id ? { ...it, bought: !it.bought } : it
      ),
    }));
  };

  const removeItem = (id) => {
    setStore((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  const exportData = () => {
    try {
      const blob = new Blob([JSON.stringify(store, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "smart-grocery-backup.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("export error", err);
      alert("Failed to export data.");
    }
  };

  const importData = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        // Basic validation: must be object with items/history arrays
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !Array.isArray(parsed.items) ||
          !Array.isArray(parsed.history)
        ) {
          throw new Error("Invalid backup format");
        }
        setStore(parsed);
        alert("Import successful!");
      } catch (err) {
        console.error("import failed", err);
        alert("Import failed: invalid JSON file.");
      }
    };
    reader.onerror = () => {
      alert("Failed to read file.");
    };
    reader.readAsText(file);
  };

  // Clear All Data function moved to SettingsMenu component
  function clearAllData() {
    if (confirm("Clear all data? This cannot be undone.")) {
      setStore({ items: [], history: [] });
    }
  }

  return (
    <div className="app-root">
      <Header />
      <NavBar onExport={exportData} onImportClick={importData} clearAllData={clearAllData} />
      <main style={{ padding: "1rem 0" }}>
        <GroceryInput
          history={store.history}
          onAdd={addItem}
          categories={categories}
        />
        <hr style={{ margin: "1rem 0" }} />
        <GroceryList
          items={store.items}
          onToggle={toggleBought}
          onRemove={removeItem}
          categories={categories}
        />

        <hr style={{ margin: "1.5rem 0", color: "var(--border)" }} />
        {/* Follow me */}
        <div style={{ textAlign: "center", fontSize: 14, color: "#666" }}>
          Made with ❤️ by{" "}
          <a
            href="https://niteshchaughule.dev/"
            target="_blank"
            rel="noreferrer"
          >
            Chaughule's
          </a>
        </div>
      </main>
      
      {/* <Help /> */}
      
      <Footer />
    </div>
  );
}
