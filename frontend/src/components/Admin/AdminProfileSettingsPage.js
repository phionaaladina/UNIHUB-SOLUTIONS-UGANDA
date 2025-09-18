

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useOutletContext } from 'react-router-dom'; // Import useOutletContext

// const AdminProfileSettingsPage = () => {
//     // Access context from the Outlet provided by AdminDashboardLayout
//     // These values will be the current state from the layout
//     const { onProfileUpdate, userName, userRole, userProfilePic } = useOutletContext();

//     // State for Profile Picture Update
//     const [profilePicFile, setProfilePicFile] = useState(null);
//     const [profilePicPreview, setProfilePicPreview] = useState(null);
//     const [isUploadingPic, setIsUploadingPic] = useState(false);
//     // currentProfilePicUrl now gets its initial value from context/layout
//     const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState(userProfilePic || '/images/profile-placeholder.jpg');

//     // State for Password Change
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmNewPassword, setConfirmNewPassword] = useState('');
//     const [isChangingPassword, setIsChangingPassword] = useState(false);

//     // State for General Profile Info
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [contact, setContact] = useState('');
//     const [email, setEmail] = useState('');
//     const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

//     // API Base URL - This needs to match your backend setup!
//     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
//     const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

//     // Update currentProfilePicUrl if userProfilePic from context changes (e.g., after initial load or another update)
//     useEffect(() => {
//         if (userProfilePic) {
//             setCurrentProfilePicUrl(userProfilePic);
//         }
//     }, [userProfilePic]); // Dependency on userProfilePic from context

//     // Fetch user profile data on component mount for other details (name, email, etc.)
//     useEffect(() => {
//         const fetchUserProfileDetails = async () => {
//             try {
//                 const token = sessionStorage.getItem('token');
//                 if (!token) {
//                     toast.error("Not authenticated. Please log in.");
//                     return;
//                 }
//                 const response = await axios.get(`${AUTH_API_URL}/profile`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });
//                 const userData = response.data;
//                 setFirstName(userData.first_name);
//                 setLastName(userData.last_name);
//                 setContact(userData.contact);
//                 setEmail(userData.email);
//             } catch (error) {
//                 console.error('Error fetching user profile details:', error.response?.data || error.message);
//                 toast.error(error.response?.data?.message || 'Failed to fetch user profile details.');
//             }
//         };

//         fetchUserProfileDetails();
//     }, [AUTH_API_URL]); // Dependency on AUTH_API_URL

//     // --- Profile Picture Handlers ---
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setProfilePicFile(file);
//             setProfilePicPreview(URL.createObjectURL(file)); // Create a local URL for preview
//         } else {
//             setProfilePicFile(null);
//             setProfilePicPreview(null);
//         }
//     };

//     const handleProfilePicUpload = async (e) => {
//         e.preventDefault();
//         if (!profilePicFile) {
//             toast.warn('Please select an image to upload.');
//             return;
//         }

//         setIsUploadingPic(true);
//         const formData = new FormData();
//         formData.append('profile_picture', profilePicFile);

//         try {
//             const token = sessionStorage.getItem('token');
//             const response = await axios.post(`${AUTH_API_URL}/profile/picture`, formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data' // Important for file uploads
//                 }
//             });
//             toast.success(response.data.message || 'Profile picture updated successfully!');

//             const newRelativePicUrl = response.data.profile_pic_url; // This should be like '/uploads/some_image.jpg'

//             // Update local state in this component
//             setCurrentProfilePicUrl(API_BASE_URL + newRelativePicUrl);

//             // Notify the parent (AdminDashboardLayout) to update its state
//             if (onProfileUpdate) {
//                 onProfileUpdate(newRelativePicUrl); // Pass the relative URL
//             }

//             // Clear the file input and preview
//             setProfilePicFile(null);
//             setProfilePicPreview(null);
//             // Optionally, reset the file input element itself if needed (more advanced)
//         } catch (error) {
//             console.error('Error uploading profile picture:', error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to upload profile picture.');
//         } finally {
//             setIsUploadingPic(false);
//         }
//     };

//     // --- Other handlers (password change, profile update) would go here ---
//     const handleChangePassword = async (e) => {
//         e.preventDefault();
//         if (!currentPassword || !newPassword || !confirmNewPassword) {
//             toast.error("Please fill all password fields.");
//             return;
//         }
//         if (newPassword !== confirmNewPassword) {
//             toast.error("New password and confirm new password do not match.");
//             return;
//         }
//         if (newPassword.length < 8) { // Updated to 8 for consistency with backend register
//             toast.error("New password must be at least 8 characters long.");
//             return;
//         }

//         setIsChangingPassword(true);
//         try {
//             const token = sessionStorage.getItem('token');
//             const response = await axios.post(`${AUTH_API_URL}/profile/change_password`, { // Updated URL for change password
//                 current_password: currentPassword,
//                 new_password: newPassword
//             }, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             toast.success(response.data.message || "Password changed successfully!");
//             setCurrentPassword('');
//             setNewPassword('');
//             setConfirmNewPassword('');
//         } catch (error) {
//             console.error('Error changing password:', error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to change password.');
//         } finally {
//             setIsChangingPassword(false);
//         }
//     };

//     const handleUpdateProfile = async (e) => {
//         e.preventDefault();
//         setIsUpdatingProfile(true);
//         try {
//             const token = sessionStorage.getItem('token');
//             // *** THE KEY CHANGE IS HERE: /profile -> /profile/update ***
//             const response = await axios.put(`${AUTH_API_URL}/profile/update`, { // <--- FIXED THIS LINE
//                 first_name: firstName,
//                 last_name: lastName,
//                 contact: contact,
//                 email: email // Sending email as well, though your backend might not update it
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json' // Added Content-Type for clarity
//                 }
//             });
//             toast.success(response.data.message || "Profile updated successfully!");
//             // No need to manually update firstName, lastName, contact states here,
//             // as the useEffect that fetches profile details will re-run
//             // if you reload the page or if a mechanism triggers it.
//             // For immediate reflection, you could update states here:
//             // setFirstName(response.data.user.first_name);
//             // setLastName(response.data.user.last_name);
//             // setContact(response.data.user.contact);
//             // setEmail(response.data.user.email); // If backend returns updated email
//         } catch (error) {
//             console.error('Error updating profile:', error.response?.data || error.message);
//             toast.error(error.response?.data?.message || 'Failed to update profile.');
//         } finally {
//             setIsUpdatingProfile(false);
//         }
//     };


//     return (
//         <div className="container mt-4">
//             <h2 className="mb-4">Profile Settings</h2>

//             {/* General Profile Information Section */}
//             <div className="card mb-4">
//                 <div className="card-header">
//                     <h4>General Information</h4>
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleUpdateProfile}>
//                         <div className="mb-3">
//                             <label htmlFor="firstName" className="form-label">First Name</label>
//                             <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="lastName" className="form-label">Last Name</label>
//                             <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="email" className="form-label">Email</label>
//                             {/* Email is typically not directly editable for security, or requires re-verification */}
//                             <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="contact" className="form-label">Contact</label>
//                             <input type="text" className="form-control" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
//                         </div>
//                         <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
//                             {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {/* Profile Picture Update Section */}
//             <div className="card mb-4">
//                 <div className="card-header">
//                     <h4>Update Profile Picture</h4>
//                 </div>
//                 <div className="card-body">
//                     {/* Display current profile picture */}
//                     {currentProfilePicUrl && (
//                         <div className="mb-3 text-center">
//                             <label className="form-label d-block">Current Profile Picture:</label>
//                             <img
//                                 src={currentProfilePicUrl}
//                                 alt="Current Profile"
//                                 className="img-thumbnail"
//                                 style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover' }}
//                             />
//                         </div>
//                     )}
//                     <form onSubmit={handleProfilePicUpload}>
//                         <div className="mb-3">
//                             <label htmlFor="profilePic" className="form-label">Choose new profile picture:</label>
//                             <input
//                                 type="file"
//                                 className="form-control"
//                                 id="profilePic"
//                                 accept="image/*"
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                         {profilePicPreview && (
//                             <div className="mb-3 text-center">
//                                 <label className="form-label d-block">New Profile Preview:</label>
//                                 <img
//                                     src={profilePicPreview}
//                                     alt="New Profile Preview"
//                                     className="img-thumbnail"
//                                     style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover' }}
//                                 />
//                             </div>
//                         )}
//                         <button type="submit" className="btn btn-primary" disabled={isUploadingPic || !profilePicFile}>
//                             {isUploadingPic ? 'Uploading...' : 'Upload Picture'}
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {/* Change Password Section */}
//             <div className="card mb-4">
//                 <div className="card-header">
//                     <h4>Change Password</h4>
//                 </div>
//                 <div className="card-body">
//                     <form onSubmit={handleChangePassword}>
//                         <div className="mb-3">
//                             <label htmlFor="currentPassword" className="form-label">Current Password</label>
//                             <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="newPassword" className="form-label">New Password</label>
//                             <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
//                             <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
//                         </div>
//                         <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
//                             {isChangingPassword ? 'Changing...' : 'Change Password'}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminProfileSettingsPage;










// src/components/Admin/AdminProfileSettingsPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';
import API_BASE_URL from '../../config';

// Import ReactCrop and its CSS
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Don't forget the CSS!

// Helper function to generate cropped image (you'll need to define this)
import { canvasPreview } from './canvasPreview'; // We'll create this file

const AdminProfileSettingsPage = () => {
    const { onProfileUpdate, userName, userRole, userProfilePic } = useOutletContext();

    // State for Profile Picture Update
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null); // This will be the cropped preview
    const [isUploadingPic, setIsUploadingPic] = useState(false);
    const [currentProfilePicUrl, setCurrentProfilePicUrl] = useState(userProfilePic || '/images/profile-placeholder.jpg');

    // --- NEW STATES FOR CROPPING ---
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null); // Ref for the preview canvas
    const [imgSrc, setImgSrc] = useState(''); // Holds the image data URL for ReactCrop
    const [crop, setCrop] = useState(); // The crop state (x, y, width, height)
    const [completedCrop, setCompletedCrop] = useState(); // The final cropped area
    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [aspect, setAspect] = useState(1 / 1); // 1:1 aspect ratio for profile pic

    // State for Password Change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // State for General Profile Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    

    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';
    const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

    useEffect(() => {
        if (userProfilePic) {
            setCurrentProfilePicUrl(userProfilePic);
        }
    }, [userProfilePic]);

    useEffect(() => {
        const fetchUserProfileDetails = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    toast.error("Not authenticated. Please log in.");
                    return;
                }
                const response = await axios.get(`${AUTH_API_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const userData = response.data;
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setContact(userData.contact);
                setEmail(userData.email);
            } catch (error) {
                console.error('Error fetching user profile details:', error.response?.data || error.message);
                toast.error(error.response?.data?.message || 'Failed to fetch user profile details.');
            }
        };

        fetchUserProfileDetails();
    }, [AUTH_API_URL]);

    // --- Profile Picture Handlers ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Read file as Data URL for ReactCrop
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImgSrc(reader.result.toString() || '')
            );
            reader.readAsDataURL(file);
            setProfilePicFile(file); // Keep original file for type checking if needed
            setProfilePicPreview(null); // Clear previous preview
            setCompletedCrop(undefined); // Reset crop area
        } else {
            setImgSrc('');
            setProfilePicFile(null);
            setProfilePicPreview(null);
            setCompletedCrop(undefined);
        }
    };

    // Handler when the image loads in ReactCrop
    const onImageLoad = useCallback((e) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        // Set an initial crop area (e.g., centered square)
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90, // Start with 90% width
                },
                aspect,
                width,
                height,
            ),
            width,
            height,
        );
        setCrop(newCrop);
    }, [aspect]);

    // This useEffect will update the canvas preview whenever completedCrop changes
    useEffect(() => {
        if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
            // Use the canvasPreview helper to draw the cropped image
            canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);

            // Convert canvas content to a Blob and set as profilePicPreview (Data URL for display)
            const canvas = previewCanvasRef.current;
            canvas.toBlob((blob) => {
                if (blob) {
                    setProfilePicPreview(URL.createObjectURL(blob));
                }
            }, 'image/jpeg', 0.95); // Adjust quality as needed
        }
    }, [completedCrop, scale, rotate]);


    const handleProfilePicUpload = async (e) => {
        e.preventDefault();

        if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
            toast.warn('Please select and crop an image first.');
            return;
        }

        setIsUploadingPic(true);

        try {
            const token = sessionStorage.getItem('token');
            const canvas = previewCanvasRef.current; // Get the canvas with the cropped image

            // Convert canvas content to a Blob
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    toast.error('Failed to create image blob.');
                    setIsUploadingPic(false);
                    return;
                }

                const formData = new FormData();
                // Append the cropped image Blob
                formData.append('profile_picture', blob, 'profile.jpeg'); // 'profile.jpeg' is the filename

                try {
                    const response = await axios.post(`${AUTH_API_URL}/profile/picture`, formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    toast.success(response.data.message || 'Profile picture updated successfully!');

                    const newRelativePicUrl = response.data.profile_pic_url;
                    setCurrentProfilePicUrl(API_BASE_URL + newRelativePicUrl);

                    if (onProfileUpdate) {
                        onProfileUpdate(newRelativePicUrl);
                    }

                    // Reset all states related to image selection and cropping
                    setProfilePicFile(null);
                    setImgSrc('');
                    setProfilePicPreview(null);
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                    setScale(1);
                    setRotate(0);
                    // Reset file input (requires a ref to the input element or direct DOM manipulation)
                    e.target.reset(); // If it's the form that contains the file input
                } catch (innerError) {
                    console.error('Error uploading profile picture:', innerError.response?.data || innerError.message);
                    toast.error(innerError.response?.data?.message || 'Failed to upload profile picture.');
                } finally {
                    setIsUploadingPic(false);
                }
            }, 'image/jpeg', 0.95); // Specify JPEG format and quality
        } catch (error) {
            console.error('Error during image processing:', error);
            toast.error('An error occurred during image processing.');
            setIsUploadingPic(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.error("Please fill all password fields.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            toast.error("New password and confirm new password do not match.");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }

        setIsChangingPassword(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(`${AUTH_API_URL}/profile/change_password`, {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success(response.data.message || "Password changed successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Error changing password:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to change password.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.put(`${AUTH_API_URL}/profile/update`, {
                first_name: firstName,
                last_name: lastName,
                contact: contact,
                email: email
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success(response.data.message || "Profile updated successfully!");
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Profile Settings</h2>

            {/* General Profile Information Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>General Information</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="contact" className="form-label">Contact</label>
                            <input type="text" className="form-control" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Profile Picture Update Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Update Profile Picture</h4>
                </div>
                <div className="card-body">
                    {currentProfilePicUrl && !imgSrc && ( // Only show current if no new image selected for cropping
                        <div className="mb-3 text-center">
                            <label className="form-label d-block">Current Profile Picture:</label>
                            <img
                                src={currentProfilePicUrl}
                                alt="Current Profile"
                                className="img-thumbnail"
                                style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <form onSubmit={handleProfilePicUpload}>
                        <div className="mb-3">
                            <label htmlFor="profilePic" className="form-label">Choose new profile picture:</label>
                            <input
                                type="file"
                                className="form-control"
                                id="profilePic"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* --- NEW: ReactCrop Component and Controls --- */}
                        {imgSrc && (
                            <div className="mb-3">
                                <h5 className="mt-3">Adjust Image:</h5>
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    minWidth={50} // Minimum width for the crop area
                                    minHeight={50} // Minimum height for the crop area
                                    circularCrop // For a circular profile pic
                                >
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxWidth: '100%', height: 'auto' }}
                                        onLoad={onImageLoad}
                                    />
                                </ReactCrop>

                                {/* Zoom/Scale Slider */}
                                <div className="mt-3">
                                    <label htmlFor="scale-input" className="form-label">Zoom ({Math.round(scale * 100)}%)</label>
                                    <input
                                        type="range"
                                        id="scale-input"
                                        className="form-range"
                                        min="1"
                                        max="3"
                                        step="0.01"
                                        value={scale}
                                        onChange={(e) => setScale(Number(e.target.value))}
                                    />
                                </div>

                                {/* Rotate Slider (Optional, but good for fine-tuning) */}
                                <div className="mb-3">
                                    <label htmlFor="rotate-input" className="form-label">Rotate ({Math.round(rotate)}°)</label>
                                    <input
                                        type="range"
                                        id="rotate-input"
                                        className="form-range"
                                        min="0"
                                        max="360"
                                        step="1"
                                        value={rotate}
                                        onChange={(e) => setRotate(Number(e.target.value))}
                                    />
                                </div>

                                {/* Preview Canvas (where the actual cropped image is drawn) */}
                                {completedCrop && (
                                    <div className="mb-3 text-center">
                                        <label className="form-label d-block">Cropped Preview:</label>
                                        <canvas
                                            ref={previewCanvasRef}
                                            style={{
                                                width: completedCrop.width,
                                                height: completedCrop.height,
                                                maxWidth: '150px',
                                                maxHeight: '150px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                border: '1px solid #ddd'
                                            }}
                                            className="img-thumbnail"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {/* --- END NEW ReactCrop Component and Controls --- */}

                        <button type="submit" className="btn btn-primary" disabled={isUploadingPic || !imgSrc || !completedCrop}>
                            {isUploadingPic ? 'Uploading...' : 'Upload Picture'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Change Password</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-3">
                            <label htmlFor="currentPassword" className="form-label">Current Password</label>
                            <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                            <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isChangingPassword}>
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfileSettingsPage;