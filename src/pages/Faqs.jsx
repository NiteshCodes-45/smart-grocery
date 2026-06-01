import React from "react";
import { Link } from 'react-router-dom';
import "./LandingPage.css";
import Footer from "./Footer";

export default function Faqs() {
  const faqs = [
    {
      q: 'How do I add items to my grocery list?',
      a: 'Tap the + button, type an item name, choose a category and quantity, then save. You can also edit items later from the list.'
    },
    {
      q: 'Can I use the app offline?',
      a: 'Yes — Smart Grocery is designed to work offline. Your changes will sync when your device reconnects to the internet.'
    },
    {
      q: 'How is my data protected?',
      a: 'Your data is stored privately and securely. We do not share your personal shopping history with third parties.'
    },
    {
      q: 'How do I delete my account and data?',
      a: 'After logging in to the app, go to Settings and select "Delete Account". You\'ll see a caution message explaining that this action is permanent and cannot be undone. For security, you\'ll be automatically logged out and must log in again to confirm the deletion. This ensures only the account owner can complete the process.'
    },
    {
      q: 'Can I sync across multiple devices?',
      a: 'Yes — sign in with the same account on another device and your lists and history will be available there.'
    },
    {
      q: 'How do recurring items work?',
      a: 'Use the recurring feature to mark items that repeat on a schedule; the app will surface them when it’s time to shop.'
    },
    {
      q: 'Where can I report bugs or request features?',
      a: 'Use the Contact page (linked in the footer) or open an issue on the project repository as described in the README.'
    },
    // {
    //   q: 'Is there a way to export my shopping history?',
    //   a: 'We currently offer an export option in settings to download your purchase history as a CSV file.'
    // },
  ];

  return (
    <div className="landing-container">
      <div className="landing-content">
        <Link to="/" className="brand-link">
            <span className="brand">SMART GROCERY</span>
        </Link>
        <section className="faq-section">
            <h1 className="page-title">Frequently Asked Questions</h1>

            <div className="faq-list">
                {faqs.map((f, i) => (
                <details key={i} className="faq-item" open={i === 0}>
                    <summary className="faq-question">{f.q}</summary>
                    <p className="faq-answer">{f.a}</p>
                </details>
                ))}
            </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
