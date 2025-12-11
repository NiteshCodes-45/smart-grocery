# Smart Grocery List

**One-line:** A single-page React app that keeps a grocery list, suggests previously used items (history-based), groups by category, and persists data in localStorage.

## Goal
Build a pragmatic SPA to practice React fundamentals: hooks, component design, localStorage persistence, debounced suggestions, and simple UI polish.

## Tech
- React + Vite
- Plain CSS or Tailwind CSS (choose later)
- localStorage (initially), optional Firebase later
- Optional: Charting library (Recharts/Chart.js)

## Data model (localStorage)
```json
{
  "items": [
    {
      "id": "string",
      "name": "milk",
      "category": "Dairy",
      "qty": 1,
      "bought": false,
      "createdAt": 1690000000000
    }
  ],
  "history": ["milk","eggs","bread"]
}
