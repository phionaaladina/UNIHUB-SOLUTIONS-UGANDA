// // components/Navbar.js
// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { FaShoppingCart } from 'react-icons/fa';
// import { CartContext } from '../context/CartContext';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   const { cart } = useContext(CartContext);

//   const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

//   return (
//     <nav className="navbar navbar-expand-lg navbar-custom">
//       <div className="container-fluid">
//         <Link className="navbar-brand d-flex align-items-center" to="/">
//           <img src="/unihublogo.png" alt="Logo" className="logo" />
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto d-flex align-items-center">
//             <li className="nav-item">
//               <Link className="nav-link" to="/">Home</Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/about">About</Link>
//             </li>

//             <li className="nav-item dropdown">
//               <a
//                 className="nav-link dropdown-toggle"
//                 href="#"
//                 id="servicesDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Services
//               </a>
//               <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
//                 <li><Link className="dropdown-item" to="/services/web-software-development">Web & Software Development</Link></li>
//                 <li><Link className="dropdown-item" to="/services/managed-it">Managed IT Services</Link></li>
//                 <li><Link className="dropdown-item" to="/services/cybersecurity-cloud">Cybersecurity & Cloud Migration</Link></li>
//                 <li><Link className="dropdown-item" to="/services/hardware-infrastructure">Hardware & Infrastructure</Link></li>
//                 <li><Link className="dropdown-item" to="/services/specialized-it">Specialized IT</Link></li>
//               </ul>
//             </li>

//             <li className="nav-item dropdown">
//               <Link
//                 className="nav-link dropdown-toggle"
//                 to="/products"
//                 id="productsDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Products
//               </Link>
//               <ul className="dropdown-menu" aria-labelledby="productsDropdown">
//                 <li><Link className="dropdown-item" to="/products/laptops">Laptops</Link></li>
//                 <li><Link className="dropdown-item" to="/products/desktops">Desktops</Link></li>
//                 <li><Link className="dropdown-item" to="/products/accessories">Accessories</Link></li>
//                 <li><Link className="dropdown-item" to="/products/software">Software</Link></li>
//               </ul>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/news">News</Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link" to="/contact">Contact</Link>
//             </li>

//             {/* Cart Icon with Badge */}
//             <li className="nav-item position-relative">
//               <Link className="nav-link" to="/cart" style={{ fontSize: '1.3rem', position: 'relative' }}>
//                 <FaShoppingCart />
//                 {cartItemCount > 0 && (
//                   <span
//                     style={{
//                       position: 'absolute',
//                       top: '0',
//                       right: '0',
//                       backgroundColor: 'red',
//                       color: 'white',
//                       borderRadius: '50%',
//                       padding: '2px 6px',
//                       fontSize: '0.75rem',
//                       lineHeight: '1',
//                       transform: 'translate(50%, -50%)',
//                     }}
//                   >
//                     {cartItemCount}
//                   </span>
//                 )}
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




// //USER DASHBOARD
// import React, { useContext, useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart } from 'react-icons/fa';
// import { CartContext } from '../context/CartContext';
// import { jwtDecode } from 'jwt-decode';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   const { cart, isAuthenticated } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [userType, setUserType] = useState(null);

//   // Calculate cart item count
//   const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

//   // Update userType based on authentication status
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (isAuthenticated() && token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUserType(decoded.user_type || 'user');
//       } catch (error) {
//         console.error('Error decoding JWT:', error);
//         setUserType(null);
//         sessionStorage.removeItem('token'); // Clear invalid token
//       }
//     } else {
//       setUserType(null);
//     }
//   }, [isAuthenticated]);

//   // Handle logout
//   const handleLogout = () => {
//     sessionStorage.removeItem('token');
//     setUserType(null);
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-custom">
//       <div className="container-fluid">
//         <Link className="navbar-brand d-flex align-items-center" to="/">
//           <img src="/unihublogo.png" alt="Logo" className="logo" />
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto d-flex align-items-center">
//             <li className="nav-item">
//               <Link className="nav-link" to="/">Home</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/about">About</Link>
//             </li>
//             <li className="nav-item dropdown">
//               <a
//                 className="nav-link dropdown-toggle"
//                 href="#"
//                 id="servicesDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Services
//               </a>
//               <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
//                 <li><Link className="dropdown-item" to="/services/web-software-development">Web & Software Development</Link></li>
//                 <li><Link className="dropdown-item" to="/services/managed-it">Managed IT Services</Link></li>
//                 <li><Link className="dropdown-item" to="/services/cybersecurity-cloud">Cybersecurity & Cloud Migration</Link></li>
//                 <li><Link className="dropdown-item" to="/services/hardware-infrastructure">Hardware & Infrastructure</Link></li>
//                 <li><Link className="dropdown-item" to="/services/specialized-it">Specialized IT</Link></li>
//               </ul>
//             </li>
//             <li className="nav-item dropdown">
//               <Link
//                 className="nav-link dropdown-toggle"
//                 to="/products"
//                 id="productsDropdown"
//                 role="button"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 Products
//               </Link>
//               <ul className="dropdown-menu" aria-labelledby="productsDropdown">
//                 <li><Link className="dropdown-item" to="/products/laptops">Laptops</Link></li>
//                 <li><Link className="dropdown-item" to="/products/desktops">Desktops</Link></li>
//                 <li><Link className="dropdown-item" to="/products/accessories">Accessories</Link></li>
//                 <li><Link className="dropdown-item" to="/products/software">Software</Link></li>
//               </ul>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/news">News</Link>
//             </li>
//             <li className="nav-item">
//               <Link className="nav-link" to="/contact">Contact</Link>
//             </li>
//             <li className="nav-item position-relative">
//               <Link className="nav-link" to="/cart" style={{ fontSize: '1.3rem', position: 'relative' }}>
//                 <FaShoppingCart />
//                 {cartItemCount > 0 && (
//                   <span
//                     style={{
//                       position: 'absolute',
//                       top: '0',
//                       right: '0',
//                       backgroundColor: 'red',
//                       color: 'white',
//                       borderRadius: '50%',
//                       padding: '2px 6px',
//                       fontSize: '0.75rem',
//                       lineHeight: '1',
//                       transform: 'translate(50%, -50%)',
//                     }}
//                   >
//                     {cartItemCount}
//                   </span>
//                 )}
//               </Link>
//             </li>
//             {isAuthenticated() ? (
//               <li className="nav-item dropdown">
//                 <a
//                   className="nav-link dropdown-toggle"
//                   href="#"
//                   id="userDropdown"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   <i className="bi bi-person-circle me-1"></i>
//                   My Account
//                 </a>
//                 <ul className="dropdown-menu" aria-labelledby="userDropdown">
//                   {userType === 'user' && (
//                     <li>
//                       <Link className="dropdown-item" to="/dashboard">
//                         <i className="bi bi-speedometer2 me-2"></i>
//                         Dashboard
//                       </Link>
//                     </li>
//                   )}
//                   {(userType === 'admin' || userType === 'super_admin') && (
//                     <li>
//                       <Link className="dropdown-item" to="/admin">
//                         <i className="bi bi-gear me-2"></i>
//                         Admin Dashboard
//                       </Link>
//                     </li>
//                   )}
//                   <li>
//                     <button className="dropdown-item" onClick={handleLogout}>
//                       <i className="bi bi-box-arrow-right me-2"></i>
//                       Log Out
//                     </button>
//                   </li>
//                 </ul>
//               </li>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">
//                     <i className="bi bi-box-arrow-in-right me-1"></i>
//                     Log In
//                   </Link>
//                 </li>
//                 {/* <li className="nav-item">
//                   <Link className="nav-link" to="/register">
//                     <i className="bi bi-person-plus me-1"></i>
//                     Sign Up
//                   </Link>
//                 </li> */}
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { jwtDecode } from 'jwt-decode';
import '../styles/Navbar.css';

const Navbar = () => {
  const { cart, isAuthenticated } = useContext(CartContext);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Calculate cart item count
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Update userType based on authentication status
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (isAuthenticated() && token) {
      try {
        const decoded = jwtDecode(token);
        setUserType(decoded.user_type || 'user');
      } catch (error) {
        console.error('Error decoding JWT:', error);
        setUserType(null);
        sessionStorage.removeItem('token'); // Clear invalid token
      }
    } else {
      setUserType(null);
    }
  }, [isAuthenticated]);

  // Toggle navbar
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  // Close navbar when link is clicked (mobile only)
  const handleNavLinkClick = () => {
    if (isMobile && isNavbarOpen) {
      setIsNavbarOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setUserType(null);
    navigate('/login');
    handleNavLinkClick(); // Close navbar after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/unihublogo.png" alt="Logo" className="logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isNavbarOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavLinkClick}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about" onClick={handleNavLinkClick}>About</Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="servicesDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Services
              </a>
              <ul className="dropdown-menu" aria-labelledby="servicesDropdown">
                <li><Link className="dropdown-item" to="/services/web-software-development" onClick={handleNavLinkClick}>Web & Software Development</Link></li>
                <li><Link className="dropdown-item" to="/services/managed-it" onClick={handleNavLinkClick}>Managed IT Services</Link></li>
                <li><Link className="dropdown-item" to="/services/cybersecurity-cloud" onClick={handleNavLinkClick}>Cybersecurity & Cloud Migration</Link></li>
                <li><Link className="dropdown-item" to="/services/hardware-infrastructure" onClick={handleNavLinkClick}>Hardware & Infrastructure</Link></li>
                <li><Link className="dropdown-item" to="/services/specialized-it" onClick={handleNavLinkClick}>Specialized IT</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                to="/products"
                id="productsDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Products
              </Link>
              <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                <li><Link className="dropdown-item" to="/products/laptops" onClick={handleNavLinkClick}>Laptops</Link></li>
                <li><Link className="dropdown-item" to="/products/desktops" onClick={handleNavLinkClick}>Desktops</Link></li>
                <li><Link className="dropdown-item" to="/products/accessories" onClick={handleNavLinkClick}>Accessories</Link></li>
                <li><Link className="dropdown-item" to="/products/software" onClick={handleNavLinkClick}>Software</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/news" onClick={handleNavLinkClick}>News</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={handleNavLinkClick}>Contact</Link>
            </li>
            <li className="nav-item position-relative">
              <Link 
                className="nav-link" 
                to="/cart" 
                style={{ fontSize: '1.3rem', position: 'relative' }}
                onClick={handleNavLinkClick}
              >
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      backgroundColor: 'red',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '2px 6px',
                      fontSize: '0.75rem',
                      lineHeight: '1',
                      transform: 'translate(50%, -50%)',
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            {isAuthenticated() ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  My Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="userDropdown">
                  {userType === 'user' && (
                    <li>
                      <Link className="dropdown-item" to="/dashboard" onClick={handleNavLinkClick}>
                        <i className="bi bi-speedometer2 me-2"></i>
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {(userType === 'admin' || userType === 'super_admin') && (
                    <li>
                      <Link className="dropdown-item" to="/admin" onClick={handleNavLinkClick}>
                        <i className="bi bi-gear me-2"></i>
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Log Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Log In
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={handleNavLinkClick}>
                    <i className="bi bi-person-plus me-1"></i>
                    Sign Up
                  </Link>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;