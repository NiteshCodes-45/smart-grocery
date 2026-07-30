import React from "react";
import "./LandingPage.css";
import Header from "./Header";
import Footer from "./Footer";
import company from "../../company.json";

export default function Terms() {
  return (
    <>
      <div style={styles.container}>
        <Header />
        <h1 className="page-title">Terms & Conditions</h1>

        <p>
          By using {company.productName}, you agree to the following terms.
        </p>

        <h3>1. Usage</h3>
        <p>
          This app is intended for personal grocery tracking and planning.
        </p>

        <h3>2. Accuracy</h3>
        <p>
          {company.productName} helps organize grocery lists, prices, categories, and shopping history, but users should review their own entries before making purchase decisions.
        </p>

        <h3>3. Liability</h3>
        <p>
          We are not responsible for any loss or decisions based on app data.
        </p>

        <h3>4. App Availability</h3>
        <p>
          {company.productName} may be updated, modified, or temporarily unavailable during maintenance or technical issues.
        </p>

        <h3>5. Acceptable Usage</h3>
        <p>
          Users agree not to misuse the application, attempt unauthorized access, or interfere with app functionality.
        </p>

        <h3>6. Changes</h3>
        <p>
          We may update these terms at any time.
        </p>

        <h3>7. Limitation of Liability</h3>
        <p>
          {company.productName} is provided as-is without guarantees of uninterrupted availability or error-free operation.
        </p>

        <h3>8. Contact</h3>
        <p>
          Contact: <a href={`mailto:${company.supportEmail}`}>{company.supportEmail}</a>
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
