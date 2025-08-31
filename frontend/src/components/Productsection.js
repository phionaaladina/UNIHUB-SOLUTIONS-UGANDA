import React from 'react';
import '../styles/Productsection.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported



const ProductsSection = () => {
const products = [
  {
    type: 'image',
    src: "./laptopdesktop.png",
    alt: 'Laptops & Desktops',
    title: 'Laptops & desktops',
    description: 'High performance personal and desktop computers for both home and office use. Fully set up with essential software. Top brands: HP, Dell, Lenovo, Acer, ASUS. Affordable. Ready to use.',
  },
  {
    type: 'image',
    src: "./webdev.jpg",
    alt: 'Web and mobile App Development Icon',
    title: 'Web & mobile App Development',
    description: 'We build responsive websites and mobile applications tailored to your business needs. From idea to deployment, we use modern tech to create seamless digital experiences.',
  },
  {
    type: 'image',
    src: "./itSupport.jpg",
    alt: 'IT Consultancy',
    title: 'IT Consultancy',
    description: 'Expert IT consultancy services to help you leverage technology for growth. We provide strategic guidance, system audits, and tailored solutions for businesses of all sizes.',
  },
];
    return (
        <section className="products-section py-5">
            <div className="container">
                <h4 className="section-subtitle text-center">Your Tech Needs, Solved!</h4>
                <h2 className="section-title-main text-center mb-5">Discover Our Top-Rated IT Solutions</h2>

                <div className="row justify-content-center">
                    {products.map((product, index) => (
                        <div key={index} className="col-lg-4 col-md-6 mb-4">
                            <div className="product-card h-100 p-4 d-flex flex-column align-items-center text-center">
                                <div className="product-media mb-3">
                                    {product.type === 'image' && (
                                        <img src={product.src} alt={product.alt} className="img-fluid" />
                                    )}
                                    {/* If you wanted to use a Font Awesome icon for a card, it would look like this: */}
                                    {/* {product.type === 'icon' && (
                                        <i className={product.icon}></i>
                                    )} */}
                                </div>
                                <h5 className="product-title mb-2">{product.title}</h5>
                                <p className="product-description">{product.description}</p>
                                <div className="mt-auto"> {/* Pushes "Learn More" to bottom */}
                                    <a href="#learn-more" className="product-learn-more">Learn More</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;