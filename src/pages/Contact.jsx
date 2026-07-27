import React from "react";
import "./LandingPage.css";
import Header from "./Header";
import Footer from "./Footer";
import company from "../../company.json";

export default function Contact() {
  return (
    <>
      <div style={styles.container}>
        <div className="landing-content">
          <Header />
          <h1 className="page-title">Contact</h1>

          <p>
            For support, feedback, or account-related requests, reach out to our team.
          </p>

          <p>
            <strong>Email:</strong> <a href={`mailto:${company.supportEmail}`}>{company.supportEmail}</a>
          </p>

          <p>
            {company.productName} is designed to be practical, organized, and easy to use.
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lineHeight: 1.6,
  },
  'info-list': {
    listStyleType: "none",
    paddingLeft: 20,
  },
};
