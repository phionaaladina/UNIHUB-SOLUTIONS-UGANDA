
// Home.js
import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/Aboutsection';
import ServicesSection from '../components/Servicesection';
import ProductSection from '../components/Productsection';
import CTASection from '../components/CTAsection';

function Home() {
  return (
    <div>

      <Hero />
      <AboutSection />
      <ServicesSection />
      <ProductSection />
      <CTASection />
    </div>
  );
}

export default Home;



