
import React from 'react';
import AboutHero from '../components/AboutHero';
import AboutAbout from '../components/AboutAbout';
import MoreAbout from '../components/MoreAbout';
import WhyChooseUs from '../components/WhyChooseUs';
import AboutCTA from '../components/AboutCTA';

function About() {
  return (
    <div>
    <AboutHero />
    <AboutAbout />
    <MoreAbout />
      <WhyChooseUs />
         <AboutCTA /> 
      {/* <Hero />
    
      <ServicesSection />
      <ProductSection />
      <CTASection /> */}
    </div>
  );
}

export default About;