import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AboutCTA.css'; // for background and custom styles

const AboutCTA = () => {
  return (
    <section className="about-cta d-flex align-items-center">
      <div className="container text-start text-dark py-5">
        <p className="text-warning fw-semibold">In need of us?</p>
        <h2 className="fw-bold text-primary mb-3">
          Ready to Support Your Digital Journey
        </h2>
        <p className="mb-4">
          We are your trusted partner in innovation and IT transformation.
          <br />
          Over 70% of our team holds degrees and certifications in tech, ensuring expert service at every step.
        </p>
        <a href="#contact" className="btn btn-primary px-4">
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default AboutCTA;
