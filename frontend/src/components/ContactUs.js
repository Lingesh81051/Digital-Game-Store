import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css'; // Make sure this file is in the same folder or adjust the path accordingly

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  // Destructure form data for convenience
  const { name, email, subject, message } = formData;

  // Update form data on input change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace '/api/contact' with your actual backend endpoint
      const response = await axios.post('/api/contact', formData);
      console.log('Response:', response.data);
      setStatus('Your message has been sent successfully.');
      // Reset form fields after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending contact form data:', error);
      setStatus('There was an error sending your message. Please try again.');
    }
  };

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
      {/* Status Message */}
      {status && <p className="contact-status">{status}</p>}
    </div>
  );
};

export default ContactUs;
