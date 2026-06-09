import React from "react";
import { Link } from "react-router-dom";
import "./HeroHeader.css";

export default function HeroHeader() {
  return (
    <div className="hero-header">
      <Link to="/" className="brand-link">
        <span className="brand">SMART GROCERY</span>
      </Link>
      <div className="hero-line"></div>
    </div>
  );
}
