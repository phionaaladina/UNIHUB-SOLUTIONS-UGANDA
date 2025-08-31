// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/MoreAbout.css'; // Make sure this path is correct

// const MoreAbout = () => {
//   return (
//     <div className="more-about-section container py-5">
//       <h3 className="section-title text-center mb-5 fw-bold">Get To Know Us</h3>

//       <div className="row text-center">

//         {/* Vision */}
//         <div className="col-md-4 mb-4">
//           <i className="bi bi-eye-fill about-icon"></i>
//           <h5 className="about-heading">Our Vision</h5>
//           <p>
//             To bridge the gap between the youths who are unskilled and skilled
//             with technological entrepreneurship training to improve their livelihood.
//           </p>
//         </div>

//         {/* Mission */}
//         <div className="col-md-4 mb-4">
//           <i className="bi bi-bullseye about-icon"></i>
//           <h5 className="about-heading">Our Mission</h5>
//           <p>
//             To empower the youths with technological knowledge and innovative skills
//             to influence Africa’s economy through training them to become job creators.
//             Offering tools, resources, and opportunities that allow them to prosper.
//           </p>
//         </div>

//         {/* Core Values */}
//         <div className="col-md-4 mb-4">
//           <i className="bi bi-lightbulb-fill about-icon"></i>
//           <h5 className="about-heading">Our Core Values</h5>
//           <ul className="list-unstyled core-values">
//             <li>• Desire for Excellence</li>
//             <li>• Trust and confidence build-up</li>
//             <li>• Innovation</li>
//             <li>• Transparency</li>
//             <li>• Teamwork</li>
//           </ul>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default MoreAbout;
import React, { useState, useEffect, useRef } from 'react';

const MoreAbout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      iconClass: "bi bi-eye-fill",
      title: "Our Vision",
      content: "To bridge the gap between the youths who are unskilled and skilled with technological entrepreneurship training to improve their livelihood.",
      gradient: "linear-gradient(135deg, #0047ab, #3366cc)",
      bgColor: "#f8faff"
    },
    {
      iconClass: "bi bi-bullseye",
      title: "Our Mission", 
      content: "To empower the youths with technological knowledge and innovative skills to influence Africa's economy through training them to become job creators. Offering tools, resources, and opportunities that allow them to prosper.",
      gradient: "linear-gradient(135deg, #fc7f10, #ff9940)",
      bgColor: "#fff8f3"
    },
    {
      iconClass: "bi bi-lightbulb-fill",
      title: "Our Core Values",
      content: null,
      values: [
        "Desire for Excellence",
        "Trust and confidence build-up", 
        "Innovation",
        "Transparency",
        "Teamwork"
      ],
      gradient: "linear-gradient(135deg, #0047ab, #fc7f10)",
      bgColor: "#fafafa"
    }
  ];

  const containerStyle = {
    minHeight: '100vh',
    background: `linear-gradient(135deg, #edecea 0%, #ffffff 50%, #f8faff 100%)`,
    padding: '5rem 1rem',
    overflow: 'hidden',
    position: 'relative'
  };

  const backgroundElementsStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  };

  const floatingElement1 = {
    position: 'absolute',
    top: '5rem',
    left: '2.5rem',
    width: '8rem',
    height: '8rem',
    backgroundColor: 'rgba(0, 71, 171, 0.2)',
    borderRadius: '50%',
    opacity: 0.3,
    animation: 'pulse 2s infinite'
  };

  const floatingElement2 = {
    position: 'absolute',
    bottom: '10rem',
    right: '5rem',
    width: '6rem',
    height: '6rem',
    backgroundColor: 'rgba(252, 127, 16, 0.2)',
    borderRadius: '50%',
    opacity: 0.3,
    animation: 'bounce 2s infinite'
  };

  const floatingElement3 = {
    position: 'absolute',
    top: '50%',
    left: '25%',
    width: '4rem',
    height: '4rem',
    backgroundColor: 'rgba(237, 236, 234, 0.4)',
    borderRadius: '50%',
    opacity: 0.4,
    animation: 'ping 1s infinite'
  };

  const titleContainerStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
    transform: isVisible ? 'translateY(0) opacity(1)' : 'translateY(2.5rem) opacity(0)',
    transition: 'all 1s ease-out'
  };

  const titleStyle = {
    fontSize: 'clamp(3rem, 8vw, 4rem)',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #0047ab, #fc7f10, #0047ab)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    display: 'inline-block'
  };

  const underlineStyle = {
    width: '6rem',
    height: '0.25rem',
    background: 'linear-gradient(90deg, #0047ab, #fc7f10)',
    margin: '0 auto',
    borderRadius: '9999px',
    animation: 'pulse 2s infinite'
  };

  const cardStyle = (index, isHovered) => ({
    position: 'relative',
    height: '100%',
    padding: '2rem',
    borderRadius: '1.5rem',
    border: '1px solid #e5e7eb',
    backgroundColor: cards[index].bgColor,
    backdropFilter: 'blur(8px)',
    transform: `translateY(${isVisible ? '0' : '5rem'}) scale(${isHovered ? '1.05' : '1'}) ${isHovered ? 'translateY(-0.5rem)' : ''}`,
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.7s ease-out, transform 0.5s ease-out',
    transitionDelay: `${index * 200}ms`,
    cursor: 'pointer',
    boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: isHovered ? 10 : 1
  });

  const gradientOverlayStyle = (gradient, isHovered) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '1.5rem',
    background: gradient,
    opacity: isHovered ? 0.05 : 0,
    transition: 'opacity 0.5s ease'
  });

  const iconContainerStyle = (gradient, isHovered) => ({
    width: '5rem',
    height: '5rem',
    borderRadius: '1rem',
    margin: '0 auto 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: gradient,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transform: `rotate(${isHovered ? '6deg' : '0deg'}) scale(${isHovered ? '1.1' : '1'})`,
    transition: 'all 0.5s ease'
  });

  const iconStyle = (isHovered) => ({
    fontSize: '2.5rem',
    color: 'white',
    transition: 'all 0.5s ease',
    animation: isHovered ? 'pulse 1s infinite' : 'none'
  });

  const titleTextStyle = (gradient, isHovered) => ({
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0047ab',
    marginBottom: '1rem',
    textAlign: 'center',
    position: 'relative'
  });

  const underlineBarStyle = (gradient, isHovered) => ({
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    height: '2px',
    width: isHovered ? '100%' : '0%',
    background: gradient,
    transition: 'width 0.5s ease'
  });

  const contentStyle = {
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: '1.6'
  };

  const valueItemStyle = (isHovered, index) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    borderRadius: '0.75rem',
    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
    transform: `translateX(${isHovered ? '0.5rem' : '0'})`,
    transition: 'all 0.5s ease',
    transitionDelay: `${index * 100}ms`,
    marginBottom: '0.75rem'
  });

  const arrowStyle = (isHovered) => ({
    color: '#fc7f10',
    transition: 'all 0.3s ease',
    transform: `translateX(${isHovered ? '0.25rem' : '0'})`
  });

  const particleStyle = (i, gradient) => ({
    position: 'absolute',
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    background: gradient,
    opacity: 0.6,
    left: `${20 + i * 30}%`,
    top: `${10 + i * 20}%`,
    animation: 'bounce 2s infinite',
    animationDelay: `${i * 200}ms`
  });

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-0.5rem); }
          }
          @keyframes ping {
            0% { transform: scale(1); opacity: 1; }
            75%, 100% { transform: scale(2); opacity: 0; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .star-spin { animation: spin 2s linear infinite; }
          .star-spin-reverse { animation: spin 2s linear infinite reverse; }
        `}
      </style>
      
      <div ref={sectionRef} style={containerStyle}>
        {/* Animated background elements */}
        <div style={backgroundElementsStyle}>
          <div style={floatingElement1}></div>
          <div style={floatingElement2}></div>
          <div style={floatingElement3}></div>
        </div>

        <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative' }}>
          {/* Animated Title */}
          <div style={titleContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <i className="bi bi-stars star-spin" style={{ fontSize: '2rem', color: '#0047ab' }}></i>
              <h2 style={titleStyle}>Get To Know Us</h2>
              <i className="bi bi-stars star-spin-reverse" style={{ fontSize: '2rem', color: '#fc7f10' }}></i>
            </div>
            <div style={underlineStyle}></div>
          </div>

          {/* Animated Cards Grid */}
          <div className="row">
            {cards.map((card, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div
                  style={cardStyle(index, hoveredCard === index)}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Gradient overlay on hover */}
                  <div style={gradientOverlayStyle(card.gradient, hoveredCard === index)}></div>

                  {/* Animated icon container */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={iconContainerStyle(card.gradient, hoveredCard === index)}>
                      <i 
                        className={card.iconClass} 
                        style={iconStyle(hoveredCard === index)}
                      ></i>
                    </div>

                    {/* Title with animated underline */}
                    <h3 style={titleTextStyle(card.gradient, hoveredCard === index)}>
                      {card.title}
                      <div style={underlineBarStyle(card.gradient, hoveredCard === index)}></div>
                    </h3>

                    {/* Content */}
                    {card.content && (
                      <p style={contentStyle}>{card.content}</p>
                    )}

                    {/* Core Values List */}
                    {card.values && (
                      <div>
                        {card.values.map((value, valueIndex) => (
                          <div
                            key={valueIndex}
                            style={valueItemStyle(hoveredCard === index, valueIndex)}
                          >
                            <i 
                              className="bi bi-arrow-right" 
                              style={arrowStyle(hoveredCard === index)}
                            ></i>
                            <span style={{ color: '#6c757d', fontWeight: '500' }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Floating particles effect */}
                    {hoveredCard === index && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} style={particleStyle(i, card.gradient)}></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom decorative element */}
          <div style={{
            textAlign: 'center',
            marginTop: '4rem',
            transform: isVisible ? 'translateY(0) opacity(1)' : 'translateY(2.5rem) opacity(0)',
            transition: 'all 1s ease-out',
            transitionDelay: '800ms'
          }}>
            <div style={{
              width: '8rem',
              height: '0.25rem',
              background: 'linear-gradient(90deg, #0047ab, #fc7f10)',
              margin: '0 auto',
              borderRadius: '9999px',
              animation: 'pulse 2s infinite'
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', gap: '0.5rem' }}>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #0047ab, #fc7f10)',
                    animation: 'pulse 1.5s infinite',
                    animationDelay: `${i * 200}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreAbout;