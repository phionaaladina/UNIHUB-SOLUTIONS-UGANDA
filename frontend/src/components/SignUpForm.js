// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/SignUpForm.css';

// const SignUpForm = () => {
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     contact: '',
//     email: '',
//     password: ''
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const res = await fetch('http://127.0.0.1:5000/v1/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         navigate('/'); // Redirect to login page after signup
//       } else {
//         setError(data.message || 'Signup failed');
//       }
//     } catch (err) {
//       setError('Network error');
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="signup-form-container container mt-5">
//       <form onSubmit={handleSubmit} className="signup-form shadow p-4 rounded bg-white">
//         <h2 className="mb-4 text-center text-success">Create an Account</h2>

//         <div className="row">
//           <div className="col-md-6 mb-3">
//             <label>First Name</label>
//             <input
//               type="text"
//               name="first_name"
//               className="form-control"
//               value={formData.first_name}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="col-md-6 mb-3">
//             <label>Last Name</label>
//             <input
//               type="text"
//               name="last_name"
//               className="form-control"
//               value={formData.last_name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-group mb-3">
//           <label>Contact</label>
//           <input
//             type="text"
//             name="contact"
//             className="form-control"
//             value={formData.contact}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group mb-3">
//           <label>Email address</label>
//           <input
//             type="email"
//             name="email"
//             className="form-control"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-group mb-4">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             className="form-control"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <button type="submit" className="btn btn-success w-100" disabled={loading}>
//           {loading ? 'Creating account...' : 'Sign Up'}
//         </button>

//         {error && <div className="alert alert-danger mt-3">{error}</div>}
// <div className="text-center mt-3">
//   Already have an account?{' '}
//   <Link to="/login" className="text-decoration-none text-success">
//     Login
//   </Link>
// </div>
//       </form>
//     </div>
//   );
// };

// export default SignUpForm;



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignUpForm.css';

const SignUpForm = () => {
    // State variables for form inputs and UI feedback
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        contact: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Handles changes to the form input fields.
     */
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    /**
     * Handles the form submission for user registration.
     * This function makes an API call to the backend.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // CORRECTED: The URL now includes '/api/' to match the backend blueprint.
            const res = await fetch('http://127.0.0.1:5000/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to the login page on successful registration
                navigate('/login'); 
            } else {
                // Display the error message from the backend
                setError(data.error || data.message || 'Signup failed');
            }
        } catch (err) {
            console.error("Network or fetch error:", err);
            setError('Network error: Could not connect to the server. Please try again.');
        } finally {
            // Always set loading to false after the API call finishes
            setLoading(false);
        }
    };

    return (
        <div className="signup-form-container container mt-5">
            <form onSubmit={handleSubmit} className="signup-form shadow p-4 rounded bg-white">
                <h2 className="mb-4 text-center text-success">Create an Account</h2>

                {/* Conditional rendering for error message */}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            className="form-control"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            className="form-control"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Contact</label>
                    <input
                        type="text"
                        name="contact"
                        className="form-control"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label">Email address</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group mb-4">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating account...
                        </>
                    ) : (
                        'Sign Up'
                    )}
                </button>

                <div className="text-center mt-3">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none text-success">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
