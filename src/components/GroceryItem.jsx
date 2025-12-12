// src/components/GroceryItem.jsx
import React from "react";

export default function GroceryItem({ item, onToggle, onRemove }) {
  return (
    <li className={`grocery-item ${item.bought ? "completed" : ""}`}>
      <div className="left">
        <input type="checkbox" checked={!!item.bought} onChange={onToggle} />
        <div>
          <div className="item-name">{item.name}</div>
          <div className="item-meta">
            {item.qty} • {item.category}
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="remove" onClick={onRemove} aria-label={`Remove ${item.name}`}>Remove</button>
      </div>
    </li>
  );
}
