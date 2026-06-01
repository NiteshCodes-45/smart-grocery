import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";
import Footer from "./Footer";

export default function Terms() {
  return (
    <>
      <div style={styles.container}>
        <Link to="/" className="brand-link">
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
          Smart Grocery aims to provide useful grocery guidance, but we do not guarantee the accuracy of detected items or suggested shopping details.
        </p>

        <h3>3. Scan features</h3>
        <p>
          Optional image or barcode scanning may not always identify every item correctly. Users should verify results before acting on them.
        </p>

        <h3>4. Liability</h3>
        <p>
          We are not responsible for any loss or decisions based on app data.
        </p>

        <h3>5. App Availability</h3>
        <p>
          Smart Grocery may be updated, modified, or temporarily unavailable during maintenance or technical issues.
        </p>

        <h3>6. Acceptable Usage</h3>
        <p>
          Users agree not to misuse the application, attempt unauthorized access, or interfere with app functionality.
        </p>

        <h3>7. Changes</h3>
        <p>
          We may update these terms at any time.
        </p>

        <h3>8. Limitation of Liability</h3>
        <p>
          Smart Grocery is provided as-is without guarantees of uninterrupted availability or error-free operation.
        </p>

        <h3>9. Contact</h3>
        <p>
          Contact: <a href="mailto:contact.smartgrocery@gmail.com">contact.smartgrocery@gmail.com</a>
        </p>
      </div>
      <Footer />
    </>
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