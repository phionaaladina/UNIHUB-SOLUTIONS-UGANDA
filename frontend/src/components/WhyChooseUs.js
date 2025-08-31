// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/WhyChooseUs.css'; // Create this CSS file for background styling

// const WhyChooseUs = () => {
//   return (
//     <section className="why-choose-us">
//       <div className="container py-5 text-dark">
//         <p className="text-warning fw-bold">Why Choose Us?</p>
//         <h3 className="fw-bold text-primary mb-3">
//           With years of hands-on experience in ICT solutions
//         </h3>
//         <p className="mb-5">
//           Our expertise has helped clients streamline operations, boost productivity, and embrace digital transformation.
//           We serve both tech-savvy businesses and those just starting their IT journey — with customized solutions that grow with you.
//         </p>

//         <div className="bg-light p-4 rounded shadow-sm">
//           <h4 className="fw-bold text-primary mb-3">Committed to Your Growth</h4>
//           <p>
//             At the heart of our company lies a passionate team of forward-thinkers and innovators dedicated to transforming technology into tangible business success.
//             We don’t just deliver solutions — we build lasting partnerships rooted in trust, creativity, and a relentless drive for excellence.
//             Our global experience combined with local insights empowers us to unlock new possibilities for every client, helping them stay ahead in an ever-evolving digital landscape.
//             Together, we're not just shaping technology — we’re shaping futures.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyChooseUs;


import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/WhyChooseUs.css'; // Create this CSS file for background styling


const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const [counters, setCounters] = useState({
    years: 0,
    solutions: 0,
    support: 24
  });
  const [hasAnimated, setHasAnimated] = useState(false);

  const animateCounter = (start, end, duration, callback) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);
      
      callback(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Trigger counter animations when stats section comes into view
            if (entry.target.classList.contains('stats-section') && !hasAnimated) {
              setHasAnimated(true);
              
              // Animate years counter
              setTimeout(() => {
                animateCounter(0, 10, 2000, (value) => {
                  setCounters(prev => ({ ...prev, years: value }));
                });
              }, 200);
              
              // Animate solutions counter
              setTimeout(() => {
                animateCounter(0, 500, 2500, (value) => {
                  setCounters(prev => ({ ...prev, solutions: value }));
                });
              }, 400);
              
              // Support stays at 24/7 but we can make it pulse
              setTimeout(() => {
                const supportElement = entry.target.querySelector('.support-number');
                if (supportElement) {
                  supportElement.classList.add('pulse-animation');
                }
              }, 600);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="why-choose-us" ref={sectionRef}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <p className="eyebrow-text animate-on-scroll">Why Choose Us?</p>
          <h2 className="main-heading animate-on-scroll">
            Proven ICT Solutions That Drive Results
          </h2>
          <p className="lead-text animate-on-scroll">
            From startups to enterprises — we deliver customized tech solutions that grow with your business.
          </p>
        </div>

        <div className="commitment-card animate-on-scroll">
          <div className="row align-items-center">
            <div className="col-lg-4">
              <h3 className="commitment-title">Built for Growth</h3>
            </div>
            <div className="col-lg-8">
              <p className="commitment-text">
                Our passionate team transforms technology into business success through lasting partnerships. 
                With global expertise and local insights, we don't just deliver solutions — we shape your future.
              </p>
            </div>
          </div>
        </div>

        <div className="row mt-5 stats-section animate-on-scroll">
          <div className="col-md-4 text-center mb-4">
            <div className="stat-item animate-on-scroll">
              <h4 className="stat-number">{counters.years}+</h4>
              <p className="stat-label">Years Experience</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="stat-item animate-on-scroll">
              <h4 className="stat-number">{counters.solutions}+</h4>
              <p className="stat-label">Custom Solutions</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="stat-item animate-on-scroll">
              <h4 className="stat-number support-number">24/7</h4>
              <p className="stat-label">Expert Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;