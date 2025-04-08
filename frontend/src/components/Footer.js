// Footer.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, path) => {
    e.preventDefault();

    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(path);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/about" onClick={(e) => handleNavClick(e, "/about")}>About Us</a>
          <a href="/contact" onClick={(e) => handleNavClick(e, "/contact")}>Contact</a>
          <a href="/privacy" onClick={(e) => handleNavClick(e, "/privacy")}>Privacy Policy</a>
          <a href="/terms" onClick={(e) => handleNavClick(e, "/terms")}>Terms of Service</a>
        </div>
        <p>&copy; {new Date().getFullYear()} GameHub. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
