// import React from 'react';
// import '../styles/Servicesection.css';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
// import '@fortawesome/fontawesome-svg-core/styles.css';


// const ServicesSection = () => {
//     const services = [
//         {
//             icon: 'fas fa-code', 
//             title: 'Web & Software Development',
//             description: 'We design and build responsive, dynamic websites and software applications tailored to your business needs — boosting engagement and growth.',
//         },
//         {
//             icon: 'fas fa-lightbulb', 
//             title: 'IT Consultancy',
//             description: 'Strategic advice to transform your operations. From tech planning to implementation, we provide expert guidance every step of the way.',
//         },
//         {
//             icon: 'fas fa-network-wired',
//             title: 'Hardware & Infrastructure',
//             description: 'We build and maintain secure, scalable IT ecosystems — from server setups to structured cabling and hardware deployment.',
//         },
//         {
//             icon: 'fas fa-headset',
//             title: 'IT Service Management',
//             description: 'Full-spectrum support services that keep your tech running smoothly. We manage your IT so you can manage your business.',
//         },
//         {
//             icon: 'fas fa-laptop',
//             title: 'Cloud & Security Solutions',
//             description: 'Secure your business with expert-led audits, cloud migrations, and compliance strategies — access data anywhere, worry-free.',
//         },
//         {
//             icon: 'fas fa-shield-alt',
//             title: 'Specialized IT Solutions',
//             description: 'From custom systems integration to cutting-edge solutions, we tackle unique challenges with tailored, innovative tech.',
//         },
//     ];
//     return (
//         <section className="services-section py-5">
//             <div className="container">
//                 <h4 className="section-subtitle text-center">Our Services</h4>
//                 <h2 className="section-title-main text-center mb-5">Explore Our Digital Solutions</h2> {/* Added a main title */}

//                 <div className="row justify-content-center">
//                     {services.map((service, index) => (
//                         <div key={index} className="col-lg-4 col-md-6 mb-4">
//                             <div className="service-card h-100 p-4 d-flex flex-column align-items-center text-center">
//                                 <div className="service-icon mb-3">
//                                     <i className={service.icon}></i>
//                                 </div>
//                                 <h5 className="service-title mb-2">{service.title}</h5>
//                                 <p className="service-description">{service.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="text-center mt-4">
//                     <button className="btn btn-discover-more">Discover More</button>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default ServicesSection;



import React, { useEffect, useRef } from 'react';
import '../styles/Servicesection.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '@fortawesome/fontawesome-svg-core/styles.css';

const ServicesSection = () => {
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);
    const titleRef = useRef(null);
    const buttonRef = useRef(null);

    const services = [
        {
            icon: 'fas fa-code', 
            title: 'Web & Software Development',
            description: 'We design and build responsive, dynamic websites and software applications tailored to your business needs, boosting engagement and growth.',
        },
        {
            icon: 'fas fa-lightbulb', 
            title: 'IT Consultancy',
            description: 'Strategic advice to transform your operations. From tech planning to implementation, we provide expert guidance every step of the way.',
        },
        {
            icon: 'fas fa-network-wired',
            title: 'Hardware & Infrastructure',
            description: 'We build and maintain secure, scalable IT ecosystems, from server setups to structured cabling and hardware deployment.',
        },
        {
            icon: 'fas fa-headset',
            title: 'IT Service Management',
            description: 'Full-spectrum support services that keep your tech running smoothly. We manage your IT so you can manage your business.',
        },
        {
            icon: 'fas fa-laptop',
            title: 'Cloud & Security Solutions',
            description: 'Secure your business with expert-led audits, cloud migrations, and compliance strategies, access data anywhere, worry-free.',
        },
        {
            icon: 'fas fa-shield-alt',
            title: 'Specialized IT Solutions',
            description: 'From custom systems integration to cutting-edge solutions, we tackle unique challenges with tailored, innovative tech.',
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully visible
            }
        );

        // Observe title
        if (titleRef.current) {
            observer.observe(titleRef.current);
        }

        // Observe cards with staggered delay
        cardsRef.current.forEach((card, index) => {
            if (card) {
                card.style.animationDelay = `${index * 0.1}s`;
                observer.observe(card);
            }
        });

        // Observe button
        if (buttonRef.current) {
            observer.observe(buttonRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="services-section py-5">
            <div className="container">
                <div ref={titleRef} className="title-container fade-in-up">
                    <h4 className="section-subtitle text-center">Our Services</h4>
                    <h2 className="section-title-main text-center mb-5">Explore Our Digital Solutions</h2>
                </div>

                <div className="row justify-content-center">
                    {services.map((service, index) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                            <div 
                                ref={el => cardsRef.current[index] = el}
                                className="service-card h-100 p-4 d-flex flex-column align-items-center text-center fade-in-up"
                            >
                                <div className="service-icon mb-3">
                                    <i className={service.icon}></i>
                                </div>
                                <h5 className="service-title mb-2">{service.title}</h5>
                                <p className="service-description">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <button 
                        ref={buttonRef}
                        className="btn btn-discover-more fade-in-up"
                    >
                        Discover More
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;