// src/components/GroceryList.jsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import GroceryItem from "./GroceryItem";

const PAGE_SIZE = 10; // items to show initially and per "load more"

export default function GroceryList({ items = [], onToggle, onRemove, categories = [] }) {
  const [statusFilter, setStatusFilter] = useState("All"); // All | ToBuy | Bought
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loaderRef = useRef(null);
  const [autoLoad, setAutoLoad] = useState(false); // enable/disable infinite scroll

  // filtering logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (statusFilter === "Bought" && !item.bought) return false;
      if (statusFilter === "ToBuy" && item.bought) return false;
      if (categoryFilter !== "All" && item.category !== categoryFilter) return false;
      return true;
    });
  }, [items, statusFilter, categoryFilter]);

  // reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [statusFilter, categoryFilter, groupByCategory, items.length]);

  // group into { categoryName: [items] }
  const grouped = useMemo(() => {
    return filteredItems.reduce((acc, it) => {
      const k = it.category || "General";
      if (!acc[k]) acc[k] = [];
      acc[k].push(it);
      return acc;
    }, {});
  }, [filteredItems]);

  // items to actually render (paged)
  const pagedItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);

  // For grouped view, compute a grouped-but-paged structure:
  const groupedPaged = useMemo(() => {
    if (!groupByCategory) return null;
    // flatten grouped keys but keep ordering and only include up to visibleCount items total
    const result = {};
    let count = 0;
    const keys = Object.keys(grouped);
    for (const k of keys) {
      const arr = grouped[k];
      const spaceLeft = Math.max(0, visibleCount - count);
      if (spaceLeft <= 0) break;
      result[k] = arr.slice(0, spaceLeft);
      count += result[k].length;
    }
    return result;
  }, [groupByCategory, grouped, visibleCount]);

  const canLoadMore = filteredItems.length > visibleCount;

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(filteredItems.length, prev + PAGE_SIZE));
  }, [filteredItems.length]);

  // IntersectionObserver for auto-loading
  useEffect(() => {
    if (!autoLoad) return;
    const node = loaderRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && canLoadMore) {
          loadMore();
        }
      });
    }, { root: null, rootMargin: "200px", threshold: 0.1 });
    obs.observe(node);
    return () => obs.disconnect();
  }, [autoLoad, loadMore, canLoadMore]);

  if (!items.length) {
    return <p>No items yet — start adding something delicious! 😄</p>;
  }

  return (
    <div className="grocery-list-wrapper" id="list">
      {/* Status filters */}
      <div className="filters">
        <div style={{ display: "flex", gap: 8 }}>
          <button className={statusFilter === "All" ? "active-filter" : ""} onClick={() => setStatusFilter("All")}>All</button>
          <button className={statusFilter === "ToBuy" ? "active-filter" : ""} onClick={() => setStatusFilter("ToBuy")}>To Buy</button>
          <button className={statusFilter === "Bought" ? "active-filter" : ""} onClick={() => setStatusFilter("Bought")}>Bought</button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" checked={groupByCategory} onChange={(e) => setGroupByCategory(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Group by category</span>
          </label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" checked={autoLoad} onChange={(e) => setAutoLoad(e.target.checked)} />
            <span style={{ fontSize: 13 }}>Auto-load on scroll</span>
          </label>
        </div>
      </div>

      {/* Category filter */}
      <div className="group-by-category">
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

      {/* Render grouped or flat */}
      {groupByCategory ? (
        Object.keys(groupedPaged || {}).length === 0 ? (
          <p>No items in selected filters.</p>
        ) : (
          Object.keys(groupedPaged).map(cat => (
            <section key={cat} style={{ marginBottom: 18 }}>
              <h4 style={{ margin: "6px 0" }}>{cat} <small style={{ color: "#666", fontWeight: 400 }}>({grouped[cat].length})</small></h4>
              <ul className="grocery-list">
                {groupedPaged[cat].map(it => (
                  <GroceryItem key={it.id} item={it} onToggle={() => onToggle(it.id)} onRemove={() => onRemove(it.id)} />
                ))}
              </ul>
            </section>
          ))
        )
      ) : (
        <ul className="grocery-list">
          {pagedItems.map(it => (
            <GroceryItem key={it.id} item={it} onToggle={() => onToggle(it.id)} onRemove={() => onRemove(it.id)} />
          ))}
        </ul>
      )}

      {/* Loader / load more area */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        {canLoadMore ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={loadMore} style={{ padding: "8px 12px", borderRadius: 8 }}>Load more</button>
            <div ref={loaderRef} style={{ width: 8, height: 8 }} aria-hidden />
          </div>
        ) : (
          <div style={{ color: "#666" }}>End of list</div>
        )}
      </div>
    </div>
  );
}
