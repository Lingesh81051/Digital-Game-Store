// frontend/src/components/TermsOfService.js
import React from "react";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-page">
      {/* Sticky Last Updated Banner */}
      <div className="last-updated">
        Last Updated: April 8, 2025
      </div>

      {/* Main Content */}
      <div className="terms-container">
        <header className="terms-header">
          <h1>Terms of Service</h1>
          <p>
            Welcome to GameSapien, your premier digital game store. This Terms of Service
            agreement governs your use of our site and services. Please review these
            terms carefully.
          </p>
        </header>

        <section className="terms-section">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing our website and using our services, you agree to be bound by these 
            terms and any modifications made by GameSapien. Your use of our services 
            constitutes your acceptance of these terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>User Accounts</h2>
          <p>
            Users must register for an account to access certain features of our site.
            You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section className="terms-section">
          <h2>Purchase & Refund Policy</h2>
          <p>
            All purchases are subject to our refund policy. Please ensure that all details 
            are correct at checkout, as all sales are final once confirmed.
          </p>
        </section>

        <section className="terms-section">
          <h2>Licensing & Game Usage</h2>
          <p>
            When purchasing a game, you are granted a non-transferable license to use the software 
            in accordance with our guidelines. Unauthorized copying or distribution is strictly forbidden.
          </p>
        </section>

        <section className="terms-section">
          <h2>Prohibited Activities</h2>
          <p>
            You agree not to engage in any fraudulent, abusive, or illegal activities while using our 
            site or services. This includes, but is not limited to, unauthorized access, scams, or other disruptive actions.
          </p>
        </section>

        <section className="terms-section">
          <h2>Intellectual Property</h2>
          <p>
            All content, games, software, and related materials are the intellectual property 
            of GameSapien or our licensors, and are protected by applicable laws. No materials may 
            be reproduced without express permission.
          </p>
        </section>

        <section className="terms-section">
          <h2>Account Termination</h2>
          <p>
            We reserve the right to terminate your account if you violate these terms or engage 
            in conduct harmful to our community or services.
          </p>
        </section>

        <section className="terms-section">
          <h2>Liability Limitations</h2>
          <p>
            GameSapien is not liable for any direct, indirect, incidental, or consequential damages 
            resulting from your use of our services.
          </p>
        </section>

        <section className="terms-section">
          <h2>Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of our services 
            after changes are made constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>Contact Information</h2>
          <p>
            If you have any questions or concerns about these Terms, please contact us at 
            support@gamesapien.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
