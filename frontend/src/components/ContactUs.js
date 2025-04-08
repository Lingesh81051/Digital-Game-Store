import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContactUs.css'; // Make sure this file exists and is styled properly

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { name, email, subject, message } = formData;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contact', formData);
      console.log('Response:', response.data);
      setIsSuccess(true);
      setStatusMessage('✅ Message sent! We’ll get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending contact form data:', error);
      setIsSuccess(false);
      setStatusMessage('❌ Failed to send message. Please try again later.');
    }
  };

  // Auto-hide the status message after 5 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1 className="hero-title">Contact Us</h1>
        <p className="hero-subtitle">Have questions or feedback? We're here to help!</p>
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="contact-form">
        <label className="contact-label">Name:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          className="contact-input"
          required
        />

        <label className="contact-label">Email:</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          className="contact-input"
          required
        />

        <label className="contact-label">Subject:</label>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={handleChange}
          className="contact-input"
          required
        />

        <label className="contact-label">Message:</label>
        <textarea
          name="message"
          value={message}
          onChange={handleChange}
          className="contact-textarea"
          required
        ></textarea>

        <button type="submit" className="contact-button">
          Send Message
        </button>
      </form>

      {/* Notification Message */}
      {statusMessage && (
        <div className={`contact-status ${isSuccess ? 'success' : 'error'}`}>
          <span>{statusMessage}</span>
          <button className="close-button" onClick={() => setStatusMessage('')}>
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
