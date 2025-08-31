import React from 'react';
import '../styles/ServiceHero.css';

function ServiceHero() {
  return (
    <div className="services-hero">
      <div className="services-overlay">
        <h2 className="services-title">
          <span className="highlight">Our Services</span>
        </h2>
        <h1 className="services-subtitle">Your All in One IT solutions Partner</h1>
        <p className="services-description">
          At Unihub Solutions, we specialize in providing a comprehensive suite of services
          tailored to meet the IT needs of small and medium-sized businesses.
        </p>
      </div>
    </div>
  );
}

export default ServiceHero;
