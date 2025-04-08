import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="last-updated">Last Updated: April 2025</div>

      <div className="privacy-container">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>Your digital privacy is our top priority.</p>
        </header>

        <section className="privacy-section">
          <h2>Introduction</h2>
          <p>
            Welcome to Digital Game Store, your trusted destination for immersive gaming
            experiences. We value your privacy and are committed to protecting your personal data.
            This policy explains how we collect, use, and secure your information.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Information Collection</h2>
          <p>
            When you register, make a purchase, or interact with our services, we collect data such as your name, email,
            payment details, and gameplay preferences. We only use this information to enhance your gaming experience.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Cookies & Tracking</h2>
          <p>
            Our site uses cookies and similar tracking technologies to remember your preferences and deliver a personalized experience.
            By using our site, you consent to our use of these technologies.
          </p>
        </section>

        <section className="privacy-section">
          <h2>How We Use Your Information</h2>
          <p>
            Your data is used for processing orders, sending you updates on the latest games and exclusive offers, 
            and improving our services. All data is processed securely and in accordance with the law.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Third-Party Sharing</h2>
          <p>
            We share your information only with trusted partners for payment processing, analytics, or technical support.
            These partners are bound by strict confidentiality agreements.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Data Security</h2>
          <p>
            We use industry-standard measures, including SSL encryption and secure servers, to ensure that your data
            remains safe and confidential.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Your Rights</h2>
          <p>
            You have the right to access, modify, or delete your personal information at any time. 
            Contact us if you wish to exercise these rights.
          </p>
        </section>

        <section className="privacy-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our Privacy Policy or how we handle your data, please reach out at{' '}
            <a href="mailto:support@digitalgamestore.com">support@digitalgamestore.com</a>.
          </p>
        </section>

        <footer className="privacy-footer">
          <p>&copy; {new Date().getFullYear()} Digital Game Store. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
