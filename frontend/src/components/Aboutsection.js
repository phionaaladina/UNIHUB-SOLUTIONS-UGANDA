import React from 'react';
import '../styles/Aboutsection.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 



const AboutSection = () => {
    return (
        <section className="about-section py-5">
            <div className="container">
                <div className="row align-items-center">
               
                    <div className="col-lg-5 col-md-12 mb-4 mb-lg-0 text-center">
                        <img
                            src="/slide1.jpg" 
                            alt="Digital Innovation & Automation"
                            className="img-fluid about-image"
                        />
                    </div>


                    <div className="col-lg-7 col-md-12">
                        <h4 className="about-us-heading">About Us</h4>
                        <h2 className="section-title mb-4">Your Trusted Partner in Digital Innovation & Automation</h2>
                        <p className="lead-text mb-4">
                            UNIHUB Solutions Uganda is a leading ICT and automation firm that provides reliable, affordable, and high-quality digital
                            solutions tailored to local needs. Since 2021, we've served government, telecom, and corporate clients across Uganda.
                        </p>

                        <div className="row service-list-row">
                            <div className="col-md-6">
                                <ul className="list-unstyled service-list">
                                   
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#it-consultancy-page">IT Consultancy</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#computer-repair-page">Computer Repair and maintenance</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#computer-training-page">Computer Training</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#laptops-supply-page">Computers and Laptops Supply</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#software-hardware-page">PC Software and Hardware Services</a></li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <ul className="list-unstyled service-list">
                                   
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#networking-services-page">Networking Services</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#database-management-page">Database management</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#website-development-page">Website Development</a></li>
                                    <li><i className="bi bi-check-circle-fill"></i> <a href="#data-recovery-page">Data recovery</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button className="btn btn-learn-more">Learn More</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;