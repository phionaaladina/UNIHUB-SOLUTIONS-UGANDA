// // import React from 'react';
// // import '../styles/ContactSection.css'; // Import the CSS file

// // const ContactSection = () => {
// //   return (
// //     <div className="contact-section">
// //       <div className="contact-info-container">
// //         <h2>Contact Us</h2>
// //         <div className="contact-item">
// //           <span className="icon location-icon"></span>
// //           <p>
// //             Plot 90, Kanjokya Street, Kanjokya House, <br />
// //             Kampala, Uganda
// //           </p>
// //         </div>
// //         <div className="contact-item">
// //           <span className="icon email-icon"></span>
// //           <p>info@unihub.com</p>
// //         </div>
// //         <div className="contact-item">
// //           <span className="icon phone-icon"></span>
// //           <p>
// //             +256 784675790 <br />
// //             +256 704145972
// //           </p>
// //         </div>
// //       </div>

// //       <div className="contact-form-container">
// //         <h2>Send Us a Message</h2>
// //         <form>
// //           <div className="form-group">
// //             <input type="text" id="name" name="name" placeholder=" " required /> {/* Added space for placeholder hack */}
// //             <label htmlFor="name">Name</label>
// //           </div>
// //           <div className="form-group">
// //             <input type="email" id="email" name="email" placeholder=" " required />
// //             <label htmlFor="email">Email</label>
// //           </div>
// //           <div className="form-group">
// //             <textarea id="message" name="message" rows="7" placeholder=" " required></textarea>
// //             <label htmlFor="message">Message</label>
// //           </div>
// //           <button type="submit" className="send-message-btn">Send Message</button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ContactSection;



// import React, { useState } from 'react';
// import '../styles/ContactSection.css';

// const ContactSection = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });
//   const [status, setStatus] = useState(null); // success or error message

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response = await fetch('http://127.0.0.1:5000/api/v1/contact/contact_message', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData),
//     });

//     if (response.ok) {
//       console.log("Message sent successfully");
//       alert("Message sent successfully!");
//       setFormData({ name: "", email: "", message: "" });
//     } else {
//       console.error("Error sending message");
//       alert("An error occurred. Please try again.");
//     }
//   } catch (error) {
//     console.error("Fetch error:", error);
//     alert("An error occurred. Please try again.");
//   }
// };


//   return (
//     <div className="contact-section">
//       <div className="contact-info-container">
//         <h2>Contact Us</h2>
//         <div className="contact-item">
//           <span className="icon location-icon"></span>
//           <p>
//             Plot 90, Kanjokya Street, Kanjokya House, <br />
//             Kampala, Uganda
//           </p>
//         </div>
//         <div className="contact-item">
//           <span className="icon email-icon"></span>
//           <p>info@unihub.com</p>
//         </div>
//         <div className="contact-item">
//           <span className="icon phone-icon"></span>
//           <p>
//             +256 784675790 <br />
//             +256 704145972
//           </p>
//         </div>
//       </div>

//       <div className="contact-form-container">
//         <h2>Send Us a Message</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder=" "
//               required
//               value={formData.name}
//               onChange={handleChange}
//             />
//             <label htmlFor="name">Name</label>
//           </div>
//           <div className="form-group">
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder=" "
//               required
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <label htmlFor="email">Email</label>
//           </div>
//           <div className="form-group">
//             <textarea
//               id="message"
//               name="message"
//               rows="7"
//               placeholder=" "
//               required
//               value={formData.message}
//               onChange={handleChange}
//             ></textarea>
//             <label htmlFor="message">Message</label>
//           </div>
//           <button type="submit" className="send-message-btn">Send Message</button>
//           {status && <p className="status-message">{status}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContactSection;


// import React, { useState } from 'react';
// import '../styles/ContactSection.css';

// const ContactSection = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });
//   const [status, setStatus] = useState(null);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus(null);

//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/v1/contact/contact_message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         setFormData({ name: '', email: '', message: '' });
//         setStatus('Message sent successfully!');
//       } else {
//         setStatus('An error occurred. Please try again.');
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setStatus('An error occurred. Please try again.');
//     }
//   };

//   return (
//     <div className="contact-section">
//       <div className="contact-info-container">
//         <h2>Contact Us</h2>
//         <div className="contact-item">
//           <span className="icon location-icon"></span>
//           <p>
//             Plot 90, Kanjokya Street, Kanjokya House,<br />
//             Kampala, Uganda
//           </p>
//         </div>
//         <div className="contact-item">
//           <span className="icon email-icon"></span>
//           <p>info@unihub.com</p>
//         </div>
//         <div className="contact-item">
//           <span className="icon phone-icon"></span>
//           <p>
//             +256 784675790<br />
//             +256 704145972
//           </p>
//         </div>
//       </div>

//       <div className="contact-form-container">
//         <h2>Send Us a Message</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder=" "
//               required
//               value={formData.name}
//               onChange={handleChange}
//             />
//             <label htmlFor="name">Name</label>
//           </div>
//           <div className="form-group">
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder=" "
//               required
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <label htmlFor="email">Email</label>
//           </div>
//       <div className="form-group">
//   <textarea
//     id="message"
//     name="message"
//     rows="5"
//     required
//     value={formData.message}
//     onChange={handleChange}
//     className={`form-control ${formData.message ? 'filled' : ''}`}
//   ></textarea>
//   <label htmlFor="message">Message</label>
// </div>
//           <button type="submit" className="send-message-btn">Send Message</button>
//           {status && <p className="status-message">{status}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ContactSection;




// import React, { useState } from 'react';
// // No need for '../styles/ContactSection.css' if using inline styles or global Bootstrap.
// // If you have specific overrides, you can keep it, but I've integrated most styling here.

// const App = () => { // Renamed to App for standalone preview
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '', // Added phone field
//     message: ''
//   });
//   const [status, setStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus(null);
//     setLoading(true);

//     // Client-side validation: ensure either email or phone is provided
//     if (!formData.email && !formData.phone) {
//       setStatus({ type: 'error', message: 'Please provide either an email address or a phone number.' });
//       setLoading(false);
//       return;
//     }

//     try {
//       // Replace with your actual backend endpoint
//       const response = await fetch('http://127.0.0.1:5000/api/v1/contact/contact_message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         setFormData({ name: '', email: '', phone: '', message: '' }); // Clear phone field too
//         setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you shortly.' });
//       } else {
//         const errorData = await response.json();
//         setStatus({ type: 'error', message: errorData.message || 'An error occurred. Please try again.' });
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus({ type: 'error', message: 'Network error: Could not connect to the server. Please check your internet connection.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Include Bootstrap CSS and Icons CDN for full functionality and styling
//     <>
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

//       <section className="py-5 bg-light" id="contact">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
//                 <div className="card-body p-4 p-md-5">
//                   <div className="row g-5">
//                     {/* Contact Information Column */}
//                     <div className="col-lg-5 d-flex flex-column justify-content-between bg-primary text-white p-4 p-md-5 rounded-start-4">
//                       <div>
//                         <h2 className="fw-bold mb-4 text-white">Get in Touch</h2>
//                         <p className="lead mb-4 opacity-75">We'd love to hear from you! Send us a message or find us using the details below.</p>

//                         <div className="d-flex align-items-start mb-4">
//                           <i className="bi bi-geo-alt-fill fs-4 me-3"></i>
//                           <div>
//                             <h5 className="mb-1 text-white">Our Location</h5>
//                             <p className="mb-0 opacity-75">Plot 90, Kanjokya Street, Kanjokya House, Kampala, Uganda</p>
//                           </div>
//                         </div>

//                         <div className="d-flex align-items-start mb-4">
//                           <i className="bi bi-envelope-fill fs-4 me-3"></i>
//                           <div>
//                             <h5 className="mb-1 text-white">Email Us</h5>
//                             <p className="mb-0 opacity-75">info@unihub.com</p>
//                           </div>
//                         </div>

//                         <div className="d-flex align-items-start mb-4">
//                           <i className="bi bi-telephone-fill fs-4 me-3"></i>
//                           <div>
//                             <h5 className="mb-1 text-white">Call Us</h5>
//                             <p className="mb-0 opacity-75">+256 784675790</p>
//                             <p className="mb-0 opacity-75">+256 704145972</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Contact Form Column */}
//                     <div className="col-lg-7 p-4 p-md-5">
//                       <h2 className="fw-bold mb-4 text-primary">Send Us a Message</h2>
//                       <form onSubmit={handleSubmit}>
//                         {/* Name Input */}
//                         <div className="form-floating mb-3">
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="name"
//                             name="name"
//                             placeholder="Your Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                           />
//                           <label htmlFor="name">Your Name</label>
//                         </div>

//                         {/* Email Input */}
//                         <div className="form-floating mb-3">
//                           <input
//                             type="email"
//                             className="form-control"
//                             id="email"
//                             name="email"
//                             placeholder="name@example.com"
//                             value={formData.email}
//                             onChange={handleChange}
//                             // Not individually required, but at least one of email/phone is needed
//                           />
//                           <label htmlFor="email">Email address (Optional)</label>
//                         </div>

//                         {/* Phone Input */}
//                         <div className="form-floating mb-3">
//                           <input
//                             type="tel" // Use type="tel" for phone numbers
//                             className="form-control"
//                             id="phone"
//                             name="phone"
//                             placeholder="+256 7XXXXXXXX"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             // Not individually required, but at least one of email/phone is needed
//                           />
//                           <label htmlFor="phone">Phone Number (Optional)</label>
//                         </div>

//                         {/* Message Textarea */}
//                         <div className="form-floating mb-4">
//                           <textarea
//                             className="form-control"
//                             id="message"
//                             name="message"
//                             placeholder="Your Message"
//                             style={{ height: '120px' }}
//                             value={formData.message}
//                             onChange={handleChange}
//                             required
//                           ></textarea>
//                           <label htmlFor="message">Your Message</label>
//                         </div>

//                         {/* Status Message */}
//                         {status && (
//                           <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3 mb-4 text-center`} role="alert">
//                             {status.message}
//                           </div>
//                         )}

//                         {/* Submit Button */}
//                         <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
//                           {loading ? (
//                             <>
//                               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                               Sending Message...
//                             </>
//                           ) : (
//                             'Send Message'
//                           )}
//                         </button>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Floating WhatsApp Button */}
//       <a
//         href="https://wa.me/256784675790" // Replace with your WhatsApp number
//         className="position-fixed bottom-0 end-0 me-4 mb-4 btn btn-success rounded-circle shadow-lg"
//         style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', zIndex: 1000 }}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Contact us on WhatsApp"
//       >
//         <i className="bi bi-whatsapp text-white"></i>
//       </a>
//     </>
//   );
// };

// export default App;










// import React, { useState } from 'react';
// // No need for '../styles/ContactSection.css' if using inline styles or global Bootstrap.
// // If you have specific overrides, you can keep it, but I've integrated most styling here.

// const App = () => { // Renamed to App for standalone preview
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });
//   const [status, setStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   /**
//    * Basic email format validation regex.
//    * This regex checks for a common email pattern but is not exhaustive.
//    */
//   const isValidEmail = (email) => {
//     // A more robust regex for email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus(null);
//     setLoading(true);

//     // Client-side email format validation
//     if (!isValidEmail(formData.email)) {
//       setStatus({ type: 'error', message: 'Please enter a valid email address (e.g., example@domain.com).' });
//       setLoading(false);
//       return;
//     }

//     try {
//       // Replace with your actual backend endpoint
//       const response = await fetch('http://127.0.0.1:5000/api/v1/contact/contact_message', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         setFormData({ name: '', email: '', message: '' });
//         setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you shortly.' });
//       } else {
//         const errorData = await response.json();
//         setStatus({ type: 'error', message: errorData.message || 'An error occurred. Please try again.' });
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//       setStatus({ type: 'error', message: 'Network error: Could not connect to the server. Please check your internet connection.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     // Include Bootstrap CSS and Icons CDN for full functionality and styling
//     <>
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
//       <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

//       <section className="py-5 bg-light" id="contact">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
//                 <div className="card-body p-4 p-md-5">
//                   <div className="row g-5">
//                     {/* Contact Information Column */}
//                     <div className="col-lg-5 d-flex flex-column justify-content-between bg-primary text-white p-4 p-md-5 rounded-start-4">
//                       <div>
//                         <h2 className="fw-bold mb-4 text-white">Get in Touch</h2>
//                         <p className="lead mb-4 opacity-75">We'd love to hear from you! Send us a message or find us using the details below.</p>

//                         <div className="d-flex align-items-start mb-4">
//                           <i className="bi bi-geo-alt-fill fs-4 me-3"></i>
//                           <div>
//                             <h5 className="mb-1 text-white">Our Location</h5>
//                             <p className="mb-0 opacity-75">Plot 90, Kanjokya Street, Kanjokya House, Kampala, Uganda</p>
//                           </div>
//                         </div>

//                         <div className="d-flex align-items-start mb-4">
//                           <i className="bi bi-envelope-fill fs-4 me-3"></i>
//                           <div>
//                             <h5 className="mb-1 text-white">Email Us</h5>
//                             <p className="mb-0 opacity-75">info@unihub.com</p>
//                           </div>
//                         </div>

//                         <div className="d-flex align-items-start mb-4">
//                           <i className="bi bi-telephone-fill fs-4 me-3"></i>
//                           <div>
//                             <h5 className="mb-1 text-white">Call Us</h5>
//                             <p className="mb-0 opacity-75">+256 784675790</p>
//                             <p className="mb-0 opacity-75">+256 704145972</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Contact Form Column */}
//                     <div className="col-lg-7 p-4 p-md-5">
//                       <h2 className="fw-bold mb-4 text-primary">Send Us a Message</h2>
//                       <form onSubmit={handleSubmit}>
//                         {/* Name Input */}
//                         <div className="form-floating mb-3">
//                           <input
//                             type="text"
//                             className="form-control"
//                             id="name"
//                             name="name"
//                             placeholder="Your Name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             required
//                           />
//                           <label htmlFor="name">Your Name <span className="text-danger">*</span></label>
//                         </div>

//                         {/* Email Input */}
//                         <div className="form-floating mb-3">
//                           <input
//                             type="email"
//                             className="form-control"
//                             id="email"
//                             name="email"
//                             placeholder="name@example.com"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                           />
//                           <label htmlFor="email">Email address <span className="text-danger">*</span></label>
//                         </div>

//                         {/* Message Textarea */}
//                         <div className="form-floating mb-4">
//                           <textarea
//                             className="form-control"
//                             id="message"
//                             name="message"
//                             placeholder="Your Message"
//                             style={{ height: '120px' }}
//                             value={formData.message}
//                             onChange={handleChange}
//                             required
//                           ></textarea>
//                           <label htmlFor="message">Your Message <span className="text-danger">*</span></label>
//                         </div>

//                         {/* Status Message */}
//                         {status && (
//                           <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3 mb-4 text-center`} role="alert">
//                             {status.message}
//                           </div>
//                         )}

//                         {/* Submit Button */}
//                         <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
//                           {loading ? (
//                             <>
//                               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                               Sending Message...
//                             </>
//                           ) : (
//                             'Send Message'
//                           )}
//                         </button>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Floating WhatsApp Button */}
//       {/* <a
//         href="https://wa.me/256784675790" // Replace with your WhatsApp number
//         className="position-fixed bottom-0 end-0 me-4 mb-4 btn btn-success rounded-circle shadow-lg"
//         style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', zIndex: 1000 }}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Contact us on WhatsApp"
//       >
//         <i className="bi bi-whatsapp text-white"></i>
//       </a> */}
//     </>
//   );
// };

// export default App;



import React, { useState } from 'react';
import API_BASE_URL from "../config";
import '../styles/ContactSection.css'; // Import your custom CSS file

const App = () => { // Renamed to App for standalone preview
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /**
   * Basic email format validation regex.
   * This regex checks for a common email pattern but is not exhaustive.
   */
  const isValidEmail = (email) => {
    // A more robust regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    // Client-side email format validation
    if (!isValidEmail(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address (e.g., example@domain.com).' });
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual backend endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/contact/contact_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you shortly.' });
      } else {
        const errorData = await response.json();
        setStatus({ type: 'error', message: errorData.message || 'An error occurred. Please try again.' });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus({ type: 'error', message: 'Network error: Could not connect to the server. Please check your internet connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Include Bootstrap CSS and Icons CDN for full functionality and styling
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      <section className="py-5 bg-light" id="contact">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <div className="row g-5">
                    {/* Contact Information Column */}
                    <div className="col-lg-5 d-flex flex-column justify-content-between bg-custom-primary text-white p-4 p-md-5 rounded-start-4">
                      <div>
                        <h2 className="fw-bold mb-4 text-white">Get in Touch</h2>
                        <p className="lead mb-4 opacity-75">We'd love to hear from you! Send us a message or find us using the details below.</p>

                        <div className="d-flex align-items-start mb-4">
                          <i className="bi bi-geo-alt-fill fs-4 me-3"></i>
                          <div>
                            <h5 className="mb-1 text-white">Our Location</h5>
                            <p className="mb-0 opacity-75">Plot 90, Kanjokya Street, Kanjokya House, Kampala, Uganda</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-start mb-4">
                          <i className="bi bi-envelope-fill fs-4 me-3"></i>
                          <div>
                            <h5 className="mb-1 text-white">Email Us</h5>
                            <p className="mb-0 opacity-75">info@unihub.com</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-start mb-4">
                          <i className="bi bi-telephone-fill fs-4 me-3"></i>
                          <div>
                            <h5 className="mb-1 text-white">Call Us</h5>
                            <p className="mb-0 opacity-75">+256 784675790</p>
                            <p className="mb-0 opacity-75">+256 704145972</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Form Column */}
                    <div className="col-lg-7 p-4 p-md-5">
                      <h2 className="fw-bold mb-4 text-custom-primary">Send Us a Message</h2>
                      <form onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="form-floating mb-3">
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="name">Your Name <span className="text-danger">*</span></label>
                        </div>

                        {/* Email Input */}
                        <div className="form-floating mb-3">
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="email">Email address <span className="text-danger">*</span></label>
                        </div>

                        {/* Message Textarea */}
                        <div className="form-floating mb-4">
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            placeholder="Your Message"
                            style={{ height: '120px' }}
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                          <label htmlFor="message">Your Message <span className="text-danger">*</span></label>
                        </div>

                        {/* Status Message */}
                        {status && (
                          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mt-3 mb-4 text-center`} role="alert">
                            {status.message}
                          </div>
                        )}

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-custom-primary btn-lg w-100" disabled={loading}>
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending Message...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/256784675790" // Replace with your WhatsApp number
        className="position-fixed bottom-0 end-0 me-4 mb-4 btn btn-success rounded-circle shadow-lg"
        style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', zIndex: 1000 }}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
      >
        <i className="bi bi-whatsapp text-white"></i>
      </a>
    </>
  );
};

export default App;
