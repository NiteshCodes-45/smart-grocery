import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import "./LandingPage.css";
import company from "../../company.json";

const socialIcons = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
};

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logo} alt={`${company.productName} Logo`} className="footer-logo" />
          <Link to="/">
            <span className="brand">{company.productName}</span>
          </Link>
        </div>

        <div className="footer-links">
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            {company.companyName}
          </a>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/delete-account">Delete Account</Link>
          <a href={company.playStoreUrl} target="_blank" rel="noopener noreferrer">
            Google Play
          </a>
        </div>

        <div className="footer-social">
          <p>Follow us on</p>
          <div className="footer-social-links">
            {company.socialLinks.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${company.productName} on ${social.label}`}
              >
                {socialIcons[social.platform]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-info">
        <p className="footer-copyright">{company.copyright}</p>
        <p className="footer-tagline">
          {company.productName} is a product developed and maintained by {company.companyName}.
        </p>
      </div>
    </footer>
  );
}
