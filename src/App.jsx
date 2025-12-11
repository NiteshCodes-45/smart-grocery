// src/App.jsx
import React from "react";
import Header from "./components/Header";
import GroceryInput from "./components/GroceryInput";
import GroceryList from "./components/GroceryList";
import Footer from "./components/Footer";
import useLocalStorage from "./hooks/useLocalStorage";

export default function App() {
  const [store, setStore] = useLocalStorage("grocery-app", {
    items: [],
    history: []
  });

  // predefined categories
  const categories = ["General", "Dairy", "Vegetables", "Fruits", "Snacks", "Beverages"];

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
      createdAt: Date.now()
    };

    setStore((prev) => {
      const items = [newItem, ...prev.items];

      // update history: most-recent-first, no dupes, keep top 50
      const existing = prev.history.filter(h => h.toLowerCase() !== trimmed.toLowerCase());
      const history = [trimmed, ...existing].slice(0, 50);

      return { ...prev, items, history };
    });
  };

  const toggleBought = (id) => {
    setStore(prev => ({
      ...prev,
      items: prev.items.map(it => it.id === id ? { ...it, bought: !it.bought } : it)
    }));
  };

  const removeItem = (id) => {
    setStore(prev => ({ ...prev, items: prev.items.filter(it => it.id !== id) }));
  };

  return (
    <div className="app-root">
      <Header />
      <main style={{ padding: "1rem 0" }}>
        <GroceryInput history={store.history} onAdd={addItem} categories={categories} />
        <hr style={{ margin: "1rem 0" }} />
        <GroceryList items={store.items} onToggle={toggleBought} onRemove={removeItem} categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
