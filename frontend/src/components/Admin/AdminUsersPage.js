// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import './styles/AdminUsersPage.css'; // New CSS file

// const AdminUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   // State for Add/Edit/View Modals
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [viewUser, setViewUser] = useState(null);

//   // State for form fields
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     contact: '',
//     password: '',
//     user_type: 'user'
//   });

//   // State for pagination, search, and filter
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState('all'); // Filter by user_type

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || decodedToken.role || '');
//         setLoggedInUserId(decodedToken.sub);
//         setLoading(false);
//       } catch (err) {
//         console.error("Failed to decode token:", err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError("Invalid or expired token. Please log in again.");
//       }
//     } else {
//       handleAuthError("Authentication token missing. Please log in to view users.");
//     }
//   }, [handleAuthError]);

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery,
//         user_type: filterType === 'all' ? '' : filterType // Add filter parameter
//       });

//       console.log(`Fetching users from: ${API_BASE_URL}/users/?${params.toString()}`);
//       const response = await fetch(`${API_BASE_URL}/users/?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authorization failed. You do not have permission.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch users.');
//       }
//       const data = await response.json();
//       setUsers(data.users || []);
//       setTotalPages(data.pages || 1);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, filterType, handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole || error) {
//       fetchUsers();
//     }
//   }, [fetchUsers, loggedInUserRole, error]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddUser = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     if (!formData.first_name || !formData.last_name || !formData.email || !formData.contact) {
//       setError("First Name, Last Name, Email, and Contact are required.");
//       return;
//     }

//     if (formData.user_type === 'user' && !formData.password) {
//       setError("Password is required for 'User' type accounts.");
//       return;
//     }
//     if (formData.user_type === 'user' && formData.password.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }

//     const payload = {
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       email: formData.email,
//       contact: formData.contact,
//       user_type: formData.user_type
//     };

//     if (formData.user_type === 'user') {
//       payload.password = formData.password;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authentication/Authorization failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to add user.');
//       }

//       const responseData = await response.json();
//       let msg = `User '${responseData.user.name}' (${responseData.user.user_type}) created successfully!`;
//       if (responseData.password_generated) {
//         msg += " An email with the temporary password has been sent to their email address.";
//       }
//       setSuccessMessage(msg);
//       setShowAddModal(false);
//       setFormData({ first_name: '', last_name: '', email: '', contact: '', password: '', user_type: 'user' });
//       fetchUsers();
//     } catch (err) {
//       console.error("Error adding user:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleEditClick = (user) => {
//     setCurrentUser(user);
//     setFormData({
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//       contact: user.contact,
//       password: '',
//       user_type: user.user_type
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (user) => {
//     setViewUser(user);
//     setShowViewModal(true);
//   };

//   const handleUpdateUser = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentUser) {
//       handleAuthError("Authentication token missing or no user selected for edit.");
//       return;
//     }

//     const dataToSend = {
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       contact: formData.contact,
//       email: formData.email
//     };

//     if (loggedInUserRole === 'super_admin') {
//       if (currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin' && formData.user_type !== 'super_admin') {
//         setError("Super Admin cannot demote themselves using this general update.");
//         return;
//       }
//       if (currentUser.user_type === 'super_admin' && formData.user_type !== 'super_admin' && currentUser.id !== loggedInUserId) {
//         setError("Cannot demote another Super Admin via this endpoint. Please use a specific demotion process if needed.");
//         return;
//       }
//       dataToSend.user_type = formData.user_type;
//     }

//     if (formData.password) {
//       if (formData.password.length < 8) {
//         setError("New password must be at least 8 characters.");
//         return;
//       }
//       dataToSend.password = formData.password;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(dataToSend)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403 || response.status === 409) {
//           setError(errorData.error || "Operation failed. Please check permissions or data conflicts.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update user.');
//       }

//       setSuccessMessage('User updated successfully!');
//       setShowEditModal(false);
//       setCurrentUser(null);
//       setFormData({ first_name: '', last_name: '', email: '', contact: '', password: '', user_type: 'user' });
//       fetchUsers();
//     } catch (err) {
//       console.error("Error updating user:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleDemoteSuperAdmin = async (userId) => {
//     if (userId === loggedInUserId) {
//       setError("You cannot demote your own Super Admin account using this button.");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to demote this Super Admin to Admin? This action cannot be easily reversed.")) {
//       return;
//     }

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/demote_super_admin/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authorization failed. You do not have permission to demote Super Admins.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to demote Super Admin.');
//       }

//       setSuccessMessage('Super Admin successfully demoted to Admin. An email notification has been sent.');
//       fetchUsers();
//     } catch (err) {
//       console.error("Error demoting Super Admin:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleDeleteUser = async (userId, userType) => {
//     if (userId === loggedInUserId) {
//       setError("You cannot delete your own account.");
//       return;
//     }

//     if (loggedInUserRole === 'admin' && (userType === 'admin' || userType === 'super_admin')) {
//       setError("Admin users cannot delete other admins or super admins.");
//       return;
//     }

//     if (loggedInUserRole === 'super_admin' && userType === 'super_admin' && userId !== loggedInUserId) {
//       setError("Super Admin cannot directly delete another Super Admin's account.");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this user?")) {
//       return;
//     }

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authentication/Authorization failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete user.');
//       }

//       setSuccessMessage('User deleted successfully!');
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   return (
//     <div className="users-container">
//       <div className="users-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">MANAGE USERS</h1>
//             {/* <p className="page-subtitle">Manage your user accounts!</p> */}
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{users.length}</div>
//                 <div className="stat-label">Total Users</div>
//               </div>
//             </div>
//             <div className="filter-wrapper">
//               <FaFilter className="filter-icon" />
//               <Form.Select
//                 value={filterType}
//                 onChange={(e) => {
//                   setFilterType(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="filter-select"
//               >
//                 <option value="all">All Types</option>
//                 <option value="user">Users</option>
//                 <option value="admin">Admins</option>
//                 <option value="super_admin">Super Admins</option>
//               </Form.Select>
//             </div>
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="search-input"
//               />
//             </div>
//             {(loggedInUserRole === 'super_admin') && (
//               <Button className="btn-add-user" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add New User
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       <Card className="content-card">
//         <Card.Body>
//           {loading && !error && (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading users...</h4>
//               <p>Please wait while we fetch your users!</p>
//             </div>
//           )}
//           {error && <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>{error}</Alert>}
//           {successMessage && <Alert variant="success" className="success-alert" onClose={() => setSuccessMessage(null)} dismissible>{successMessage}</Alert>}
//           {!loading && !error && users.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-people"></i></div>
//               <h4>No Users Found</h4>
//               <p>Try adjusting your filter or search, or add a new user!</p>
//               {(loggedInUserRole === 'super_admin') && (
//                 <Button className="btn-add-user" onClick={() => setShowAddModal(true)}>
//                   <FaPlus className="me-2" /> Add First User
//                 </Button>
//               )}
//             </div>
//           )}
//           {!loading && !error && users.length > 0 && (
//             <>
//               <div className="table-responsive">
//                 <Table className="users-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>First Name</th>
//                       <th>Last Name</th>
//                       <th>Email</th>
//                       <th>Contact</th>
//                       <th>User Type</th>
//                       <th>Created At</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((user) => (
//                       <tr key={user.id}>
//                         <td><span className="user-id">{user.id}</span></td>
//                         <td><span className="user-name">{truncateText(user.first_name)}</span></td>
//                         <td><span className="user-name">{truncateText(user.last_name)}</span></td>
//                         <td><span className="user-email">{truncateText(user.email)}</span></td>
//                         <td><span className="user-contact">{truncateText(user.contact)}</span></td>
//                         <td><span className="user-type">{user.user_type}</span></td>
//                         <td><span className="user-date">{new Date(user.created_at).toLocaleDateString()}</span></td>
//                         <td>
//                           <div className="action-buttons">
//                             <Button variant="info" size="sm" onClick={() => handleViewClick(user)} title="View">
//                               <FaEye />
//                             </Button>
//                             <Button variant="warning" size="sm" onClick={() => handleEditClick(user)} title="Edit" disabled={user.id === loggedInUserId && user.user_type === 'super_admin'}>
//                               <FaEdit />
//                             </Button>
//                             {(loggedInUserRole === 'super_admin' && user.user_type !== 'super_admin') ||
//                              (loggedInUserRole === 'admin' && user.user_type === 'user') ? (
//                               <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id, user.user_type)} title="Delete" disabled={user.id === loggedInUserId}>
//                                 <FaTrash />
//                               </Button>
//                             ) : (loggedInUserRole === 'super_admin' && user.user_type === 'super_admin' && user.id !== loggedInUserId) ? (
//                               <Button variant="info" size="sm" onClick={() => handleDemoteSuperAdmin(user.id)} title="Demote SA to Admin" disabled={user.id === loggedInUserId}>
//                                 <FaEdit />
//                               </Button>
//                             ) : (
//                               <Button variant="secondary" size="sm" disabled title="No Action">
//                                 <FaEye />
//                               </Button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper">
//                   <Pagination className="custom-pagination">
//                     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                     {[...Array(totalPages)].map((_, index) => (
//                       <Pagination.Item
//                         key={index + 1}
//                         active={index + 1 === currentPage}
//                         onClick={() => handlePageChange(index + 1)}
//                       >
//                         {index + 1}
//                       </Pagination.Item>
//                     ))}
//                     <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//                   </Pagination>
//                   <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//                 </div>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>

//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>User Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewUser && (
//             <div className="user-detail-info">
//               <h4 className="user-detail-name">{`${truncateText(viewUser.first_name)} ${truncateText(viewUser.last_name)}`}</h4>
//               <div className="user-detail-row"><strong>ID:</strong> {viewUser.id}</div>
//               <div className="user-detail-row"><strong>Email:</strong> {viewUser.email}</div>
//               <div className="user-detail-row"><strong>Contact:</strong> {viewUser.contact}</div>
//               <div className="user-detail-row"><strong>User Type:</strong> {viewUser.user_type}</div>
//               <div className="user-detail-row"><strong>Created At:</strong> {new Date(viewUser.created_at).toLocaleDateString()}</div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-user" onClick={() => { setShowViewModal(false); handleEditClick(viewUser); }} disabled={viewUser && viewUser.id === loggedInUserId && viewUser.user_type === 'super_admin'}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>First Name</Form.Label>
//               <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Last Name</Form.Label>
//               <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Contact</Form.Label>
//               <Form.Control type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 Password
//                 {formData.user_type !== 'user' && " (Auto-generated for Admin/Super Admin)"}
//               </Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required={formData.user_type === 'user'}
//                 disabled={formData.user_type !== 'user'}
//                 placeholder={formData.user_type !== 'user' ? "Password will be emailed" : "Enter password"}
//               />
//             </Form.Group>
//             {(loggedInUserRole === 'super_admin') && (
//               <Form.Group className="mb-3">
//                 <Form.Label>User Type</Form.Label>
//                 <Form.Select name="user_type" value={formData.user_type} onChange={handleInputChange}>
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </Form.Select>
//               </Form.Group>
//             )}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
//           <Button className="btn-add-user" onClick={handleAddUser}>
//             <FaPlus className="me-2" /> Add User
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>First Name</Form.Label>
//               <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Last Name</Form.Label>
//               <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control type="email" name="email" value={formData.email} readOnly disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Contact</Form.Label>
//               <Form.Control type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>New Password (leave blank to keep current)</Form.Label>
//               <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
//             </Form.Group>
//             {(loggedInUserRole === 'super_admin') && (
//               <Form.Group className="mb-3">
//                 <Form.Label>User Type</Form.Label>
//                 <Form.Select
//                   name="user_type"
//                   value={formData.user_type}
//                   onChange={handleInputChange}
//                   disabled={currentUser && currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin'}
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </Form.Select>
//                 {currentUser && currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin' && (
//                   <Form.Text className="text-muted">
//                     You cannot change your own Super Admin role here.
//                   </Form.Text>
//                 )}
//               </Form.Group>
//             )}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
//           <Button className="btn-add-user" onClick={handleUpdateUser}>
//             <FaEdit className="me-2" /> Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminUsersPage;




// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import './styles/AdminUsersPage.css'; // New CSS file

// const AdminUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   // State for Add/Edit/View Modals
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [viewUser, setViewUser] = useState(null);

//   // State for form fields
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     contact: '',
//     password: '',
//     user_type: 'user'
//   });

//   // State for pagination, search, and filter
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState('all'); // Filter by user_type

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || decodedToken.role || '');
//         setLoggedInUserId(decodedToken.sub);
//       } catch (err) {
//         console.error("Failed to decode token:", err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError("Invalid or expired token. Please log in again.");
//       }
//     } else {
//       handleAuthError("Authentication token missing. Please log in to view users.");
//     }
//   }, [handleAuthError]);

//   const fetchUsers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
    
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in.");
//         return;
//       }

//       // Build query parameters properly
//       const params = new URLSearchParams();
//       params.append('page', currentPage.toString());
//       params.append('per_page', '10');
      
//       // Only add search parameter if there's a search query
//       if (searchQuery.trim()) {
//         params.append('search', searchQuery.trim());
//       }
      
//       // Only add user_type filter if it's not 'all'
//       if (filterType && filterType !== 'all') {
//         params.append('user_type', filterType);
//       }

//       const url = `${API_BASE_URL}/users/?${params.toString()}`;
//       console.log(`Fetching users from: ${url}`);
      
//       const response = await fetch(url, {
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authorization failed. You do not have permission.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to fetch users.');
//       }

//       const data = await response.json();
//       console.log('API Response:', data); // Debug log
      
//       setUsers(data.users || []);
//       setTotalPages(data.pages || 1);
      
//       // Reset to page 1 if current page exceeds total pages
//       if (currentPage > (data.pages || 1) && (data.pages || 1) > 0) {
//         setCurrentPage(1);
//       }
      
//     } catch (err) {
//       console.error("Error fetching users:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, filterType, handleAuthError]);

//   // Trigger fetch when dependencies change
//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchUsers();
//     }
//   }, [fetchUsers, loggedInUserRole]);

//   // Handle filter change with proper reset
//   const handleFilterChange = useCallback((e) => {
//     const newFilterType = e.target.value;
//     console.log('Filter changed to:', newFilterType); // Debug log
//     setFilterType(newFilterType);
//     setCurrentPage(1); // Reset to first page
//   }, []);

//   // Handle search change with debounce
//   const handleSearchChange = useCallback((e) => {
//     const newSearchQuery = e.target.value;
//     console.log('Search changed to:', newSearchQuery); // Debug log
//     setSearchQuery(newSearchQuery);
//     setCurrentPage(1); // Reset to first page
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddUser = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     if (!formData.first_name || !formData.last_name || !formData.email || !formData.contact) {
//       setError("First Name, Last Name, Email, and Contact are required.");
//       return;
//     }

//     if (formData.user_type === 'user' && !formData.password) {
//       setError("Password is required for 'User' type accounts.");
//       return;
//     }
//     if (formData.user_type === 'user' && formData.password.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }

//     const payload = {
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       email: formData.email,
//       contact: formData.contact,
//       user_type: formData.user_type
//     };

//     if (formData.user_type === 'user') {
//       payload.password = formData.password;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authentication/Authorization failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to add user.');
//       }

//       const responseData = await response.json();
//       let msg = `User '${responseData.user.name}' (${responseData.user.user_type}) created successfully!`;
//       if (responseData.password_generated) {
//         msg += " An email with the temporary password has been sent to their email address.";
//       }
//       setSuccessMessage(msg);
//       setShowAddModal(false);
//       setFormData({ first_name: '', last_name: '', email: '', contact: '', password: '', user_type: 'user' });
//       fetchUsers();
//     } catch (err) {
//       console.error("Error adding user:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleEditClick = (user) => {
//     setCurrentUser(user);
//     setFormData({
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//       contact: user.contact,
//       password: '',
//       user_type: user.user_type
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (user) => {
//     setViewUser(user);
//     setShowViewModal(true);
//   };

//   const handleUpdateUser = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentUser) {
//       handleAuthError("Authentication token missing or no user selected for edit.");
//       return;
//     }

//     const dataToSend = {
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       contact: formData.contact,
//       email: formData.email
//     };

//     if (loggedInUserRole === 'super_admin') {
//       if (currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin' && formData.user_type !== 'super_admin') {
//         setError("Super Admin cannot demote themselves using this general update.");
//         return;
//       }
//       if (currentUser.user_type === 'super_admin' && formData.user_type !== 'super_admin' && currentUser.id !== loggedInUserId) {
//         setError("Cannot demote another Super Admin via this endpoint. Please use a specific demotion process if needed.");
//         return;
//       }
//       dataToSend.user_type = formData.user_type;
//     }

//     if (formData.password) {
//       if (formData.password.length < 8) {
//         setError("New password must be at least 8 characters.");
//         return;
//       }
//       dataToSend.password = formData.password;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(dataToSend)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403 || response.status === 409) {
//           setError(errorData.error || "Operation failed. Please check permissions or data conflicts.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to update user.');
//       }

//       setSuccessMessage('User updated successfully!');
//       setShowEditModal(false);
//       setCurrentUser(null);
//       setFormData({ first_name: '', last_name: '', email: '', contact: '', password: '', user_type: 'user' });
//       fetchUsers();
//     } catch (err) {
//       console.error("Error updating user:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleDemoteSuperAdmin = async (userId) => {
//     if (userId === loggedInUserId) {
//       setError("You cannot demote your own Super Admin account using this button.");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to demote this Super Admin to Admin? This action cannot be easily reversed.")) {
//       return;
//     }

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/demote_super_admin/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authorization failed. You do not have permission to demote Super Admins.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to demote Super Admin.');
//       }

//       setSuccessMessage('Super Admin successfully demoted to Admin. An email notification has been sent.');
//       fetchUsers();
//     } catch (err) {
//       console.error("Error demoting Super Admin:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleDeleteUser = async (userId, userType) => {
//     if (userId === loggedInUserId) {
//       setError("You cannot delete your own account.");
//       return;
//     }

//     if (loggedInUserRole === 'admin' && (userType === 'admin' || userType === 'super_admin')) {
//       setError("Admin users cannot delete other admins or super admins.");
//       return;
//     }

//     if (loggedInUserRole === 'super_admin' && userType === 'super_admin' && userId !== loggedInUserId) {
//       setError("Super Admin cannot directly delete another Super Admin's account.");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this user?")) {
//       return;
//     }

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.error || "Authentication/Authorization failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.error || 'Failed to delete user.');
//       }

//       setSuccessMessage('User deleted successfully!');
//       fetchUsers();
//     } catch (err) {
//       console.error("Error deleting user:", err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   // Debug function to show current filter state
//   const debugFilterState = () => {
//     console.log('Current Filter State:', {
//       filterType,
//       searchQuery,
//       currentPage,
//       totalUsers: users.length,
//       totalPages
//     });
//   };

//   return (
//     <div className="users-container">
//       <div className="users-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">MANAGE USERS</h1>
//             {/* <p className="page-subtitle">Manage your user accounts!</p> */}
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{users.length}</div>
//                 <div className="stat-label">Total Users</div>
//               </div>
//             </div>
            
//             {/* Fixed Filter Component */}
//             <div className="filter-wrapper">
//               <FaFilter className="filter-icon" />
//               <Form.Select
//                 value={filterType}
//                 onChange={handleFilterChange}
//                 className="filter-select"
//                 title="Filter by user type"
//               >
//                 <option value="all">All Types</option>
//                 <option value="user">Users</option>
//                 <option value="admin">Admins</option>
//                 <option value="super_admin">Super Admins</option>
//               </Form.Select>
//               {/* Debug button - remove in production */}
//               <Button 
//                 size="sm" 
//                 variant="outline-secondary" 
//                 onClick={debugFilterState}
//                 style={{ marginLeft: '5px' }}
//               >
//                 Debug
//               </Button>
//             </div>
            
//             {/* Fixed Search Component */}
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="search-input"
//                 title="Search by name or email"
//               />
//             </div>
            
//             {(loggedInUserRole === 'super_admin') && (
//               <Button className="btn-add-user" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add New User
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       <Card className="content-card">
//         <Card.Body>
//           {/* Show current filter status */}
//           {(filterType !== 'all' || searchQuery.trim()) && (
//             <div className="mb-3">
//               <Alert variant="info" className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <strong>Active Filters:</strong>
//                   {filterType !== 'all' && <span className="ms-2 badge bg-primary">Type: {filterType}</span>}
//                   {searchQuery.trim() && <span className="ms-2 badge bg-secondary">Search: "{searchQuery}"</span>}
//                 </div>
//                 <Button 
//                   size="sm" 
//                   variant="outline-secondary"
//                   onClick={() => {
//                     setFilterType('all');
//                     setSearchQuery('');
//                     setCurrentPage(1);
//                   }}
//                 >
//                   Clear Filters
//                 </Button>
//               </Alert>
//             </div>
//           )}

//           {loading && (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading users...</h4>
//               <p>Please wait while we fetch your users!</p>
//             </div>
//           )}
          
//           {error && (
//             <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>
//               {error}
//             </Alert>
//           )}
          
//           {successMessage && (
//             <Alert variant="success" className="success-alert" onClose={() => setSuccessMessage(null)} dismissible>
//               {successMessage}
//             </Alert>
//           )}
          
//           {!loading && !error && users.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-people"></i></div>
//               <h4>No Users Found</h4>
//               <p>
//                 {(filterType !== 'all' || searchQuery.trim()) 
//                   ? "No users match your current filters. Try adjusting your search or filter criteria."
//                   : "No users available. Add a new user to get started!"
//                 }
//               </p>
//               {(loggedInUserRole === 'super_admin') && (
//                 <Button className="btn-add-user" onClick={() => setShowAddModal(true)}>
//                   <FaPlus className="me-2" /> Add First User
//                 </Button>
//               )}
//             </div>
//           )}
          
//           {!loading && !error && users.length > 0 && (
//             <>
//               <div className="table-responsive">
//                 <Table className="users-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>First Name</th>
//                       <th>Last Name</th>
//                       <th>Email</th>
//                       <th>Contact</th>
//                       <th>User Type</th>
//                       <th>Created At</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {users.map((user) => (
//                       <tr key={user.id}>
//                         <td><span className="user-id">{user.id}</span></td>
//                         <td><span className="user-name">{truncateText(user.first_name)}</span></td>
//                         <td><span className="user-name">{truncateText(user.last_name)}</span></td>
//                         <td><span className="user-email">{truncateText(user.email)}</span></td>
//                         <td><span className="user-contact">{truncateText(user.contact)}</span></td>
//                         <td>
//                           <span className={`user-type badge ${
//                             user.user_type === 'super_admin' ? 'bg-danger' :
//                             user.user_type === 'admin' ? 'bg-warning' : 'bg-success'
//                           }`}>
//                             {user.user_type}
//                           </span>
//                         </td>
//                         <td><span className="user-date">{new Date(user.created_at).toLocaleDateString()}</span></td>
//                         <td>
//                           <div className="action-buttons">
//                             <Button variant="info" size="sm" onClick={() => handleViewClick(user)} title="View">
//                               <FaEye />
//                             </Button>
//                             <Button variant="warning" size="sm" onClick={() => handleEditClick(user)} title="Edit" disabled={user.id === loggedInUserId && user.user_type === 'super_admin'}>
//                               <FaEdit />
//                             </Button>
//                             {(loggedInUserRole === 'super_admin' && user.user_type !== 'super_admin') ||
//                              (loggedInUserRole === 'admin' && user.user_type === 'user') ? (
//                               <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id, user.user_type)} title="Delete" disabled={user.id === loggedInUserId}>
//                                 <FaTrash />
//                               </Button>
//                             ) : (loggedInUserRole === 'super_admin' && user.user_type === 'super_admin' && user.id !== loggedInUserId) ? (
//                               <Button variant="info" size="sm" onClick={() => handleDemoteSuperAdmin(user.id)} title="Demote SA to Admin" disabled={user.id === loggedInUserId}>
//                                 <FaEdit />
//                               </Button>
//                             ) : (
//                               <Button variant="secondary" size="sm" disabled title="No Action">
//                                 <FaEye />
//                               </Button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper">
//                   <Pagination className="custom-pagination">
//                     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                     {[...Array(totalPages)].map((_, index) => (
//                       <Pagination.Item
//                         key={index + 1}
//                         active={index + 1 === currentPage}
//                         onClick={() => handlePageChange(index + 1)}
//                       >
//                         {index + 1}
//                       </Pagination.Item>
//                     ))}
//                     <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//                   </Pagination>
//                   <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//                 </div>
//               )}
//             </>
//           )}
//         </Card.Body>
//       </Card>

//       {/* View User Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>User Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewUser && (
//             <div className="user-detail-info">
//               <h4 className="user-detail-name">{`${viewUser.first_name} ${viewUser.last_name}`}</h4>
//               <div className="user-detail-row"><strong>ID:</strong> {viewUser.id}</div>
//               <div className="user-detail-row"><strong>Email:</strong> {viewUser.email}</div>
//               <div className="user-detail-row"><strong>Contact:</strong> {viewUser.contact}</div>
//               <div className="user-detail-row">
//                 <strong>User Type:</strong> 
//                 <span className={`ms-2 badge ${
//                   viewUser.user_type === 'super_admin' ? 'bg-danger' :
//                   viewUser.user_type === 'admin' ? 'bg-warning' : 'bg-success'
//                 }`}>
//                   {viewUser.user_type}
//                 </span>
//               </div>
//               <div className="user-detail-row"><strong>Created At:</strong> {new Date(viewUser.created_at).toLocaleDateString()}</div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-user" onClick={() => { setShowViewModal(false); handleEditClick(viewUser); }} disabled={viewUser && viewUser.id === loggedInUserId && viewUser.user_type === 'super_admin'}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add User Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>First Name</Form.Label>
//               <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Last Name</Form.Label>
//               <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Contact</Form.Label>
//               <Form.Control type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 Password
//                 {formData.user_type !== 'user' && " (Auto-generated for Admin/Super Admin)"}
//               </Form.Label>
//               <Form.Control
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 required={formData.user_type === 'user'}
//                 disabled={formData.user_type !== 'user'}
//                 placeholder={formData.user_type !== 'user' ? "Password will be emailed" : "Enter password"}
//               />
//             </Form.Group>
//             {(loggedInUserRole === 'super_admin') && (
//               <Form.Group className="mb-3">
//                 <Form.Label>User Type</Form.Label>
//                 <Form.Select name="user_type" value={formData.user_type} onChange={handleInputChange}>
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </Form.Select>
//               </Form.Group>
//             )}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
//           <Button className="btn-add-user" onClick={handleAddUser}>
//             <FaPlus className="me-2" /> Add User
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit User Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>First Name</Form.Label>
//               <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Last Name</Form.Label>
//               <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Email</Form.Label>
//               <Form.Control type="email" name="email" value={formData.email} readOnly disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Contact</Form.Label>
//               <Form.Control type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>New Password (leave blank to keep current)</Form.Label>
//               <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
//             </Form.Group>
//             {(loggedInUserRole === 'super_admin') && (
//               <Form.Group className="mb-3">
//                 <Form.Label>User Type</Form.Label>
//                 <Form.Select
//                   name="user_type"
//                   value={formData.user_type}
//                   onChange={handleInputChange}
//                   disabled={currentUser && currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin'}
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="super_admin">Super Admin</option>
//                 </Form.Select>
//                 {currentUser && currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin' && (
//                   <Form.Text className="text-muted">
//                     You cannot change your own Super Admin role here.
//                   </Form.Text>
//                 )}
//               </Form.Group>
//             )}
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
//           <Button className="btn-add-user" onClick={handleUpdateUser}>
//             <FaEdit className="me-2" /> Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminUsersPage;




import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/global.css'; // Updated CSS file


const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State for Add/Edit/View Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  // State for form fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    password: '',
    user_type: 'user'
  });

  // State for pagination, search, and filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // Filter by user_type

  const [loggedInUserRole, setLoggedInUserRole] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
  const navigate = useNavigate();

  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setLoggedInUserRole(decodedToken.user_type || decodedToken.role || '');
        setLoggedInUserId(decodedToken.sub);
      } catch (err) {
        console.error("Failed to decode token:", err);
        setLoggedInUserRole('');
        setLoggedInUserId(null);
        handleAuthError("Invalid or expired token. Please log in again.");
      }
    } else {
      handleAuthError("Authentication token missing. Please log in to view users.");
    }
  }, [handleAuthError]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError("Authentication token missing. Please log in.");
        return;
      }

      // Build query parameters properly
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('per_page', '10');
      
      // Only add search parameter if there's a search query
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      // Only add user_type filter if it's not 'all'
      if (filterType && filterType !== 'all') {
        params.append('user_type', filterType);
      }

      const url = `${API_BASE_URL}/users/?${params.toString()}`;
      console.log(`Fetching users from: ${url}`);
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authorization failed. You do not have permission.");
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch users.');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
      
      // Reset to page 1 if current page exceeds total pages
      if (currentPage > (data.pages || 1) && (data.pages || 1) > 0) {
        setCurrentPage(1);
      }
      
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filterType, handleAuthError]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    if (loggedInUserRole) {
      fetchUsers();
    }
  }, [fetchUsers, loggedInUserRole]);

  // Handle filter change with proper reset
  const handleFilterChange = useCallback((e) => {
    const newFilterType = e.target.value;
    console.log('Filter changed to:', newFilterType); // Debug log
    setFilterType(newFilterType);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle search change with debounce
  const handleSearchChange = useCallback((e) => {
    const newSearchQuery = e.target.value;
    console.log('Search changed to:', newSearchQuery); // Debug log
    setSearchQuery(newSearchQuery);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      return;
    }

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.contact) {
      setError("First Name, Last Name, Email, and Contact are required.");
      return;
    }

    if (formData.user_type === 'user' && !formData.password) {
      setError("Password is required for 'User' type accounts.");
      return;
    }
    if (formData.user_type === 'user' && formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      contact: formData.contact,
      user_type: formData.user_type
    };

    if (formData.user_type === 'user') {
      payload.password = formData.password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authentication/Authorization failed. Please log in again.");
          return;
        }
        throw new Error(errorData.error || 'Failed to add user.');
      }

      const responseData = await response.json();
      let msg = `User '${responseData.user.name}' (${responseData.user.user_type}) created successfully!`;
      if (responseData.password_generated) {
        msg += " An email with the temporary password has been sent to their email address.";
      }
      setSuccessMessage(msg);
      setShowAddModal(false);
      setFormData({ first_name: '', last_name: '', email: '', contact: '', password: '', user_type: 'user' });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      contact: user.contact,
      password: '',
      user_type: user.user_type
    });
    setShowEditModal(true);
  };

  const handleViewClick = (user) => {
    setViewUser(user);
    setShowViewModal(true);
  };

  const handleUpdateUser = async () => {
    const token = sessionStorage.getItem('token');
    if (!token || !currentUser) {
      handleAuthError("Authentication token missing or no user selected for edit.");
      return;
    }

    const dataToSend = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      contact: formData.contact,
      email: formData.email
    };

    if (loggedInUserRole === 'super_admin') {
      if (currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin' && formData.user_type !== 'super_admin') {
        setError("Super Admin cannot demote themselves using this general update.");
        return;
      }
      if (currentUser.user_type === 'super_admin' && formData.user_type !== 'super_admin' && currentUser.id !== loggedInUserId) {
        setError("Cannot demote another Super Admin via this endpoint. Please use a specific demotion process if needed.");
        return;
      }
      dataToSend.user_type = formData.user_type;
    }

    if (formData.password) {
      if (formData.password.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      dataToSend.password = formData.password;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403 || response.status === 409) {
          setError(errorData.error || "Operation failed. Please check permissions or data conflicts.");
          return;
        }
        throw new Error(errorData.error || 'Failed to update user.');
      }

      setSuccessMessage('User updated successfully!');
      setShowEditModal(false);
      setCurrentUser(null);
      setFormData({ first_name: '', last_name: '', email: '', contact: '', password: '', user_type: 'user' });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleDemoteSuperAdmin = async (userId) => {
    if (userId === loggedInUserId) {
      setError("You cannot demote your own Super Admin account using this button.");
      return;
    }

    if (!window.confirm("Are you sure you want to demote this Super Admin to Admin? This action cannot be easily reversed.")) {
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/demote_super_admin/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authorization failed. You do not have permission to demote Super Admins.");
          return;
        }
        throw new Error(errorData.error || 'Failed to demote Super Admin.');
      }

      setSuccessMessage('Super Admin successfully demoted to Admin. An email notification has been sent.');
      fetchUsers();
    } catch (err) {
      console.error("Error demoting Super Admin:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId, userType) => {
    if (userId === loggedInUserId) {
      setError("You cannot delete your own account.");
      return;
    }

    if (loggedInUserRole === 'admin' && (userType === 'admin' || userType === 'super_admin')) {
      setError("Admin users cannot delete other admins or super admins.");
      return;
    }

    if (loggedInUserRole === 'super_admin' && userType === 'super_admin' && userId !== loggedInUserId) {
      setError("Super Admin cannot directly delete another Super Admin's account.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError("Authentication token missing. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.error || "Authentication/Authorization failed. Please log in again.");
          return;
        }
        throw new Error(errorData.error || 'Failed to delete user.');
      }

      setSuccessMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(`Error: ${err.message}`);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Debug function to show current filter state
  const debugFilterState = () => {
    console.log('Current Filter State:', {
      filterType,
      searchQuery,
      currentPage,
      totalUsers: users.length,
      totalPages
    });
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">MANAGE USERS</h1>
            {/* <p className="page-subtitle">Manage your user accounts!</p> */}
          </div>
          <div className="header-actions">
            <div className="stat-card-compact">
              <div className="stat-content text-center">
                <div className="stat-number">{users.length}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            
            {/* Fixed Filter Component */}
            <div className="filter-wrapper">
              <FaFilter className="filter-icon" />
              <Form.Select
                value={filterType}
                onChange={handleFilterChange}
                className="filter-select"
                title="Filter by user type"
              >
                <option value="all">All Types</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
                <option value="super_admin">Super Admins</option>
              </Form.Select>
              {/* Debug button - remove in production */}
              <Button 
                size="sm" 
                variant="outline-secondary" 
                onClick={debugFilterState}
                style={{ marginLeft: '5px' }}
              >
                Debug
              </Button>
            </div>
            
            {/* Fixed Search Component */}
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                title="Search by name or email"
              />
            </div>
            
            {(loggedInUserRole === 'super_admin') && (
              <Button className="btn-add-user" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" /> Add New User
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="content-card">
        <Card.Body>
          {/* Show current filter status */}
          {(filterType !== 'all' || searchQuery.trim()) && (
            <div className="mb-3">
              <Alert variant="info" className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Active Filters:</strong>
                  {filterType !== 'all' && <span className="ms-2 badge bg-primary">Type: {filterType}</span>}
                  {searchQuery.trim() && <span className="ms-2 badge bg-secondary">Search: "{searchQuery}"</span>}
                </div>
                <Button 
                  size="sm" 
                  variant="outline-secondary"
                  onClick={() => {
                    setFilterType('all');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </Alert>
            </div>
          )}

          {loading && (
            <div className="loading-container">
              <Spinner animation="border" className="loading-spinner" />
              <h4>Loading users...</h4>
              <p>Please wait while we fetch your users!</p>
            </div>
          )}
          
          {error && (
            <Alert variant="danger" className="error-alert" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert variant="success" className="success-alert" onClose={() => setSuccessMessage(null)} dismissible>
              {successMessage}
            </Alert>
          )}
          
          {!loading && !error && users.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><i className="bi bi-people"></i></div>
              <h4>No Users Found</h4>
              <p>
                {(filterType !== 'all' || searchQuery.trim()) 
                  ? "No users match your current filters. Try adjusting your search or filter criteria."
                  : "No users available. Add a new user to get started!"
                }
              </p>
              {(loggedInUserRole === 'super_admin') && (
                <Button className="btn-add-user" onClick={() => setShowAddModal(true)}>
                  <FaPlus className="me-2" /> Add First User
                </Button>
              )}
            </div>
          )}
          
          {!loading && !error && users.length > 0 && (
            <>
              <div className="table-responsive">
                <Table className="users-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Contact</th>
                      <th>User Type</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td><span className="user-id">{user.id}</span></td>
                        <td><span className="user-name">{truncateText(user.first_name)}</span></td>
                        <td><span className="user-name">{truncateText(user.last_name)}</span></td>
                        <td><span className="user-email">{truncateText(user.email)}</span></td>
                        <td><span className="user-contact">{truncateText(user.contact)}</span></td>
                        <td><span className="user-type">{user.user_type}</span></td> {/* Removed badge classes */}
                        <td><span className="user-date">{new Date(user.created_at).toLocaleDateString()}</span></td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="info" size="sm" onClick={() => handleViewClick(user)} title="View">
                              <FaEye />
                            </Button>
                            <Button variant="warning" size="sm" onClick={() => handleEditClick(user)} title="Edit" disabled={user.id === loggedInUserId && user.user_type === 'super_admin'}>
                              <FaEdit />
                            </Button>
                            {(loggedInUserRole === 'super_admin' && user.user_type !== 'super_admin') ||
                             (loggedInUserRole === 'admin' && user.user_type === 'user') ? (
                              <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id, user.user_type)} title="Delete" disabled={user.id === loggedInUserId}>
                                <FaTrash />
                              </Button>
                            ) : (loggedInUserRole === 'super_admin' && user.user_type === 'super_admin' && user.id !== loggedInUserId) ? (
                              <Button variant="info" size="sm" onClick={() => handleDemoteSuperAdmin(user.id)} title="Demote SA to Admin" disabled={user.id === loggedInUserId}>
                                <FaEdit />
                              </Button>
                            ) : (
                              <Button variant="secondary" size="sm" disabled title="No Action">
                                <FaEye />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <Pagination className="custom-pagination">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  </Pagination>
                  <div className="pagination-info">Page {currentPage} of {totalPages}</div>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* View User Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewUser && (
            <div className="user-detail-info">
              <h4 className="user-detail-name">{`${viewUser.first_name} ${viewUser.last_name}`}</h4>
              <div className="user-detail-row"><strong>ID:</strong> {viewUser.id}</div>
              <div className="user-detail-row"><strong>Email:</strong> {viewUser.email}</div>
              <div className="user-detail-row"><strong>Contact:</strong> {viewUser.contact}</div>
              <div className="user-detail-row">
                <strong>User Type:</strong> 
                <span className="ms-2 user-type">{viewUser.user_type}</span> {/* Removed badge classes */}
              </div>
              <div className="user-detail-row"><strong>Created At:</strong> {new Date(viewUser.created_at).toLocaleDateString()}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          <Button className="btn-add-user" onClick={() => { setShowViewModal(false); handleEditClick(viewUser); }} disabled={viewUser && viewUser.id === loggedInUserId && viewUser.user_type === 'super_admin'}>
            <FaEdit className="me-2" /> Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Password
                {formData.user_type !== 'user' && " (Auto-generated for Admin/Super Admin)"}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required={formData.user_type === 'user'}
                disabled={formData.user_type !== 'user'}
                placeholder={formData.user_type !== 'user' ? "Password will be emailed" : "Enter password"}
              />
            </Form.Group>
            {(loggedInUserRole === 'super_admin') && (
              <Form.Group className="mb-3">
                <Form.Label>User Type</Form.Label>
                <Form.Select name="user_type" value={formData.user_type} onChange={handleInputChange}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </Form.Select>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button className="btn-add-user" onClick={handleAddUser}>
            <FaPlus className="me-2" /> Add User
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} readOnly disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control type="text" name="contact" value={formData.contact} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password (leave blank to keep current)</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} />
            </Form.Group>
            {(loggedInUserRole === 'super_admin') && (
              <Form.Group className="mb-3">
                <Form.Label>User Type</Form.Label>
                <Form.Select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  disabled={currentUser && currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin'}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </Form.Select>
                {currentUser && currentUser.id === loggedInUserId && currentUser.user_type === 'super_admin' && (
                  <Form.Text className="text-muted">
                    You cannot change your own Super Admin role here.
                  </Form.Text>
                )}
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button className="btn-add-user" onClick={handleUpdateUser}>
            <FaEdit className="me-2" /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;