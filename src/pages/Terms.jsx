import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";

export default function Terms() {
  return (
    <div style={styles.container}>
      <Link to="/">
        <span className="brand">SMART GROCERY</span>
      </Link>
      <h1 className="page-title">Terms & Conditions</h1>

      <p>
        By using Smart Grocery, you agree to the following terms.
      </p>

      <h3>1. Usage</h3>
      <p>
        This app is intended for personal grocery tracking and planning.
      </p>

      <h3>2. Accuracy</h3>
      <p>
        We do not guarantee accuracy of insights or predictions.
      </p>

      <h3>3. AI Features</h3>
      <p>
        Image recognition may not always be accurate. Users should verify results.
      </p>

      <h3>4. Liability</h3>
      <p>
        We are not responsible for any loss or decisions based on app data.
      </p>

      <h3>5. Changes</h3>
      <p>
        We may update these terms at any time.
      </p>

      <h3>6. Contact</h3>
      <p>
        Contact: <a href="mailto:info@smartgrocery.com">info@smartgrocery.com</a>
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
};