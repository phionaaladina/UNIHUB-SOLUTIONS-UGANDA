import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../config';
import '../styles/Hero.css';

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exitingSlide, setExitingSlide] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'We craft sleek, responsive websites and powerful apps for you—tailored, fast, and built with your users in mind.',
      linkText: 'Get Started',
      linkHref: '#web-development',
    },
    {
      id: 2,
      title: 'Managed IT Services',
      description: 'Worry less, do more. We handle your IT systems with 24/7 monitoring, expert maintenance, and friendly support.',
      linkText: 'Get Started',
      linkHref: '#managed-it-services',
    },
    {
      id: 3,
      title: 'Cybersecurity',
      description: 'We safeguard your data with expert audits and robust protection, giving you peace of mind every step of the way.',
      linkText: 'Get Started',
      linkHref: '#cybersecurity',
    },
    {
      id: 4,
      title: 'Cloud Migration',
      description: 'We make your move to the cloud seamless, delivering secure, efficient access wherever you are—your success is our goal.',
      linkText: 'Get Started',
      linkHref: '#cloud-migration',
    },
    {
      id: 5,
      title: 'Hardware & Infrastructure',
      description: 'We provide rock-solid hardware and reliable networks, ensuring your business runs smoothly with our dedicated care.',
      linkText: 'Get Started',
      linkHref: '#hardware-infrastructure',
    },
    {
      id: 6,
      title: 'Specialized IT',
      description: 'We offer custom solutions for your unique needs—databases, training, and digital marketing tech, all tailored for you.',
      linkText: 'Get Started',
      linkHref: '#specialized-it',
    },
    {
      id: 7,
      title: 'Computer Repair & Maintenance',
      description: 'We fix and maintain your computers with expert repairs and regular upkeep, keeping your devices running like new.',
      linkText: 'Get Started',
      linkHref: '#computer-repair',
    },
    {
      id: 8,
      title: 'IT Training',
      description: 'We mentor you from beginner basics to advanced mastery with tailored IT training that grows your skills.',
      linkText: 'Get Started',
      linkHref: '#it-training',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setExitingSlide(currentSlide);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % services.length);
        setExitingSlide(null);
      }, 800);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide, services.length]);

  const goToSlide = (index) => {
    if (index !== currentSlide) {
      setExitingSlide(currentSlide);
      setTimeout(() => {
        setCurrentSlide(index);
        setExitingSlide(null);
      }, 800);
    }
  };

  const nextSlide = () => {
    setExitingSlide(currentSlide);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
      setExitingSlide(null);
    }, 800);
  };

  const prevSlide = () => {
    setExitingSlide(currentSlide);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
      setExitingSlide(null);
    }, 800);
  };

  return (
    <div className="hero-container">
      {/* Static background image */}
      <div className="hero-background">
        <img
          src="/bgtest.png"
          alt="Hero background"
          className="hero-bg-img"
          loading="eager"
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Content slideshow */}
      <div className="hero-content">
        <div className="text-content-container">
          {services.map((service, index) => {
            const isActive = index === currentSlide;
            const isExiting = index === exitingSlide;
            return (
              <div
                key={service.id}
                className={`text-slide ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
              >
                <h1 className="hero-title">{service.title}</h1>
                <p className="hero-description">{service.description}</p>
                <a
                  href={service.linkHref}
                  className="service-btn"
                  aria-label={`Learn more about ${service.title}`}
                >
                  {service.linkText}
                </a>
              </div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="hero-indicators">
          {services.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          className="hero-nav hero-nav-prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <span>‹</span>
        </button>
        <button
          className="hero-nav hero-nav-next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <span>›</span>
        </button>
      </div>
    </div>
  );
};

export default Hero;



// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import API_BASE_URL from '../config';
// import '../styles/Hero.css';

// export const Hero = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [exitingSlide, setExitingSlide] = useState(null);

//   const services = [
//     {
//       id: 1,
//       title: 'Web & Software Development',
//       description:
//         'We design sleek, responsive websites and powerful web apps tailored to your business goals — fast, secure, and user-focused.',
//       linkText: 'Learn More',
//       linkHref: '#web-development',
//     },
//     {
//       id: 2,
//       title: 'Managed IT Services',
//       description: 'Worry less, do more. We manage your IT systems with 24/7 monitoring, maintenance, and support.',
//       linkText: 'Learn More',
//       linkHref: '#managed-it-services',
//     },
//     {
//       id: 3,
//       title: 'Cybersecurity & Cloud Migration',
//       description:
//         'Protect your data and systems with expert-led security audits and risk mitigation, while seamlessly moving your business to the cloud for safe, efficient, and cost-effective access to your data anywhere.',
//       linkText: 'Learn More',
//       linkHref: '#cybersecurity-cloud-migration',
//     },
//     {
//       id: 4,
//       title: 'Hardware & Infrastructure',
//       description:
//         'Quality & Reliable hardware and robust network infrastructure designed and maintained to keep your business running smoothly and securely.',
//       linkText: 'Learn More',
//       linkHref: '#hardware-infrastructure',
//     },
//     {
//       id: 5,
//       title: 'Specialized IT',
//       description:
//         'Tailored IT solutions that solve your unique business challenges — from database management and business intelligence to IT training and cutting-edge digital marketing technology.',
//       linkText: 'Learn More',
//       linkHref: '#specialized-it',
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setExitingSlide(currentSlide);
//       setTimeout(() => {
//         setCurrentSlide((prev) => (prev + 1) % services.length);
//         setExitingSlide(null);
//       }, 800);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [currentSlide, services.length]);

//   const goToSlide = (index) => {
//     if (index !== currentSlide) {
//       setExitingSlide(currentSlide);
//       setTimeout(() => {
//         setCurrentSlide(index);
//         setExitingSlide(null);
//       }, 800);
//     }
//   };

//   const nextSlide = () => {
//     setExitingSlide(currentSlide);
//     setTimeout(() => {
//       setCurrentSlide((prev) => (prev + 1) % services.length);
//       setExitingSlide(null);
//     }, 800);
//   };

//   const prevSlide = () => {
//     setExitingSlide(currentSlide);
//     setTimeout(() => {
//       setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
//       setExitingSlide(null);
//     }, 800);
//   };

//   return (
//     <div className="hero-container">
//       {/* Static background image */}
//       <div className="hero-background">
//         <img
//           src="/bgtest.png"
//           alt="Hero background"
//           className="hero-bg-img"
//           loading="eager"
//         />
//         <div className="hero-overlay"></div>
//       </div>

//       {/* Content slideshow */}
//       <div className="hero-content">
//         <div className="text-content-container">
//           {services.map((service, index) => {
//             const isActive = index === currentSlide;
//             const isExiting = index === exitingSlide;
//             return (
//               <div
//                 key={service.id}
//                 className={`text-slide ${isActive ? 'active' : ''} ${isExiting ? 'exiting' : ''}`}
//               >
//                 <h1 className="hero-title">{service.title}</h1>
//                 <p className="hero-description">{service.description}</p>
//                 <a
//                   href={service.linkHref}
//                   className="service-btn"
//                   aria-label={`Learn more about ${service.title}`}
//                 >
//                   {service.linkText}
//                 </a>
//               </div>
//             );
//           })}
//         </div>

//         {/* Navigation dots */}
//         <div className="hero-indicators">
//           {services.map((_, index) => (
//             <button
//               key={index}
//               type="button"
//               className={`indicator ${index === currentSlide ? 'active' : ''}`}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>

//         {/* Navigation arrows */}
//         <button
//           className="hero-nav hero-nav-prev"
//           onClick={prevSlide}
//           aria-label="Previous slide"
//         >
//           <span>‹</span>
//         </button>
//         <button
//           className="hero-nav hero-nav-next"
//           onClick={nextSlide}
//           aria-label="Next slide"
//         >
//           <span>›</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Hero;







// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import API_BASE_URL from "../config";
// import '../styles/Hero.css';

// export const Hero = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const services = [
//     {
//       id: 1,
//       title: "Web & Software Development",
//       description: "We design sleek, responsive websites and powerful web apps tailored to your business goals — fast, secure, and user-focused.",
//       linkText: "Learn More",
//       linkHref: "#web-development",
//     },
//     {
//       id: 2,
//       title: "Managed IT Services",
//       description: "Worry less, do more. We manage your IT systems with 24/7 monitoring, maintenance, and support.",
//       linkText: "Learn More",
//       linkHref: "#managed-it-services",
//     },
//     {
//       id: 3,
//       title: "Cybersecurity & Cloud Migration",
//       description: "Protect your data and systems with expert-led security audits and risk mitigation, while seamlessly moving your business to the cloud for safe, efficient, and cost-effective access to your data anywhere",
//       linkText: "Learn More",
//       linkHref: "#cybersecurity-cloud-migration",
//     },
//     {
//       id: 4,
//       title: "Hardware & Infrastructure",
//       description: "Quality & Reliable hardware and robust network infrastructure designed and maintained to keep your business running smoothly and securely.",
//       linkText: "Learn More",
//       linkHref: "#hardware-infrastructure",
//     },
//     {
//       id: 5,
//       title: "Specialized IT",
//       description: "Tailored IT solutions that solve your unique business challenges — from database management and business intelligence to IT training and cutting-edge digital marketing technology.",
//       linkText: "Learn More",
//       linkHref: "#specialized-it",
//     },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % services.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [services.length]);

//   const goToSlide = (index) => {
//     setCurrentSlide(index);
//   };

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % services.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
//   };

//   return (
//     <div className="hero-container">
//       {/* Static background image */}
//       <div className="hero-background">
//         <img
//           src="/bgtest.png"
//           alt="Hero background"
//           className="hero-bg-img"
//           loading="eager"
//         />
//         <div className="hero-overlay"></div>
//       </div>
      
//       {/* Content slideshow */}
//       <div className="hero-content">
//         <div className="text-content-container">
//           {services.map((service, index) => (
//             <div
//               key={service.id}
//               className={`text-slide ${index === currentSlide ? 'active' : ''}`}
//             >
//               <h1 className="hero-title">{service.title}</h1>
//               <p className="hero-description">{service.description}</p>
//               <a href={service.linkHref} className="service-btn">
//                 {service.linkText}
//               </a>
//             </div>
//           ))}
//         </div>
        
//         {/* Navigation dots */}
//         <div className="hero-indicators">
//           {services.map((_, index) => (
//             <button
//               key={index}
//               type="button"
//               className={`indicator ${index === currentSlide ? 'active' : ''}`}
//               onClick={() => goToSlide(index)}
//               aria-label={`Go to slide ${index + 1}`}
//             />
//           ))}
//         </div>
        
//         {/* Navigation arrows */}
//         <button
//           className="hero-nav hero-nav-prev"
//           onClick={prevSlide}
//           aria-label="Previous slide"
//         >
//           <span>‹</span>
//         </button>
//         <button
//           className="hero-nav hero-nav-next"
//           onClick={nextSlide}
//           aria-label="Next slide"
//         >
//           <span>›</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Hero;


// import React, { useEffect, useRef } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import API_BASE_URL from "../config";
// import '../styles/Hero.css';

// export const Hero = () => {
//   const carouselRef = useRef(null);

//   const services = [
//     {
//       id: 1,
//        imgSrc: "/bgtest.png",
//       alt: "Web & Software Development",
//       title: "Web & Software Development",
//       description: "We design sleek, responsive websites and powerful web apps tailored to your business goals — fast, secure, and user-focused.",
//       linkText: "Learn More",
//       linkHref: "#web-development",
//     },
//     {
//       id: 2,
//       imgSrc: "/bgtest.png",
//       alt: "Managed IT Services",
//       title: "Managed IT Services",
//       description: "Worry less, do more. We manage your IT systems with 24/7 monitoring, maintenance, and support.",
//       linkText: "Learn More",
//       linkHref: "#managed-it-services",
//     },
//     {
//       id: 3,
//        imgSrc: "/bgtest.png",
//       alt: "Cybersecurity & Cloud Migration",
//       title: "Cybersecurity & Cloud Migration",
//       description: "Protect your data and systems with expert-led security audits and risk mitigation, while seamlessly moving your business to the cloud for safe, efficient, and cost-effective access to your data anywhere",
//       linkText: "Learn More",
//       linkHref: "#cybersecurity-cloud-migration",
//     },
//     {
//       id: 4,
//        imgSrc: "/bgtest.png",
//       alt: "Hardware & Infrastructure",
//       title: "Hardware & Infrastructure",
//       description: "Quality & Reliable hardware and robust network infrastructure designed and maintained to keep your business running smoothly and securely.",
//       linkText: "Learn More",
//       linkHref: "#hardware-infrastructure",
//     },
//     {
//       id: 5,
//        imgSrc: "/bgtest.png",
//       alt: "Specialized IT",
//       title: "Specialized IT",
//       description: "Tailored IT solutions that solve your unique business challenges — from database management and business intelligence to IT training and cutting-edge digital marketing technology.",
//       linkText: "Learn More",
//       linkHref: "#specialized-it",
//     },
//   ];

//   useEffect(() => {
//     // Force initialize Bootstrap carousel after component mounts
//     const initCarousel = () => {
//       if (carouselRef.current && window.bootstrap) {
//         const carousel = new window.bootstrap.Carousel(carouselRef.current, {
//           interval: 5000,
//           ride: 'carousel',
//           pause: false,
//           wrap: true,
//           touch: true // Enable touch support
//         });
        
//         // Force start cycling
//         carousel.cycle();
        
//         // On mobile devices, ensure autoplay continues even after touch interactions
//         const isMobile = window.innerWidth <= 768;
//         if (isMobile) {
//           // Resume autoplay after touch events
//           carouselRef.current.addEventListener('touchend', () => {
//             setTimeout(() => carousel.cycle(), 100);
//           });
          
//           // Resume autoplay after slide transitions
//           carouselRef.current.addEventListener('slid.bs.carousel', () => {
//             setTimeout(() => carousel.cycle(), 100);
//           });
//         }
//       }
//     };

//     // Delay initialization to ensure Bootstrap is loaded
//     const timer = setTimeout(initCarousel, 100);
    
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div
//       ref={carouselRef}
//       id="heroCarousel"
//       className="carousel slide"
//       data-bs-ride="carousel"
//       data-bs-interval="5000"
//       data-bs-pause="false"
//       data-bs-touch="true"
//     >
//       <div className="carousel-inner">
//         {services.map((service, index) => (
//           <div
//             key={service.id}
//             className={`carousel-item${index === 0 ? ' active' : ''}`}
//           >
//             <div className="hero-img-container">
//               <img
//                 src={service.imgSrc}
//                 alt={service.alt}
//                 className="d-block w-100 hero-img"
//                 loading={index === 0 ? "eager" : "lazy"}
//               />
//               <div className="hero-overlay"></div>
//             </div>
//             <div className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start">
//               <h1>{service.title}</h1>
//               <p className="lead">{service.description}</p>
//               <a href={service.linkHref} className="service-btn px-4 py-2 mt-3">
//                 {service.linkText}
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Carousel controls */}
//       <button
//         className="carousel-control-prev"
//         type="button"
//         data-bs-target="#heroCarousel"
//         data-bs-slide="prev"
//         aria-label="Previous slide"
//       >
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Previous</span>
//       </button>
//       <button
//         className="carousel-control-next"
//         type="button"
//         data-bs-target="#heroCarousel"
//         data-bs-slide="next"
//         aria-label="Next slide"
//       >
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Next</span>
//       </button>
//     </div>
//   );
// };

// export default Hero;