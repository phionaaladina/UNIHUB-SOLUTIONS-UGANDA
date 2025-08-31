import React from 'react';
import '../styles/CtaContactSection.css'; // Import the CSS file

const CtaContactSection = () => {
  // You might want to add a function for the button click,
  // e.g., to navigate to the contact page
  const handleContactClick = () => {
    // Example: navigate to /contact if you are using React Router
    // history.push('/contact');
    console.log('Contact Us button clicked!');
    // Or simply scroll to the contact form section on the same page
    const contactSection = document.getElementById('contact-form-section'); // Assuming your contact form section has this ID
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Help You — We Are Unihub</h2>
        <p className="cta-description">
          We’re a team of skilled IT professionals dedicated to delivering smart,
          reliable solutions that power businesses and individuals alike. With a
          strong foundation in practical experience and continuous learning, we’re
          here to support your digital needs.
        </p>
        <button className="cta-button" onClick={handleContactClick}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default CtaContactSection;