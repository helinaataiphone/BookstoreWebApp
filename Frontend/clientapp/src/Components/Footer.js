import React from "react";
import "./Footer.css"; // CSS for styling the footer

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="social-media-links">
          <a
            href="https://www.instagram.com/stmarybookstore/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <img
              src="./instagramLogo.png"
              alt="Instagram"
              className="footer-icon"
            />
            Follow us on Instagram
          </a>
          <a
            href="https://www.facebook.com/stmarybookstore/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <img src="./facebook.png" alt="Facebook" className="footer-icon" />
            Like us on Facebook
          </a>
        </div>

        {/* Add a decorative divider */}
        <hr className="footer-divider" />

        <div className="contact-info">
          <p>
            <strong>Hours of Operation:</strong> Mon-Sat: 9 AM - 6 PM
          </p>
          <p>
            <strong>Email:</strong> bookstore@stmarycoc.com
          </p>
          <p>
            <strong>Phone:</strong> (123) 456-7890
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
