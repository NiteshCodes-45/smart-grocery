import React from "react";
import { Link } from "react-router-dom";
import "./HeroHeader.css";
import company from "../../company.json";

export default function HeroHeader() {
  return (
    <div className="hero-header">
      <Link to="/" className="brand-link">
        <span className="brand">{company.productName}</span>
      </Link>
      <div className="hero-line"></div>
    </div>
  );
}
