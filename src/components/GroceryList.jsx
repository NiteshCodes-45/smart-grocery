// src/components/GroceryList.jsx
import React, { useState, useEffect } from "react";
import GroceryItem from "./GroceryItem";

export default function GroceryList({ items = [], onToggle, onRemove, categories = [] }) {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(items);

  // Keep filteredData in sync whenever items or selectedFilter changes
  useEffect(() => {
    if (selectedFilter === "All") {
        setFilteredData(items);
    } else {
        setFilteredData(items.filter(item => item.category === selectedFilter));
    }
  }, [items, selectedFilter]);

  // Handler for select
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  if (!items || items.length === 0) return <p>No items — add something tasty.</p>;

  return (
    <>
      {/* Category filter */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="category-filter" style={{ marginRight: 8 }}>Filter by category:</label>
        <select id="category-filter" value={selectedFilter} onChange={handleFilterChange} style={{ padding: 8 }}>
          <option value="All">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {!filteredData || filteredData.length === 0 ? (<p>No items in this category.</p>) : null}

      <ul className="grocery-list" style={{ padding: 0, listStyle: "none" }}>
        {filteredData.map(item => (
          <GroceryItem key={item.id} item={item} onToggle={() => onToggle(item.id)} onRemove={() => onRemove(item.id)} />
        ))}
      </ul>
    </>
  );
}
