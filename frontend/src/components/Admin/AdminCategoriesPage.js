// // src/components/Admin/AdminCategoriesPage.js
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate

// const AdminCategoriesPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State for Add/Edit Modals
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null); // Category being edited

//   // State for form fields
//   const [formData, setFormData] = useState({
//     name: '',
//     description: ''
//   });

//   // State for pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState(''); // For search input

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate(); // <--- Initialize useNavigate

//   // Helper function to handle unauthorized errors
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token'); // Clear the token
//     navigate('/login'); // Redirect to login page
//   }, [navigate]);

//   // --- Fetch Categories ---
//   const fetchCategories = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in.");
//         return; // Exit if no token
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10, // You can adjust per_page
//         search: searchQuery
//       });

//       const response = await fetch(`${API_BASE_URL}/categories/?${params.toString()}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) { // Check for Unauthorized status
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to fetch categories.');
//       }
//       const data = await response.json();
//       setCategories(data.categories || []);
//       setTotalPages(data.pages || 1);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, handleAuthError]); // Added handleAuthError to dependencies

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]); // Initial fetch and re-fetch when fetchCategories function changes

//   // --- Handle Form Changes ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // --- Add Category ---
//   const handleAddCategory = async () => {
//     const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     if (!formData.name) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/create`, { // POST /api/v1/categories/create
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) { // Check for Unauthorized status
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to add category.');
//       }

//       alert('Category added successfully!');
//       setShowAddModal(false);
//       setFormData({ name: '', description: '' }); // Clear form
//       fetchCategories(); // Refresh category list
//     } catch (err) {
//       console.error("Error adding category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   // --- Edit Category ---
//   const handleEditClick = (category) => {
//     setCurrentCategory(category);
//     setFormData({
//       name: category.name,
//       description: category.description || ''
//     });
//     setShowEditModal(true);
//   };

//   const handleUpdateCategory = async () => {
//     const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//     if (!token || !currentCategory) {
//       handleAuthError("Authentication token missing or no category selected for edit.");
//       return;
//     }

//     if (!formData.name) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/update/${currentCategory.id}`, { // PUT /api/v1/categories/update/<id>
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) { // Check for Unauthorized status
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to update category.');
//       }

//       alert('Category updated successfully!');
//       setShowEditModal(false);
//       setCurrentCategory(null);
//       setFormData({ name: '', description: '' });
//       fetchCategories(); // Refresh category list
//     } catch (err) {
//       console.error("Error updating category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   // --- Delete Category ---
//   const handleDeleteCategory = async (categoryId) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) {
//       return;
//     }

//     const token = sessionStorage.getItem('token'); // <--- Changed to sessionStorage
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/delete/${categoryId}`, { // DELETE /api/v1/categories/delete/<id>
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) { // Check for Unauthorized status
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to delete category.');
//       }

//       alert('Category deleted successfully!');
//       fetchCategories(); // Refresh category list
//     } catch (err) {
//       console.error("Error deleting category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   // --- Pagination Handlers ---
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // --- Render ---
//   return (
//     <div className="container mt-4">
//       <h2>Categories Management</h2>

//       <div className="d-flex justify-content-between mb-3">
//         <Button variant="success" onClick={() => setShowAddModal(true)}>
//           Add New Category
//         </Button>
//         <Form.Group className="mb-0">
//           <Form.Control
//             type="text"
//             placeholder="Search categories..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             style={{ width: '250px' }}
//           />
//         </Form.Group>
//       </div>

//       {loading && (
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">Loading categories...</span>
//           </Spinner>
//           <p>Loading categories...</p>
//         </div>
//       )}

//       {error && <Alert variant="danger">Error: {error}</Alert>}

//       {!loading && !error && categories.length === 0 && (
//         <Alert variant="info">No categories found. Add a new one!</Alert>
//       )}

//       {!loading && !error && categories.length > 0 && (
//         <>
//           <Table striped bordered hover responsive className="mt-3">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Description</th>
//                 <th>Created At</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((category) => (
//                 <tr key={category.id}>
//                   <td>{category.id}</td>
//                   <td>{category.name}</td>
//                   <td>{category.description || 'N/A'}</td>
//                   <td>{new Date(category.date_created).toLocaleDateString()}</td>
//                   <td>
//                     <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(category)}>
//                       Edit
//                     </Button>
//                     <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)}>
//                       Delete
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>

//           <Pagination className="justify-content-center mt-3">
//             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//             {[...Array(totalPages)].map((_, index) => (
//               <Pagination.Item
//                 key={index + 1}
//                 active={index + 1 === currentPage}
//                 onClick={() => handlePageChange(index + 1)}
//               >
//                 {index + 1}
//               </Pagination.Item>
//             ))}
//             <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//           </Pagination>
//         </>
//       )}

//       {/* Add Category Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add New Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleAddCategory}>
//             Add Category
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit Category Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleUpdateCategory}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminCategoriesPage;




// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import './styles/AdminCategoriesPage.css'; // New CSS file

// const AdminCategoriesPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   const fetchCategories = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery
//       });

//       const response = await fetch(`${API_BASE_URL}/categories/?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to fetch categories.');
//       }
//       const data = await response.json();
//       setCategories(data.categories || []);
//       setTotalPages(data.pages || 1);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, handleAuthError]);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddCategory = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     if (!formData.name) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to add category.');
//       }

//       alert('Category added successfully!');
//       setShowAddModal(false);
//       setFormData({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error("Error adding category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleEditClick = (category) => {
//     setCurrentCategory(category);
//     setFormData({ name: category.name, description: category.description || '' });
//     setShowEditModal(true);
//   };

//   const handleUpdateCategory = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentCategory) {
//       handleAuthError("Authentication token missing or no category selected for edit.");
//       return;
//     }

//     if (!formData.name) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/update/${currentCategory.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to update category.');
//       }

//       alert('Category updated successfully!');
//       setShowEditModal(false);
//       setCurrentCategory(null);
//       setFormData({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error("Error updating category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/delete/${categoryId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to delete category.');
//       }

//       alert('Category deleted successfully!');
//       fetchCategories();
//     } catch (err) {
//       console.error("Error deleting category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <div className="categories-container">
//       <div className="categories-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">CATEGORIES</h1>
//             <p className="page-subtitle">Manage your adorable categories!</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search categories..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//             </div>
//             <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Category
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Row className="stats-row g-3 mb-4">
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{categories.length}</div>
//                 <div className="stat-label">Total Categories</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Card className="content-card">
//         <Card.Body>
//           {loading && (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading categories...</h4>
//               <p>Please wait while we fetch your categories!</p>
//             </div>
//           )}
//           {error && <Alert variant="danger" className="error-alert">{error}</Alert>}
//           {!loading && !error && categories.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-folder"></i></div>
//               <h4>No Categories Found</h4>
//               <p>Add your first cute category to get started!</p>
//               <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add First Category
//               </Button>
//             </div>
//           )}
//           {!loading && !error && categories.length > 0 && (
//             <>
//               <div className="table-responsive">
//                 <Table className="categories-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Description</th>
//                       <th>Created At</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {categories.map((category) => (
//                       <tr key={category.id}>
//                         <td><span className="category-id">{category.id}</span></td>
//                         <td><span className="category-name">{category.name}</span></td>
//                         <td><span className="category-description">{category.description || 'N/A'}</span></td>
//                         <td><span className="category-date">{new Date(category.date_created).toLocaleDateString()}</span></td>
//                         <td>
//                           <div className="action-buttons">
//                             <Button variant="warning" size="sm" onClick={() => handleEditClick(category)} title="Edit">
//                               <FaEdit />
//                             </Button>
//                             <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)} title="Delete">
//                               <FaTrash />
//                             </Button>
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

//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={handleAddCategory}>
//             <FaPlus className="me-2" /> Add Category
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={handleUpdateCategory}>
//             <FaEdit className="me-2" /> Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminCategoriesPage;










// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import './styles/AdminCategoriesPage.css';

// const AdminCategoriesPage = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [viewCategory, setViewCategory] = useState(null);
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');
//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   const fetchCategories = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage,
//         per_page: 10,
//         search: searchQuery
//       });

//       const response = await fetch(`${API_BASE_URL}/categories/?${params.toString()}`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to fetch categories.');
//       }
//       const data = await response.json();
//       setCategories(data.categories || []);
//       setTotalPages(data.pages || 1);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, handleAuthError]);

//   useEffect(() => {
//     fetchCategories();
//   }, [fetchCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddCategory = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     if (!formData.name) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to add category.');
//       }

//       alert('Category added successfully!');
//       setShowAddModal(false);
//       setFormData({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error("Error adding category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleEditClick = (category) => {
//     setCurrentCategory(category);
//     setFormData({ name: category.name, description: category.description || '' });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (category) => {
//     setViewCategory(category);
//     setShowViewModal(true);
//   };

//   const handleUpdateCategory = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentCategory) {
//       handleAuthError("Authentication token missing or no category selected for edit.");
//       return;
//     }

//     if (!formData.name) {
//       alert("Category name is required.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/update/${currentCategory.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to update category.');
//       }

//       alert('Category updated successfully!');
//       setShowEditModal(false);
//       setCurrentCategory(null);
//       setFormData({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error("Error updating category:", err);
//       alert(`Error: ${err.message}`);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError("Authentication token missing. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/delete/${categoryId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401) {
//           handleAuthError(errorData.message || "Authentication failed. Please log in again.");
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to delete category.');
//       }

//       alert('Category deleted successfully!');
//       fetchCategories();
//     } catch (err) {
//       console.error("Error deleting category:", err);
//       alert(`Error: ${err.message}`);
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
//     <div className="categories-container">
//       <div className="categories-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">CATEGORIES</h1>
//             <p className="page-subtitle">Manage your adorable categories!</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search categories..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="search-input"
//               />
//             </div>
//             <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Category
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Row className="stats-row g-3 mb-4">
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{categories.length}</div>
//                 <div className="stat-label">Total Categories</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Card className="content-card">
//         <Card.Body>
//           {loading && (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading categories...</h4>
//               <p>Please wait while we fetch your categories!</p>
//             </div>
//           )}
//           {error && <Alert variant="danger" className="error-alert">{error}</Alert>}
//           {!loading && !error && categories.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-folder"></i></div>
//               <h4>No Categories Found</h4>
//               <p>Add your first cute category to get started!</p>
//               <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add First Category
//               </Button>
//             </div>
//           )}
//           {!loading && !error && categories.length > 0 && (
//             <>
//               <div className="table-responsive">
//                 <Table className="categories-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Description</th>
//                       <th>Created At</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {categories.map((category) => (
//                       <tr key={category.id}>
//                         <td><span className="category-id">{category.id}</span></td>
//                         <td><span className="category-name">{truncateText(category.name)}</span></td>
//                         <td><span className="category-description">{truncateText(category.description)}</span></td>
//                         <td><span className="category-date">{new Date(category.date_created).toLocaleDateString()}</span></td>
//                         <td>
//                           <div className="action-buttons">
//                             <Button variant="info" size="sm" onClick={() => handleViewClick(category)} title="View">
//                               <FaEye />
//                             </Button>
//                             <Button variant="warning" size="sm" onClick={() => handleEditClick(category)} title="Edit">
//                               <FaEdit />
//                             </Button>
//                             <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)} title="Delete">
//                               <FaTrash />
//                             </Button>
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
//           <Modal.Title>Category Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewCategory && (
//             <div className="product-detail-info">
//               <h4 className="category-detail-name">{viewCategory.name}</h4>
//               <div className="category-detail-row"><strong>ID:</strong> {viewCategory.id}</div>
//               <div className="category-detail-row"><strong>Description:</strong> {viewCategory.description || 'N/A'}</div>
//               <div className="category-detail-row"><strong>Created At:</strong> {new Date(viewCategory.date_created).toLocaleDateString()}</div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={() => { setShowViewModal(false); handleEditClick(viewCategory); }}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={handleAddCategory}>
//             <FaPlus className="me-2" /> Add Category
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={handleUpdateCategory}>
//             <FaEdit className="me-2" /> Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminCategoriesPage;



// // Import Statements
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
// import { jwtDecode } from 'jwt-decode';
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import API_BASE_URL from '../../config';
// import './styles/global.css'; // New CSS file
// import './styles/AdminCategoriesPage.css'; // New CSS file

// // Component Definition
// const AdminCategoriesPage = () => {
//   // General State
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);

//   // State for Add/Edit/View Modals
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState(null);
//   const [viewCategory, setViewCategory] = useState(null);

//   // State for form fields
//   const [formData, setFormData] = useState({ name: '', description: '' });

//   // State for pagination, search, and filter
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchQuery, setSearchQuery] = useState('');

//   const [loggedInUserRole, setLoggedInUserRole] = useState('');
//   const [loggedInUserId, setLoggedInUserId] = useState(null);

//   // const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
//   const navigate = useNavigate();

//   // Utility Functions
//   const handleAuthError = useCallback((errMessage) => {
//     setError(errMessage);
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   }, [navigate]);

//   // Data Fetching
//   const fetchCategories = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     setSuccessMessage(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         handleAuthError('Authentication token missing. Please log in.');
//         return;
//       }

//       const params = new URLSearchParams({
//         page: currentPage.toString(),
//         per_page: '10',
//         search: searchQuery.trim(),
//       });

//       console.log(`Fetching categories from: ${API_BASE_URL}/categories/?${params.toString()}`);
//       const response = await fetch(`${API_BASE_URL}/categories/?${params.toString()}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.message || 'Authorization failed. You do not have permission.');
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to fetch categories.');
//       }

//       const data = await response.json();
//       console.log('API Response:', data);

//       setCategories(data.categories || []);
//       setTotalPages(data.pages || 1);

//       if (currentPage > (data.pages || 1) && (data.pages || 1) > 0) {
//         setCurrentPage(1);
//       }
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [currentPage, searchQuery, handleAuthError]);

//   // Effect Hooks
//   useEffect(() => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserRole(decodedToken.user_type || decodedToken.role || '');
//         setLoggedInUserId(decodedToken.sub);
//       } catch (err) {
//         console.error('Failed to decode token:', err);
//         setLoggedInUserRole('');
//         setLoggedInUserId(null);
//         handleAuthError('Invalid or expired token. Please log in again.');
//       }
//     } else {
//       handleAuthError('Authentication token missing. Please log in to view categories.');
//     }
//   }, [handleAuthError]);

//   useEffect(() => {
//     if (loggedInUserRole) {
//       fetchCategories();
//     }
//   }, [fetchCategories, loggedInUserRole]);

//   // Event Handlers
//   const handleSearchChange = useCallback((e) => {
//     const newSearchQuery = e.target.value;
//     console.log('Search changed to:', newSearchQuery);
//     setSearchQuery(newSearchQuery);
//     setCurrentPage(1);
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddCategory = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError('Authentication token missing. Please log in.');
//       return;
//     }

//     if (!formData.name) {
//       setError('Category name is required.');
//       return;
//     }

//     const payload = {
//       name: formData.name,
//       description: formData.description,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.message || 'Authentication/Authorization failed. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to add category.');
//       }

//       setSuccessMessage('Category added successfully!');
//       setShowAddModal(false);
//       setFormData({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error('Error adding category:', err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleEditClick = (category) => {
//     setCurrentCategory(category);
//     setFormData({
//       name: category.name,
//       description: category.description || '',
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (category) => {
//     setViewCategory(category);
//     setShowViewModal(true);
//   };

//   const handleUpdateCategory = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentCategory) {
//       handleAuthError('Authentication token missing or no category selected for edit.');
//       return;
//     }

//     if (!formData.name) {
//       setError('Category name is required.');
//       return;
//     }

//     const payload = {
//       name: formData.name,
//       description: formData.description,
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/update/${currentCategory.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.message || 'Authentication/Authorization failed. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to update category.');
//       }

//       setSuccessMessage('Category updated successfully!');
//       setShowEditModal(false);
//       setCurrentCategory(null);
//       setFormData({ name: '', description: '' });
//       fetchCategories();
//     } catch (err) {
//       console.error('Error updating category:', err);
//       setError(`Error: ${err.message}`);
//     }
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;

//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       handleAuthError('Authentication token missing. Please log in.');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/categories/delete/${categoryId}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         if (response.status === 401 || response.status === 403) {
//           handleAuthError(errorData.message || 'Authentication/Authorization failed. Please log in again.');
//           return;
//         }
//         throw new Error(errorData.message || 'Failed to delete category.');
//       }

//       setSuccessMessage('Category deleted successfully!');
//       fetchCategories();
//     } catch (err) {
//       console.error('Error deleting category:', err);
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
//       searchQuery,
//       currentPage,
//       totalCategories: categories.length,
//       totalPages,
//     });
//   };

//   // Render Logic
//   return (
//     <div className="categories-container">
//       <div className="categories-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">MANAGE CATEGORIES</h1>
//           </div>
//           <div className="header-actions">
//             <div className="stat-card-compact">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{categories.length}</div>
//                 <div className="stat-label">Total Categories</div>
//               </div>
//             </div>
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search categories..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="search-input"
//                 title="Search by name or description"
//               />
//             </div>
//             {loggedInUserRole === 'super_admin' && (
//               <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add New Category
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {searchQuery.trim() && (
//         <div className="mb-3">
//           <Alert variant="info" className="d-flex justify-content-between align-items-center">
//             <div>
//               <strong>Active Filters:</strong>
//               {searchQuery.trim() && <span className="ms-2 badge bg-secondary">Search: "{searchQuery}"</span>}
//             </div>
//             <Button
//               size="sm"
//               variant="outline-secondary"
//               onClick={() => {
//                 setSearchQuery('');
//                 setCurrentPage(1);
//               }}
//             >
//               Clear Filters
//             </Button>
//           </Alert>
//         </div>
//       )}

//       <Card className="content-card">
//         <Card.Body>
//           {loading && (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading categories...</h4>
//               <p>Please wait while we fetch your categories!</p>
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
//           {!loading && !error && categories.length === 0 && (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-folder"></i></div>
//               <h4>No Categories Found</h4>
//               <p>
//                 {searchQuery.trim()
//                   ? 'No categories match your current search. Try adjusting your search criteria.'
//                   : 'No categories available. Add a new category to get started!'
//                 }
//               </p>
//               {loggedInUserRole === 'super_admin' && (
//                 <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
//                   <FaPlus className="me-2" /> Add First Category
//                 </Button>
//               )}
//             </div>
//           )}
//           {!loading && !error && categories.length > 0 && (
//             <>
//               <div className="table-responsive">
//                 <Table className="categories-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Name</th>
//                       <th>Description</th>
//                       <th>Created At</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {categories.map((category) => (
//                       <tr key={category.id}>
//                         <td><span className="category-id">{category.id}</span></td>
//                         <td><span className="category-name">{truncateText(category.name)}</span></td>
//                         <td><span className="category-description">{truncateText(category.description)}</span></td>
//                         <td><span className="category-date">{new Date(category.date_created).toLocaleDateString()}</span></td>
//                         <td>
//                           <div className="action-buttons">
//                             <Button variant="info" size="sm" onClick={() => handleViewClick(category)} title="View">
//                               <FaEye />
//                             </Button>
//                             <Button variant="warning" size="sm" onClick={() => handleEditClick(category)} title="Edit" disabled={loggedInUserRole !== 'super_admin'}>
//                               <FaEdit />
//                             </Button>
//                             {loggedInUserRole === 'super_admin' && (
//                               <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)} title="Delete">
//                                 <FaTrash />
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

//       {/* View Category Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Category Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewCategory && (
//             <div className="category-detail-info">
//               <h4 className="category-detail-name">{viewCategory.name}</h4>
//               <div className="category-detail-row"><strong>ID:</strong> {viewCategory.id}</div>
//               <div className="category-detail-row"><strong>Description:</strong> {viewCategory.description || 'N/A'}</div>
//               <div className="category-detail-row"><strong>Created At:</strong> {new Date(viewCategory.date_created).toLocaleDateString()}</div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           {loggedInUserRole === 'super_admin' && (
//             <Button className="btn-add-category" onClick={() => { setShowViewModal(false); handleEditClick(viewCategory); }}>
//               <FaEdit className="me-2" /> Edit
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       {/* Add Category Modal */}
//       <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={handleAddCategory}>
//             <FaPlus className="me-2" /> Add Category
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit Category Modal */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Category</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
//           <Button className="btn-add-category" onClick={handleUpdateCategory}>
//             <FaEdit className="me-2" /> Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// // Export
// export default AdminCategoriesPage;


// Import Statements
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, Modal, Form, Spinner, Alert, Pagination, Row, Col, Card } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import './styles/global.css'; // New CSS file
import './styles/AdminCategoriesPage.css'; // New CSS file

// Component Definition
const AdminCategoriesPage = () => {
  // General State
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // State for Add/Edit/View Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);

  // State for form fields
  const [formData, setFormData] = useState({ name: '', description: '' });

  // State for pagination, search, and filter
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [loggedInUserRole, setLoggedInUserRole] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // ✅ Fixed API endpoints to match your backend pattern
  const CATEGORIES_API_URL = `${API_BASE_URL}/api/v1/categories`;
  const navigate = useNavigate();

  // Utility Functions
  const handleAuthError = useCallback((errMessage) => {
    setError(errMessage);
    sessionStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  // Data Fetching
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        handleAuthError('Authentication token missing. Please log in.');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '10',
        search: searchQuery.trim(),
      });

      // ✅ Updated endpoint URL
      const fetchUrl = `${CATEGORIES_API_URL}/?${params.toString()}`;
      console.log(`Fetching categories from: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Categories API Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('Categories API Error:', errorData);
        
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.message || 'Authorization failed. You do not have permission.');
          return;
        }
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch categories.`);
      }

      const data = await response.json();
      console.log('Categories API Response Data:', data);

      // ✅ Handle different possible response structures
      if (data.categories) {
        setCategories(data.categories);
        setTotalPages(data.pages || 1);
      } else if (Array.isArray(data)) {
        setCategories(data);
        setTotalPages(1);
      } else {
        setCategories([]);
        setTotalPages(1);
      }

      if (currentPage > (data.pages || 1) && (data.pages || 1) > 0) {
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(`Failed to load categories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, handleAuthError, CATEGORIES_API_URL]);

  // Effect Hooks
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded token for categories:', decodedToken);
        setLoggedInUserRole(decodedToken.user_type || decodedToken.role || '');
        setLoggedInUserId(decodedToken.sub);
      } catch (err) {
        console.error('Failed to decode token:', err);
        setLoggedInUserRole('');
        setLoggedInUserId(null);
        handleAuthError('Invalid or expired token. Please log in again.');
      }
    } else {
      handleAuthError('Authentication token missing. Please log in to view categories.');
    }
  }, [handleAuthError]);

  useEffect(() => {
    if (loggedInUserRole) {
      console.log('User role confirmed, fetching categories...');
      fetchCategories();
    }
  }, [fetchCategories, loggedInUserRole]);

  // Event Handlers
  const handleSearchChange = useCallback((e) => {
    const newSearchQuery = e.target.value;
    console.log('Search changed to:', newSearchQuery);
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError('Authentication token missing. Please log in.');
      return;
    }

    if (!formData.name) {
      setError('Category name is required.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    try {
      // ✅ Updated endpoint URL
      const response = await fetch(`${CATEGORIES_API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.message || 'Authentication/Authorization failed. Please log in again.');
          return;
        }
        throw new Error(errorData.message || 'Failed to add category.');
      }

      setSuccessMessage('Category added successfully!');
      setShowAddModal(false);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.error('Error adding category:', err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowEditModal(true);
  };

  const handleViewClick = (category) => {
    setViewCategory(category);
    setShowViewModal(true);
  };

  const handleUpdateCategory = async () => {
    const token = sessionStorage.getItem('token');
    if (!token || !currentCategory) {
      handleAuthError('Authentication token missing or no category selected for edit.');
      return;
    }

    if (!formData.name) {
      setError('Category name is required.');
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    try {
      // ✅ Updated endpoint URL
      const response = await fetch(`${CATEGORIES_API_URL}/update/${currentCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.message || 'Authentication/Authorization failed. Please log in again.');
          return;
        }
        throw new Error(errorData.message || 'Failed to update category.');
      }

      setSuccessMessage('Category updated successfully!');
      setShowEditModal(false);
      setCurrentCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(`Error: ${err.message}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
      handleAuthError('Authentication token missing. Please log in.');
      return;
    }

    try {
      // ✅ Updated endpoint URL
      const response = await fetch(`${CATEGORIES_API_URL}/delete/${categoryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        if (response.status === 401 || response.status === 403) {
          handleAuthError(errorData.message || 'Authentication/Authorization failed. Please log in again.');
          return;
        }
        throw new Error(errorData.message || 'Failed to delete category.');
      }

      setSuccessMessage('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
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
      searchQuery,
      currentPage,
      totalCategories: categories.length,
      totalPages,
    });
  };

  // Render Logic
  return (
    <div className="categories-container">
      <div className="categories-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">MANAGE CATEGORIES</h1>
          </div>
          <div className="header-actions">
            <div className="stat-card-compact">
              <div className="stat-content text-center">
                <div className="stat-number">{categories.length}</div>
                <div className="stat-label">Total Categories</div>
              </div>
            </div>
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
                title="Search by name or description"
              />
            </div>
            {loggedInUserRole === 'super_admin' && (
              <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" /> Add New Category
              </Button>
            )}
          </div>
        </div>
      </div>

      {searchQuery.trim() && (
        <div className="mb-3">
          <Alert variant="info" className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Active Filters:</strong>
              {searchQuery.trim() && <span className="ms-2 badge bg-secondary">Search: "{searchQuery}"</span>}
            </div>
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </Alert>
        </div>
      )}

      <Card className="content-card">
        <Card.Body>
          {loading && (
            <div className="loading-container">
              <Spinner animation="border" className="loading-spinner" />
              <h4>Loading categories...</h4>
              <p>Please wait while we fetch your categories!</p>
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
          {!loading && !error && categories.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon"><i className="bi bi-folder"></i></div>
              <h4>No Categories Found</h4>
              <p>
                {searchQuery.trim()
                  ? 'No categories match your current search. Try adjusting your search criteria.'
                  : 'No categories available. Add a new category to get started!'
                }
              </p>
              {loggedInUserRole === 'super_admin' && (
                <Button className="btn-add-category" onClick={() => setShowAddModal(true)}>
                  <FaPlus className="me-2" /> Add First Category
                </Button>
              )}
            </div>
          )}
          {!loading && !error && categories.length > 0 && (
            <>
              <div className="table-responsive">
                <Table className="categories-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td><span className="category-id">{category.id}</span></td>
                        <td><span className="category-name">{truncateText(category.name)}</span></td>
                        <td><span className="category-description">{truncateText(category.description)}</span></td>
                        <td><span className="category-date">{new Date(category.date_created).toLocaleDateString()}</span></td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="info" size="sm" onClick={() => handleViewClick(category)} title="View">
                              <FaEye />
                            </Button>
                            <Button variant="warning" size="sm" onClick={() => handleEditClick(category)} title="Edit" disabled={loggedInUserRole !== 'super_admin'}>
                              <FaEdit />
                            </Button>
                            {loggedInUserRole === 'super_admin' && (
                              <Button variant="danger" size="sm" onClick={() => handleDeleteCategory(category.id)} title="Delete">
                                <FaTrash />
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

      {/* View Category Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewCategory && (
            <div className="category-detail-info">
              <h4 className="category-detail-name">{viewCategory.name}</h4>
              <div className="category-detail-row"><strong>ID:</strong> {viewCategory.id}</div>
              <div className="category-detail-row"><strong>Description:</strong> {viewCategory.description || 'N/A'}</div>
              <div className="category-detail-row"><strong>Created At:</strong> {new Date(viewCategory.date_created).toLocaleDateString()}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          {loggedInUserRole === 'super_admin' && (
            <Button className="btn-add-category" onClick={() => { setShowViewModal(false); handleEditClick(viewCategory); }}>
              <FaEdit className="me-2" /> Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Add Category Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button className="btn-add-category" onClick={handleAddCategory}>
            <FaPlus className="me-2" /> Add Category
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button className="btn-add-category" onClick={handleUpdateCategory}>
            <FaEdit className="me-2" /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Export
export default AdminCategoriesPage;