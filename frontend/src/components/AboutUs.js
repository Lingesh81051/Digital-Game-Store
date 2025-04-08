// frontend/src/components/AboutUs.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";

// Sample team members data
const teamMembers = [
  { name: "Anonymous 1", role: "Founder & CEO", image: "/images/footer/avatar1.jpg" },
  { name: "Anonymous 2", role: "Lead Developer", image: "/images/footer/avatar2.jpg" },
  { name: "Anonymous 3", role: "Creative Director", image: "/images/footer/avatar3.jpg" },
];

const AboutUs = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/categories", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="about-us-page">
      {/* Story Section */}
      <section className="story-section" id="our-story">
        <div className="container">
          <h2>Our Story</h2>
          <p>
            Founded by passionate gamers, our digital game store began as a small
            community project. Over the years, we have evolved into a trusted
            platform, dedicated to delivering the best gaming experiences with an
            extensive library, lightning fast downloads, and secure payment
            solutions.
          </p>
          <p>
            Our mission is to create a vibrant hub where gamers of all levels can
            find inspiration, connect with like-minded players, and discover new
            adventures every day.
          </p>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="offer-section" id="what-we-offer">
        <div className="container">
          <h2>What We Offer</h2>
          <div className="offer-items">
            <div className="offer-item">
              <i className="fas fa-gamepad"></i>
              <h3>Huge Game Library</h3>
              <p>A diverse collection of games spanning all genres.</p>
            </div>
            <div className="offer-item">
              <i className="fas fa-download"></i>
              <h3>Instant Downloads</h3>
              <p>Get your games instantly, anytime, anywhere.</p>
            </div>
            <div className="offer-item">
              <i className="fas fa-lock"></i>
              <h3>Secure Payments</h3>
              <p>Safe and secure transactions with trusted payment partners.</p>
            </div>
            <div className="offer-item">
              <i className="fas fa-headset"></i>
              <h3>24/7 Support</h3>
              <p>We’re here for you around the clock.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="team-section" id="meet-the-team">
        <div className="container">
          <h2>Meet the Team</h2>
          <div className="team-members">
            {teamMembers.map((member, index) => (
              <div className="team-member" key={index}>
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <button className="cta-button" onClick={handleExploreClick}>
            Explore Our Games
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
