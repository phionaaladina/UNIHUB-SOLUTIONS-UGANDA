

// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import '../styles/Hero.css';

// const Hero = () => {
//   const services = [
//     {
//       id: 1,
//       imgSrc: "/webdev.jpg",
//       alt: "Web & Software Development",
//       title: "Web & Software Development",
//       description: "We design sleek, responsive websites and powerful web apps tailored to your business goals — fast, secure, and user-focused.",
//       linkText: "Learn More",
//       linkHref: "#web-development",
//     },
//     {
//       id: 2,
//       imgSrc: "/bgtest.png",
//       // imgSrc: "/helpdesk.jpg",
//       alt: "Managed IT Services",
//       title: "Managed IT Services",
//       description: "Worry less, do more. We manage your IT systems with 24/7 monitoring, maintenance, and support.",
//       linkText: "Learn More",
//       linkHref: "#managed-it-services",
//     },
//     {
//       id: 3,
//       // imgSrc: "/cyber.jpg",
//       imgSrc: "/cybertest.png",
//       alt: "Cybersecurity & Cloud Migration",
//       title: "Cybersecurity & Cloud Migration",
//       description: "Protect your data and systems with expert-led security audits and risk mitigation, while seamlessly moving your business to the cloud for safe, efficient, and cost-effective access to your data anywhere",
//       linkText: "Learn More",
//       linkHref: "#cybersecurity-cloud-migration",
//     },
//     {
//       id: 4,
//       imgSrc: "/infras.png",
//       alt: "Hardware & Infrastructure",
//       title: "Hardware & Infrastructure",
//       description: "Quality & Reliable hardware and robust network infrastructure designed and maintained to keep your business running smoothly and securely.",
//       linkText: "Learn More",
//       linkHref: "#hardware-infrastructure",
//     },
//     {
//       id: 5,
//       imgSrc: "/itSupport.jpg",
//       alt: "Specialized IT",
//       title: "Specialized IT",
//       description: "Tailored IT solutions that solve your unique business challenges — from database management and business intelligence to IT training and cutting-edge digital marketing technology.",
//       linkText: "Learn More",
//       linkHref: "#specialized-it",
//     },
//   ];

//   return (
//     <div
//       id="heroCarousel"
//       className="carousel slide carousel-fade"
//       data-bs-ride="carousel"
//       data-bs-interval="5000"
//       data-bs-pause="false"
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
//               />
//               <div className="hero-overlay"></div>
//             </div>
//            <div className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start">
//               <h1>{service.title}</h1>
//               <p className="lead">{service.description}</p>
//               <a href={service.linkHref} className="service-btn px-4 py-2 mt-3">
//                 {service.linkText}
//               </a>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Optional carousel controls */}
//       <button
//         className="carousel-control-prev"
//         type="button"
//         data-bs-target="#heroCarousel"
//         data-bs-slide="prev"
//       >
//         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Previous</span>
//       </button>
//       <button
//         className="carousel-control-next"
//         type="button"
//         data-bs-target="#heroCarousel"
//         data-bs-slide="next"
//       >
//         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         <span className="visually-hidden">Next</span>
//       </button>
//     </div>
//   );
// };

// export default Hero;





import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/Hero.css';

const Hero = () => {
  const services = [
    {
      id: 1,
      imgSrc: "/webdev.jpg",
      alt: "Web & Software Development",
      title: "Web & Software Development",
      description: "We design sleek, responsive websites and powerful web apps tailored to your business goals — fast, secure, and user-focused.",
      linkText: "Learn More",
      linkHref: "#web-development",
    },
    {
      id: 2,
      imgSrc: "/bgtest.png",
      alt: "Managed IT Services",
      title: "Managed IT Services",
      description: "Worry less, do more. We manage your IT systems with 24/7 monitoring, maintenance, and support.",
      linkText: "Learn More",
      linkHref: "#managed-it-services",
    },
    {
      id: 3,
      imgSrc: "/cybertest.png",
      alt: "Cybersecurity & Cloud Migration",
      title: "Cybersecurity & Cloud Migration",
      description: "Protect your data and systems with expert-led security audits and risk mitigation, while seamlessly moving your business to the cloud for safe, efficient, and cost-effective access to your data anywhere",
      linkText: "Learn More",
      linkHref: "#cybersecurity-cloud-migration",
    },
    {
      id: 4,
      imgSrc: "/infras.png",
      alt: "Hardware & Infrastructure",
      title: "Hardware & Infrastructure",
      description: "Quality & Reliable hardware and robust network infrastructure designed and maintained to keep your business running smoothly and securely.",
      linkText: "Learn More",
      linkHref: "#hardware-infrastructure",
    },
    {
      id: 5,
      imgSrc: "/itSupport.jpg",
      alt: "Specialized IT",
      title: "Specialized IT",
      description: "Tailored IT solutions that solve your unique business challenges — from database management and business intelligence to IT training and cutting-edge digital marketing technology.",
      linkText: "Learn More",
      linkHref: "#specialized-it",
    },
  ];

  return (
    <div
      id="heroCarousel"
      className="carousel slide" // REMOVED carousel-fade to enable slide effect
      data-bs-ride="carousel"
      data-bs-interval="5000"
      data-bs-pause="false"
    >
      <div className="carousel-inner">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`carousel-item${index === 0 ? ' active' : ''}`}
          >
            <div className="hero-img-container">
              <img
                src={service.imgSrc}
                alt={service.alt}
                className="d-block w-100 hero-img"
              />
              <div className="hero-overlay"></div>
            </div>
            <div className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start">
              <h1>{service.title}</h1>
              <p className="lead">{service.description}</p>
              <a href={service.linkHref} className="service-btn px-4 py-2 mt-3">
                {service.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#heroCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Hero;