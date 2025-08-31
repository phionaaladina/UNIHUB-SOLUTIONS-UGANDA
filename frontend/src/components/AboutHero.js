// import React from 'react';
// import '../styles/AboutHero.css'; // Link to the CSS file you'll create

// const AboutHero = () => {
//   return (
//     <div className="about-hero">
//       <div className="about-hero-content">
//         <h2>About Us</h2>
//         <h1>
//           We empower businesses, individuals, and <br />
//           organizations with smart, scalable IT solutions.
//         </h1>
//         <p>
//           Unihub Solutions Uganda is a tech-driven company offering innovative,
//           affordable, and future-ready services — from hardware and networking to
//           software development and IT consulting.
//         </p>
//       </div>
//       <div className="about-hero-image"></div>
//     </div>
//   );
// };

// export default AboutHero;
// src/components/AboutHero.js
// src/pages/About.js
import React from 'react';
import '../styles/AboutHero.css'; // Make sure the path matches your project

const About = () => {
  return (
    <div className="about-hero">
      <div className="about-overlay">
        <h1 className="about-title">
          <span className="highlight">About</span> Us
        </h1>
        <p className="about-subtitle">We empower businesses, individuals, and organizations with smart, scalable IT solutions.</p>
        <p className="about-description">
         Unihub Solutions Uganda is a tech-driven company offering innovative, affordable, and future-ready services — from hardware and networking to software development and IT consulting.
        </p>
      </div>
    </div>
  );
};

export default About;
