

// // export default LoginForm;
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const LoginForm = ({ onLoginSuccess }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   /**
//    * Handles the form submission for login.
//    * This function makes an API call to the specified backend endpoint.
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
      
//       const data = await response.json();
      
//       if (response.ok) {
//         if (data.token) {
//           sessionStorage.setItem('token', data.token);
//           if (onLoginSuccess) {
//             onLoginSuccess(data.token);
//           }
//           // The App component now handles the redirect based on user role.
//           // navigate('/products'); 
//         } else {
//           setError(data.message || 'Login successful but no token received.');
//         }
//       } else {
//         // Handle login failure with the message from the backend
//         setError(data.message || 'Login failed. Please check your credentials.');
//       }
      
//     } catch (err) {
//       // Handle network errors (e.g., server not running)
//       console.error("Network error during login:", err);
//       setError('Network error: Could not connect to the server. Please try again.');
//     } finally {
//       // Always set loading to false after the API call finishes
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="d-flex align-items-center justify-content-center background-layer"
//     >
//       {/* Styles are now inline to prevent module not found errors */}
//       <style>
//         {`
//           :root {
//             --primary-color: #0047ab;
//             --secondary-color: #fc7f10;
//             --tertiary-color: #edecea;
//             --grey-color: #6c757d;
//           }

//           .background-layer {
//             min-height: 100vh;
//             /* Using linear-gradient to create a semi-transparent overlay on top of the image */
//             background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://png.pngtree.com/background/20210717/original/pngtree-blue-hexagonal-gradient-overlay-background-picture-image_1438074.jpg');
//             background-size: cover;
//             background-position: center;
//             font-family: 'Inter', sans-serif;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             /* This blur is now on the body, not the form, blurring the background itself */
//             backdrop-filter: blur(3px); 
//           }

//           .form-layer {
//             max-width: 500px;
//             width: 100%;
//             /* Form background is now a solid white */
//             background-color: #fff;
//           }

//           .btn-custom-primary {
//             background-color: var(--primary-color);
//             border-color: var(--primary-color);
//             color: #fff;
//             transition: all 0.3s ease;
//           }

//           .btn-custom-primary:hover {
//             background-color: #003680;
//             border-color: #003680;
//             transform: translateY(-2px);
//             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//           }

//           .text-custom-primary {
//             color: var(--primary-color) !important;
//           }

//           .text-custom-secondary {
//             color: var(--secondary-color) !important;
//           }

//           /* Custom styling for the icon background */
//           .input-group-text.custom-icon-bg {
//             background-color: var(--tertiary-color);
//             border: 1px solid #ced4da;
//             border-right: none;
//             border-top-left-radius: 0.25rem;
//             border-bottom-left-radius: 0.25rem;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             width: 2.5rem;
//           }

//           /* Ensure the input field has a matching border */
//           .input-group .form-control {
//             border-left: none;
//             border-top-left-radius: 0;
//             border-bottom-left-radius: 0;
//           }
//         `}
//       </style>
//       <div className="card shadow-lg p-4 p-md-5 rounded-4 form-layer">
//         <div className="text-center mb-3">
//           <img src="./unihublogo.png" alt="UNIHUB Solutions Uganda Logo" style={{ width: '150px', height: 'auto' }} />
//         </div>
        
//         <div className="text-center mb-3">
//           {/* <h2 className="h4 fw-bold text-dark">Welcome back</h2> */}
//           <p className="text-muted mb-2">Welcome, Log in to your respective account.</p>
//         </div>
//         <hr className="mb-4" /> {/* Separator line below the login message */}

//         <form onSubmit={handleSubmit} className="mb-3">
//           <div className="mb-3">
//             <label htmlFor="email" className="form-label text-muted">Email Address</label>
//             <div className="input-group">
//               <span className="input-group-text custom-icon-bg">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope text-custom-primary" viewBox="0 0 16 16">
//                   <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.417L1.034 12.259A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.825L1 5.383v5.722Z"/>
//                 </svg>
//               </span>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="password" className="form-label text-muted">Password</label>
//             <div className="input-group">
//               <span className="input-group-text custom-icon-bg">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock text-custom-primary" viewBox="0 0 16 16">
//                   <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 1 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM6 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9z"/>
//                 </svg>
//               </span>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
          
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div className="form-check">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 value=""
//                 id="flexCheckDefault"
//               />
//               <label className="form-check-label text-muted" htmlFor="flexCheckDefault">
//                 Remember Me
//               </label>
//             </div>
//             <a href="#" className="text-decoration-none text-custom-primary fw-bold small">
//               Forgot password?
//             </a>
//           </div>

//           {error && (
//             <div className="alert alert-danger mt-3" role="alert">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             className="btn btn-custom-primary w-100 py-2 fw-bold"
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Logging in...
//               </>
//             ) : (
//               'SIGN IN'
//             )}
//           </button>
//         </form>

//         <div className="text-center">
//           <p className="text-muted mb-0 d-inline me-1">Don't have an account?</p>
//           <Link to="/signup" className="text-decoration-none text-custom-primary fw-bold d-inline">
//             Sign up
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;


//right up




// pages/LoginForm.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginForm = ({ onLoginSuccess }) => {
  // State variables for form inputs and UI feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Hook for navigation
  const navigate = useNavigate();

  /**
   * Handles the form submission for login.
   * This function makes an API call to the specified backend endpoint.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.token) {
          sessionStorage.setItem('token', data.token);
          if (onLoginSuccess) {
            onLoginSuccess(data.token);
          }

          // Check if there is a pending redirect path from a previous page (like Cart)
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          // Remove the item from storage to prevent infinite redirects
          sessionStorage.removeItem('redirectAfterLogin'); 
          
          if (redirectPath) {
            // Redirect the user back to the page they were on before logging in
            navigate(redirectPath);
          } else {
            // Default redirect path if no specific redirect was requested
            navigate('/products'); 
          }
        } else {
          setError(data.message || 'Login successful but no token received.');
        }
      } else {
        // Handle login failure with the message from the backend
        setError(data.message || 'Login failed. Please check your credentials.');
      }
      
    } catch (err) {
      // Handle network errors (e.g., server not running)
      console.error("Network error during login:", err);
      setError('Network error: Could not connect to the server. Please try again.');
    } finally {
      // Always set loading to false after the API call finishes
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center background-layer">
      {/* Styles are now inline to prevent module not found errors */}
      <style>
        {`
          :root {
            --primary-color: #0047ab;
            --secondary-color: #fc7f10;
            --tertiary-color: #edecea;
            --grey-color: #6c757d;
          }

          .background-layer {
            min-height: 100vh;
            background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://png.pngtree.com/background/20210717/original/pngtree-blue-hexagonal-gradient-overlay-background-picture-image_1438074.jpg');
            background-size: cover;
            background-position: center;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(3px); 
          }

          .form-layer {
            max-width: 500px;
            width: 100%;
            background-color: #fff;
          }

          .btn-custom-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: #fff;
            transition: all 0.3s ease;
          }

          .btn-custom-primary:hover {
            background-color: #003680;
            border-color: #003680;
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .text-custom-primary {
            color: var(--primary-color) !important;
          }

          .text-custom-secondary {
            color: var(--secondary-color) !important;
          }

          /* Custom styling for the icon background */
          .input-group-text.custom-icon-bg {
            background-color: var(--tertiary-color);
            border: 1px solid #ced4da;
            border-right: none;
            border-top-left-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
          }

          /* Ensure the input field has a matching border */
          .input-group .form-control {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        `}
      </style>
      <div className="card shadow-lg p-4 p-md-5 rounded-4 form-layer">
        <div className="text-center mb-3">
          <img src="./unihublogo.png" alt="UNIHUB Solutions Uganda Logo" style={{ width: '150px', height: 'auto' }} />
        </div>
        
        <div className="text-center mb-4">
          <h2 className="h4 fw-bold text-dark">Welcome back</h2>
          <p className="text-muted">
            Please login to your account to continue.
          </p>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label text-muted">
              Email address
            </label>
            <div className="input-group">
              <span className="input-group-text custom-icon-bg">
                <i className="bi bi-person-fill text-custom-primary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label text-muted">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text custom-icon-bg">
                <i className="bi bi-lock-fill text-custom-primary"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="mb-4 text-end">
            <Link to="/forgot-password" className="text-decoration-none text-custom-primary">
              Forgot Password?
            </Link>
          </div>
          
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-custom-primary btn-lg fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-decoration-none text-custom-primary fw-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;