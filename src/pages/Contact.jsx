import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";
import Header from "./Header";
import Footer from "./Footer";

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
            <strong>Email:</strong> <a href="mailto:contact.smartgrocery@gmail.com">contact.smartgrocery@gmail.com</a>
          </p>

          <p>
            Smart Grocery is designed to be practical, organized, and easy to use.
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