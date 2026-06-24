import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import "./LandingPage.css";

export default function Footer() {
  return (
    <>
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
                <a href="/faqs">FAQs</a>
                <a href="/delete-account">Delete Account</a>
                <a href="/contact">Contact Us</a>
            </div>
            <div className="footer-social">
                <p>Follow us on</p>
                <div className="footer-social-links">
                    <a
                        href="https://www.instagram.com/smartgroceryofficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Follow Smart Grocery on Instagram"
                    >
                        <FaInstagram />
                    </a>
                    <a
                        href="https://www.facebook.com/smartgroceryofficialapp"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Follow Smart Grocery on Facebook"
                    >
                        <FaFacebookF />
                    </a>
                </div>
            </div>
        </div>
        <div className="footer-info">
            <p className="footer-version">Smart Grocery v1.2.0</p>
            <p className="footer-copyright">© 2026 All rights reserved</p>
        </div>
        </footer>
    </>
    );
}
