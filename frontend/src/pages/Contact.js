
import React from "react";
import ContactHero from "../components/ContactHero";
import ContactSection from "../components/ContactSection";
import CtaContactSection from "../components/CtaContactSection";
import "../styles/ContactHero.css";
import "../styles/ContactSection.css";



function Contact() {
  return (
    <div>
      <ContactHero />
      <ContactSection />
      <CtaContactSection />

  
    </div>
  );
}

export default Contact;