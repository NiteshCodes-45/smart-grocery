import React from 'react';
import screen1 from "../assets/app-screenshots/smart-grocery-1.jpg";
import screen2 from "../assets/app-screenshots/smart-grocery-2.jpg";
import screen3 from "../assets/app-screenshots/smart-grocery-3.jpg";
//import screen4 from "../assets/app-screenshots/smart-grocery-4.jpg";
import landingBg from "../assets/app-screenshots/landing.png";
import { IoCheckmarkCircleOutline, IoCartOutline, IoTimeOutline, IoAnalyticsOutline } from 'react-icons/io5';
import "./LandingPage.css";
import { Link } from 'react-router-dom';
import Footer from "./Footer";
import { FaGooglePlay, FaApple } from 'react-icons/fa';

export default function LandingPage() {
  
  return (
    <div className="landing-container">
      <div className="landing-content">
        
        {/* ---------------- HERO Section ---------------- */}
        <section className="hero">
          <div className="hero-bg-decoration"></div>

          <div className="hero-grid">
            {/* LEFT CONTENT */}
            <div className="hero-copy">
              <Link to="/" className="brand-link">
                <span className="brand">SMART GROCERY</span>
              </Link>

              <div className="hero-line"></div>

              <h1 className="hero-title">
                Organize.
                <br />
                Track.
                <br />
                Understand.
              </h1>

              <p className="hero-subtitle">
                Practical grocery planning that helps households stay organized,
                track spending patterns, and shop smarter over time.
              </p>

              <div className="hero-cta-row">
                <a href="#download" className="primary-btn-large">
                  Download App
                </a>

                <a href="#features" className="secondary-btn">
                  Explore Features
                </a>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="hero-preview">
              <div className="hero-preview-card">
                <div className="hero-logo-circle">
                  <img
                    src={landingBg}
                    alt="Smart Grocery"
                    className="hero-screenshot"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- VALUE STRIP ---------------- */}
        <section className="value-strip" id="features">
          <ValueItem text="Offline First" />
          <ValueItem text="Private & Secure" />
          <ValueItem text="Built for Real Shopping Habits" />
          <ValueItem text="Clear history" />
          <ValueItem text="Lightweight design" />
        </section>

        {/* ---------------- CORE BENEFITS ---------------- */}
        <section className="section">
          <h2 className="section-title">Why households trust Smart Grocery</h2>

          <div className="benefits-grid">
            <Benefit
              icon={<IoCartOutline />}
              title="Practical grocery lists"
              desc="Create and manage your shopping list with simple categories and quantities."
            />

            <Benefit
              icon={<IoTimeOutline />}
              title="Organized session history"
              desc="Keep track of past shopping trips so you can repeat what works best."
            />

            <Benefit
              icon={<IoAnalyticsOutline />}
              title="Easy spending insights"
              desc="View practical spend summaries and category breakdowns for better planning."
            />
          </div>
        </section>

        {/* ---------------- INTELLIGENCE ---------------- */}
        <section className="intelligence-section">
          <h2 className="section-title">Understand your spending at a glance</h2>

          <div className="intelligence-grid">
            <div className="intelligence-card">
              <span className="intelligence-icon">📊</span>
              <h3 className="intelligence-title">Monthly spend view</h3>
              <p className="intelligence-desc">Compare this month to last month with simple spend summaries.</p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">🛒</span>
              <h3 className="intelligence-title">Frequent buys</h3>
              <p className="intelligence-desc">Spot the items you buy often so you can shop more efficiently.</p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">💰</span>
              <h3 className="intelligence-title">Budget categories</h3>
              <p className="intelligence-desc">See which categories take most of your grocery budget.</p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">✅</span>
              <h3 className="intelligence-title">Better routines</h3>
              <p className="intelligence-desc">Use your grocery history to build a more organized shopping routine.</p>
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

        {/* App Images */}
        <section className="app-images-section">
          <h2 className="section-title">App Preview</h2>
          <div className="app-images-grid">
            <img src={screen1} alt="App Screenshot 1" className="app-screenshot" />
            <img src={screen2} alt="App Screenshot 2" className="app-screenshot" />
            <img src={screen3} alt="App Screenshot 3" className="app-screenshot" />
            {/* <img src={screen4} alt="App Screenshot 4" className="app-screenshot" /> */}
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="final-cta-section" id="download">
          <div className="cta-grid">
            <div className="cta-card">
              <h3 className="cta-title">Start organizing smarter today.</h3>
              <div className="cta-buttons">
                <a
                  href="#"
                  className="cta-store-btn"
                >
                  <icon className="cta-icon"><FaGooglePlay /></icon> Get it on Android
                </a>
                <a
                  href="#"
                  className="cta-store-btn"
                >
                  <icon className="cta-icon"><FaApple /></icon> Coming Soon on iOS
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />

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