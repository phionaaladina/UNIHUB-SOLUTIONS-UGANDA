import React from 'react';
import '../styles/ContactHero.css';

function ContactHero() {
  return (
    <div className="contact-hero">
      <div className="contact-overlay">
        <h2 className="contact-title">
          <span className="highlight">Contact Us</span>
        </h2>
        <h1 className="services-subtitle">Have questions or need assistance?</h1>
        <p className="services-description">
          Reach out to out friendly team/</p>
      </div>
    </div>
  );
}

export default ContactHero;
