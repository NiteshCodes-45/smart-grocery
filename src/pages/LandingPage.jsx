import React from 'react';
import logo from "../assets/logo.png";
import { IoCheckmarkCircleOutline, IoCartOutline, IoTimeOutline, IoAnalyticsOutline } from 'react-icons/io5';
import "./LandingPage.css";
import { Link } from 'react-router-dom';

export default function LandingPage() {
  
  return (
    <div className="landing-container">
      <div className="landing-content">
        {/* ---------------- HERO ---------------- */}
        <section className="hero">
          <Link to="/">
            <span className="brand">SMART GROCERY</span>
          </Link>

          <h1 className="hero-title">
            Organize. Track. Understand.
          </h1>

          <p className="hero-subtitle">
            Smarter grocery planning with intelligent history tracking
            and spending insights.
          </p>

          {/* 🔥 INSTALL BUTTONS */}
          <div className="install-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=your.app.id"
              className="install-icon-btn"
              title="Download for Android"
            >
              📱
            </a>

            <a
              href="https://apps.apple.com/app/idXXXXXXXX"
              className="install-icon-btn"
              title="Download for iOS"
            >
              🍎
            </a>
          </div>
        </section>

        {/* ---------------- VALUE STRIP ---------------- */}
        <section className="value-strip">
          <ValueItem text="Offline Ready" />
          <ValueItem text="Smart Insights" />
          <ValueItem text="History Tracking" />
          <ValueItem text="Seasonal Suggestions" />
        </section>

        {/* ---------------- CORE BENEFITS ---------------- */}
        <section className="section">
          <h2 className="section-title">Built for Smarter Households</h2>
          <div className="section-subBenefit">  
            <Benefit
              icon={<IoCartOutline />}
              title="Smart Lists"
              desc="Create and manage grocery lists in seconds."
            />

            <Benefit
              icon={<IoTimeOutline />}
              title="Automatic History"
              desc="Track sessions and spending automatically."
            />

            <Benefit
              icon={<IoAnalyticsOutline />}
              title="Intelligent Insights"
              desc="Understand trends and optimize your shopping."
            />
          </div>
        </section>

        {/* ---------------- INTELLIGENCE ---------------- */}
        <section className="intelligence-section">
          <h2 className="section-title">
            Understand Your Spending
          </h2>

          <div className="intelligence-grid">
            <div className="intelligence-card">
              <span className="intelligence-icon">📊</span>
              <h3 className="intelligence-title">Monthly spending comparisons</h3>
              <p className="intelligence-desc">Track how your spending changes month over month</p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">🏆</span>
              <h3 className="intelligence-title">Most consistent purchases</h3>
              <p className="intelligence-desc">Identify items you buy regularly</p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">📈</span>
              <h3 className="intelligence-title">Category dominance insights</h3>
              <p className="intelligence-desc">See which categories take most of your budget</p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">🔄</span>
              <h3 className="intelligence-title">Shopping pattern detection</h3>
              <p className="intelligence-desc">Discover your shopping habits and routines</p>
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-large">1</div>
              <h3 className="step-title">Login securely</h3>
              <p className="step-desc">Sign in with your account to access your personalized grocery dashboard</p>
            </div>

            <div className="step-card">
              <div className="step-number-large">2</div>
              <h3 className="step-title">Create your grocery list</h3>
              <p className="step-desc">Add items you need with categories and quantities for easy shopping</p>
            </div>

            <div className="step-card">
              <div className="step-number-large">3</div>
              <h3 className="step-title">Track and analyze purchases</h3>
              <p className="step-desc">View spending history and get insights to optimize your budget</p>
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="final-cta-section">
          <div className="cta-grid">
            <div className="cta-card">
              <h3 className="cta-title">Start organizing smarter today.</h3>
              <div className="cta-buttons">
                <a
                  href="https://play.google.com/store/apps/details?id=your.app.id"
                  className="cta-store-btn"
                >
                  📱 Get it on Android
                </a>
                <a
                  href="https://apps.apple.com/app/idXXXXXXXX"
                  className="cta-store-btn"
                  style={{ backgroundColor: "#000" }}
                >
                  🍎 Get it on iOS
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="footer-section">
          <div className="footer-grid">
            <div className="footer-brand">
              <img src={logo} alt="Smart Grocery Logo" className="footer-logo" />
              <Link to="/">
                <span className="brand">SMART GROCERY</span>
              </Link>
              <p className="footer-tagline">Organized households. Smarter decisions.</p>
            </div>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms</a>
            </div>
            <div className="footer-info">
              <p className="footer-version">Smart Grocery v1.2.0</p>
              <p className="footer-copyright">© 2026 All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function ValueItem({ text }) {
  return (
    <div className="value-item">
      <IoCheckmarkCircleOutline className="value-icon" />
      <span className="value-text">{text}</span>
    </div>
  );
}

function Benefit({ icon, title, desc }) {
  return (
    <div className="benefit-row">
      <div className="benefit-content">
        <div className="benefit-icon">{icon}</div>
        <h3 className="benefit-title">{title}</h3>
        <p className="benefit-desc">{desc}</p>
      </div>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="step-row">
      <div className="step-circle">
        <span className="step-number">{number}</span>
      </div>
      <span className="step-text">{text}</span>
    </div>
  );
}