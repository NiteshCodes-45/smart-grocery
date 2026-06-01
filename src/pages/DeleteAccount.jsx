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
            Smart Grocery allows users to permanently delete their account and associated data directly from the app Settings.
          </p>

          <h2>What gets deleted?</h2>
          <ul style={styles['info-list']}>
            <li>Your account information</li>
            <li>Shopping history</li>
            <li>Saved grocery items</li>
            <li>Preferences and settings</li>
          </ul>

          <h2>How to delete your account?</h2>
          <ol style={styles['info-list']}>
            <li><strong>Log in</strong> to the Smart Grocery app with your credentials</li>
            <li>Go to <strong>Settings</strong> and select <strong>"Delete Account"</strong></li>
            <li>Read the caution message warning that deletion is <strong>permanent and cannot be undone</strong></li>
            <li>For security, you will be <strong>automatically logged out</strong></li>
            <li><strong>Log in again</strong> with the same credentials to confirm the deletion</li>
            <li>Your account and all associated data will be immediately deleted</li>
          </ol>

          <h2>Why re-login for confirmation?</h2>
          <p>
            The logout and re-login step is a security measure to ensure that only the actual account owner can permanently delete the account. This prevents accidental or unauthorized deletion.
          </p>

          <p style={styles['caution']}>
            ⚠️ <strong>Important:</strong> Account deletion is irreversible. Please be certain before proceeding.
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
  'caution': {
    backgroundColor: 'rgba(255, 183, 77, 0.1)',
    border: '1px solid rgba(255, 183, 77, 0.3)',
    borderRadius: '8px',
    padding: '14px 16px',
    marginTop: '20px',
    color: '#c9720d',
  }
};
            