
import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";

export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      <Link to="/">
        <span className="brand">SMART GROCERY</span>
      </Link>
      <h1 className="page-title">Privacy Policy</h1>

      <p>
        Smart Grocery respects your privacy. This policy explains how we handle your data.
      </p>

      <h3>1. Information We Collect</h3>
      <ul style={styles['info-list']}>
        <li>Grocery items and usage data</li>
        <li>App preferences and settings</li>
        <li>Notification schedules</li>
      </ul>

      <h3>2. How We Use Data</h3>
      <ul style={styles['info-list']}>
        <li>To provide grocery tracking features</li>
        <li>To improve app experience</li>
        <li>To send reminders (notifications)</li>
      </ul>

      <h3>3. Camera & AI (Future Feature)</h3>
      <p>
        If you use image scanning, photos will be processed only to identify grocery items.
        We do not store images permanently.
      </p>

      <h3>4. Data Sharing</h3>
      <p>
        We do not sell or share your personal data with third parties.
      </p>

      <h3>5. Security</h3>
      <p>
        We take reasonable measures to protect your data.
      </p>

      <h3>6. Contact</h3>
      <p>
        For any questions, contact: <a href="mailto:info@smartgrocery.com">info@smartgrocery.com</a>
      </p>

      <p style={{ marginTop: 20, fontSize: 12 }}>
        Last updated: {new Date().getFullYear()}
      </p>
    </div>
  );
}

const styles = {
  container: {
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