// src/components/GroceryList.jsx
import React, { useState, useMemo } from "react";
import GroceryItem from "./GroceryItem";

export default function GroceryList({ items = [], onToggle, onRemove, categories = [] }) {
  const [statusFilter, setStatusFilter] = useState("All"); // All | ToBuy | Bought
  const [categoryFilter, setCategoryFilter] = useState("All");

  // filtering logic using useMemo (industry pattern)
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // status filtering
      if (statusFilter === "Bought" && !item.bought) return false;
      if (statusFilter === "ToBuy" && item.bought) return false;

      // category filtering
      if (categoryFilter !== "All" && item.category !== categoryFilter) return false;

      return true;
    });
  }, [items, statusFilter, categoryFilter]);

  if (!items.length) {
    return <p>No items yet — start adding something delicious! 😄</p>;
  }

  return (
    <div className="grocery-list-wrapper">
      {/* Status filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18, justifyContent: "center" }}>
        <button
          className={statusFilter === "All" ? "active-filter" : ""}
          onClick={() => setStatusFilter("All")}
        >
          All
        </button>
        <button
          className={statusFilter === "ToBuy" ? "active-filter" : ""}
          onClick={() => setStatusFilter("ToBuy")}
        >
          To Buy
        </button>
        <button
          className={statusFilter === "Bought" ? "active-filter" : ""}
          onClick={() => setStatusFilter("Bought")}
        >
          Bought
        </button>
      </div>

      {/* Category filter */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
        <div>
            <label style={{ marginRight: 8 }}>Category:</label>
            <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: 8 }}
            >
            <option value="All">All</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>
                {cat}
                </option>
            ))}
            </select>
        </div>
        {/* Info line */}
        <p style={{ color: "#666", margin: "6px 0 12px" }}>
          Showing <strong>{filteredItems.length}</strong> of {items.length}{" "}
          items
        </p>
      </div>

      {/* List */}
      <ul className="grocery-list">
        {filteredItems.map((item) => (
          <GroceryItem
            key={item.id}
            item={item}
            onToggle={() => onToggle(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </ul>
    </div>
  );
}
