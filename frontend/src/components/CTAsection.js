import React from 'react';
import '../styles/CTAsection.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const CTASection = () => {
    return (
        <section className="cta-section py-5">
            <div className="container text-center">
                <h4 className="cta-subtitle">In need of us?</h4>
                <h2 className="cta-title mb-4">Get In Touch Today!</h2>
                <div className="mb-4">
                    <button className="btn btn-contact-us">Contact Us</button>
                </div>
                <p className="cta-tagline">
                    We take pride in delivering professional results, every time. We'd love to hear from you!
                </p>
            </div>
        </section>
    );
};

export default CTASection;