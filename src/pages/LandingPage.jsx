import React, { useEffect, useState, useRef } from 'react';
import screen1 from "../assets/app-screenshots/smart-grocery-1.png";
import screen2 from "../assets/app-screenshots/smart-grocery-2.png";
import screen3 from "../assets/app-screenshots/smart-grocery-3.png";
import screen4 from "../assets/app-screenshots/smart-grocery-4.png";
import screen5 from "../assets/app-screenshots/smart-grocery-5.png";
import screen6 from "../assets/app-screenshots/smart-grocery-6.png";
import landingBg from "../assets/app-screenshots/landing.png";
import { IoCheckmarkCircleOutline, IoCartOutline, IoTimeOutline, IoAnalyticsOutline } from 'react-icons/io5';
import "./LandingPage.css";
import Footer from "./Footer";
import HeroHeader from './Header';
import company from "../../company.json";

export default function LandingPage() {
  const carouselImages = [screen1, screen2, screen3, screen4, screen5, screen6];
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
      }
    }

    touchStartX.current = null;
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <aside className="launch-banner" aria-label="Latest release">
          <div className="release-announcement-copy">
            <strong>Smart Grocery v1.1.0 is here 🎉</strong>
            <p>
              Grocery shopping is now more visual and organized with grocery item
              images, expanded categories, festival shopping support, and
              improvements across the app.
            </p>
          </div>
          <a
            href={company.playStoreUrl}
            className="launch-banner-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Update on Google Play
          </a>
        </aside>

        {/* ---------------- HERO Section ---------------- */}
        <section className="hero">
          <div className="hero-bg-decoration"></div>

          <HeroHeader />

          <div className="hero-grid">
            {/* LEFT CONTENT */}
            <div className="hero-copy">
              <a
                href={company.website}
                className="product-badge"
                target="_blank"
                rel="noopener noreferrer"
              >
                A Product by <span>{company.companyName}</span>
              </a>

              <h1 className="hero-title">
                {company.productName}
              </h1>

              <p className="hero-subtitle">
                Practical grocery planning that helps households stay organized,
                track spending patterns, and shop smarter over time.
              </p>

              <div className="hero-cta-row">
                <a
                  href={company.playStoreUrl}
                  className="primary-btn-large"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get it on Google Play
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
                    alt={company.productName}
                    className="hero-screenshot"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- VALUE STRIP ---------------- */}
        <section className="value-strip" id="features">
          <ValueItem text="Grocery List Management" />
          <ValueItem text="Shopping History" />
          <ValueItem text="Category Organization" />
          <ValueItem text="Price Tracking" />
          <ValueItem text="Offline Support" />
        </section>

        {/* ---------------- CORE BENEFITS ---------------- */}
        <section className="section">
          <h2 className="section-title">Why households trust {company.productName}</h2>

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

        <section className="section" aria-labelledby="whats-new-title">
          <h2 className="section-title" id="whats-new-title">
            What's New in Smart Grocery v1.1.0
          </h2>
          <div className="intelligence-grid release-grid">
            {[
              {
                title: "More visual grocery planning",
                description: "Grocery items now include images, making lists easier to scan and manage.",
              },
              {
                title: "More grocery categories",
                description: "Better organization with categories for pulses, grains, spices, cooking essentials, meat & eggs, household products, personal care, puja & festival items, and more.",
              },
              {
                title: "Festival shopping support",
                description: "Plan festival essentials with dedicated suggestions and timely reminders.",
              },
              {
                title: "Improved notifications",
                description: "More reliable shopping, recurring-item and festival reminders.",
              },
              {
                title: "Reliability improvements",
                description: "Notification handling, app stability, environment configuration and crash reporting have been improved.",
              },
            ].map(({ title, description }) => (
              <article className="intelligence-card release-card" key={title}>
                <h3 className="intelligence-title">{title}</h3>
                <p className="benefit-desc">{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------- INTELLIGENCE ---------------- */}
        <section className="intelligence-section">
          <h2 className="section-title">
            Understand your spending at a glance
          </h2>

          <div className="intelligence-grid">
            <div className="intelligence-card">
              <span className="intelligence-icon">📊</span>
              <h3 className="intelligence-title">Monthly spend view</h3>
              <p className="intelligence-desc">
                Compare this month to last month with simple spend summaries.
              </p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">🛒</span>
              <h3 className="intelligence-title">Frequent buys</h3>
              <p className="intelligence-desc">
                Spot the items you buy often so you can shop more efficiently.
              </p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">💰</span>
              <h3 className="intelligence-title">Budget categories</h3>
              <p className="intelligence-desc">
                See which categories take most of your grocery budget.
              </p>
            </div>

            <div className="intelligence-card">
              <span className="intelligence-icon">✅</span>
              <h3 className="intelligence-title">Better routines</h3>
              <p className="intelligence-desc">
                Use your grocery history to build a more organized shopping
                routine.
              </p>
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
              <p className="step-desc">
                Sign in with your account to access your personalized grocery
                dashboard
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-large">2</div>
              <h3 className="step-title">Create your grocery list</h3>
              <p className="step-desc">
                Add items you need with categories and quantities for easy
                shopping
              </p>
            </div>

            <div className="step-card">
              <div className="step-number-large">3</div>
              <h3 className="step-title">Track and analyze purchases</h3>
              <p className="step-desc">
                View spending history and get insights to optimize your budget
              </p>
            </div>
          </div>
        </section>

        {/* App Images */}
        <section className="app-images-section">
          <div className="section-heading-row">
            <div>
              <h2 className="section-title">App Preview</h2>
              <p className="section-subtitle">
                A compact preview of the {company.productName} interface that keeps the full screen visible.
              </p>
            </div>
          </div>

          <div className="app-images-carousel">
            <div className="preview-card">
              <div className="phone-shell">
                <div className="phone-speaker" />
                <div className="carousel-frame" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                  <img
                    src={carouselImages[currentSlide]}
                    alt={`App screenshot ${currentSlide + 1}`}
                    className="app-screenshot"
                  />
                </div>
              </div>
            </div>

            <div className="carousel-controls">
              <button
                className="carousel-nav prev"
                onClick={() =>
                  setCurrentSlide(
                    (prev) =>
                      (prev - 1 + carouselImages.length) % carouselImages.length,
                  )
                }
                aria-label="Previous screenshot"
              >
                ‹
              </button>
              <div className="carousel-dots">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`carousel-dot ${idx === currentSlide ? "active" : ""}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                className="carousel-nav next"
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
                }
                aria-label="Next screenshot"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* ---------------- ABOUT ---------------- */}
        <section className="about-company-section">
          <div className="about-company-content">
            <p className="section-kicker">Built by {company.companyName}</p>
            <h2 className="section-title">Thoughtful tools for everyday routines</h2>
            <p className="about-company-copy">
              {company.productName} is proudly developed by {company.companyName}, a software studio focused on building thoughtful digital products that simplify everyday life.
            </p>
            <a
              href={company.website}
              className="secondary-btn about-company-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {company.companyName}
            </a>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="final-cta-section" id="download">
          <div className="cta-grid">
            <div className="cta-card">
              <h3 className="cta-title">Start organizing smarter today.</h3>
              <div className="cta-buttons">
                <a
                  href={company.playStoreUrl}
                  className="google-play-badge-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get Smart Grocery on Google Play"
                >
                  <img
                    src={company.googlePlayBadgeUrl}
                    alt="Get it on Google Play"
                    className="google-play-badge"
                  />
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
