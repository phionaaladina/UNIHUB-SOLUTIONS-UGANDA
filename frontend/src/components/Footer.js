import React from 'react';
import '../styles/Footer.css'; 

const Footer = () => {
    // Dummy Products Data
    const dummyProducts = [
        "Laptops",
        "Desktops",
        "Accessories",
        "Software"
        
    ];

    return (
        <footer className="footer mt-auto">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        {/* ADDRESS Column */}
                        <div className="col-md-3 mb-4 mb-md-0">
                            <h5 className="footer-heading">ADDRESS</h5>
                            <p className="mb-1">Unihub Solutions (U) Ltd</p>
                            <p className="mb-1">Plot 90 Kanjokya House,</p>
                            <p className="mb-3">Kanjokya Street</p>
                            <p className="mb-1">+256 784675790</p>
                            <p className="mb-3">+256 704145972</p>
                            <p><a href="mailto:info@unihub.com">info@unihub.com</a></p>
                        </div>

                        {/* SERVICES Column */}
                        <div className="col-md-3 mb-4 mb-md-0">
                            <h5 className="footer-heading">SERVICES</h5>
                            <ul className="list-unstyled">
                                <li><a href="#it-consultancy">Web & Software Development</a></li>
                                <li><a href="#web-development">Managed IT Services</a></li>
                                <li><a href="#network-infrastructure">Cybersecurity & Cloud Migration</a></li>
                                <li><a href="#it-service-management">Hardware & Infrastructure</a></li>
                                <li><a href="#hardware-supply">Specialized IT</a></li>
                             
                            </ul>
                        </div>

                        {/* PRODUCTS Column - Now with dummy products */}
                        <div className="col-md-2 mb-4 mb-md-0">
                            <h5 className="footer-heading">PRODUCTS</h5>
                            <ul className="list-unstyled">
                                {dummyProducts.map((product, index) => (
                                    // Using index as key is acceptable for static lists that don't change order,
                                    // but a unique ID from the data would be preferred in a real application.
                                    <li key={index}><a href={`#product-${index}`}>{product}</a></li>
                                ))}
                            </ul>
                        </div>

                        {/* QUICK LINKS Column */}
                        <div className="col-md-2 mb-4 mb-md-0">
                            <h5 className="footer-heading">QUICK LINKS</h5>
                            <ul className="list-unstyled">
                                <li><a href="#about">About</a></li>
                                <li><a href="#services">Services</a></li>
                                <li><a href="#news">News</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        {/* CONNECT Column */}
                        <div className="col-md-2">
                            <h5 className="footer-heading">CONNECT</h5>
                            {/* Add social media links or other connect options here */}
                            <ul className="list-unstyled">
                                <li><a href="#instagram">Instagram</a></li>
                                <li><a href="#twitter">Twitter</a></li>
                                <li><a href="#linkedin">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom text-center">
                <div className="container">
                    <p className="mb-0">Copyright@ 2025 Unihub Solutions Uganda</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;