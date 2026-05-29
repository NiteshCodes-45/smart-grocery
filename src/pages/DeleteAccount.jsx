import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";
import Footer from "./Footer";

export default function DeleteAccount() {
  return (
    <>
      <div className="container">
        <div className="landing-content">
          <Link to="/" className="brand-link">
            <span className="brand">SMART GROCERY</span>
          </Link>
          <h1 className="page-title">Delete Account</h1>

          <p>
            Smart Grocery allows users to permanently delete their account and associated data.
          </p>

          <h2>What gets deleted?</h2>
          <ul style={styles['info-list']}>
            <li>Your account information</li>
            <li>Shopping history</li>
            <li>Saved grocery items</li>
            <li>Preferences and settings</li>
          </ul>

          <h2>How to request deletion?</h2>
          <p>
            Send an email to: <strong><a href="mailto:hello@niteshchaughule.dev">hello@niteshchaughule.dev</a></strong>
          </p>

          <p>
            Include your registered email address in the request.
          </p>

          <h2>Deletion timeline</h2>
          <p>
            Account deletion requests are processed within 7 business days.
          </p>

          <p>
            Some temporary backup data may remain for a limited period for security and recovery purposes.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
  
const styles = {
  'container': {
    maxWidth: 800,
    margin: "0 auto",
    padding: 20,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lineHeight: 1.6,
  },
  'info-list': {
    listStyleType: "none",
    paddingLeft: 20,
  },
};
            