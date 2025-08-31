// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Modal, Form, Spinner, Alert, Pagination, Card, Row, Col, Button } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import './styles/AdminProductsPage.css';

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [viewProduct, setViewProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     brand: '',
//     description: '',
//     price: '',
//     category_id: '',
//     image_url: '',
//     stock: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 10;
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [stockFilter, setStockFilter] = useState('');

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         search: searchQuery,
//         page: currentPage,
//         limit: productsPerPage
//       });

//       const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || 'Failed to fetch products.');

//       let filteredProducts = data.products || [];
//       if (categoryFilter) {
//         filteredProducts = filteredProducts.filter(p => p.category?.id === parseInt(categoryFilter));
//       }
//       if (stockFilter) {
//         filteredProducts = filteredProducts.filter(p => {
//           if (stockFilter === 'in') return p.stock >= 10;
//           if (stockFilter === 'low') return p.stock > 0 && p.stock < 10;
//           if (stockFilter === 'out') return p.stock === 0;
//           return true;
//         });
//       }

//       setProducts(filteredProducts);
//       if (data.total_count !== undefined) {
//         setTotalPages(Math.ceil(data.total_count / productsPerPage));
//       }
//     } catch (err) {
//       console.error("Fetch products error:", err);
//       setError(err.message);
//       toast.error(`Error fetching products: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, searchQuery, currentPage, categoryFilter, stockFilter]);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/categories/?page=1&per_page=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch categories.');
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//       toast.error(`Error fetching categories: ${err.message}`);
//     }
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//   }, [fetchProducts, fetchCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearForm = () => {
//     setFormData({ name: '', brand: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
//   };

//   const handleAddProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       toast.error("Authentication token missing. Please log in.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to add product.');
//       }

//       toast.success('Product added successfully!');
//       setShowAddModal(false);
//       clearForm();
//       setCurrentPage(1);
//       fetchProducts();
//     } catch (err) {
//       console.error("Add product error:", err);
//       toast.error(`Error adding product: ${err.message}`);
//     }
//   };

//   const handleEditClick = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       name: product.name,
//       brand: product.brand || '',
//       description: product.description || '',
//       price: product.price,
//       category_id: product.category?.id || product.category_id || '',
//       image_url: product.image_url || '',
//       stock: product.stock
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (product) => {
//     setViewProduct(product);
//     setShowViewModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentProduct) {
//       toast.error("Authentication token missing or no product selected for edit.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update product.');
//       }

//       toast.success('Product updated successfully!');
//       setShowEditModal(false);
//       setCurrentProduct(null);
//       clearForm();
//       fetchProducts();
//     } catch (err) {
//       console.error("Update product error:", err);
//       toast.error(`Error updating product: ${err.message}`);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !productIdToDelete) {
//       toast.error("Authentication token missing or no product selected for deletion.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/delete/${productIdToDelete}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete product.');
//       }

//       toast.success('Product deleted successfully!');
//       setShowDeleteModal(false);
//       setProductIdToDelete(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete product error:", err);
//       toast.error(`Error deleting product: ${err.message}`);
//     }
//   };

//   const openDeleteModal = (productId) => {
//     setProductIdToDelete(productId);
//     setShowDeleteModal(true);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleFilterChange = (setter) => (e) => {
//     setter(e.target.value);
//     setCurrentPage(1);
//   };

//   const getStockIcon = (stock) => {
//     if (stock === 0) return { icon: FaTimes, variant: 'danger', text: 'Out of Stock' };
//     if (stock < 10) return { icon: FaExclamationTriangle, variant: 'warning', text: 'Low Stock' };
//     return { icon: FaCheck, variant: 'success', text: 'In Stock' };
//   };

//   const getCategoryColor = () => {
//     return '--grey-dark';
//   };

//   return (
//     <div className="products-container">
//       <div className="products-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">PRODUCTS</h1>
//             <p className="page-subtitle">Manage your product inventory.</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                 className="search-input"
//               />
//             </div>
//             <div className="filter-group">
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="filter-select">
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </Form.Select>
//               </div>
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={stockFilter} onChange={handleFilterChange(setStockFilter)} className="filter-select">
//                   <option value="">All Stock Status</option>
//                   <option value="in">In Stock</option>
//                   <option value="low">Low Stock</option>
//                   <option value="out">Out of Stock</option>
//                 </Form.Select>
//               </div>
//             </div>
//             <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Product
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Row className="stats-row g-3 mb-4">
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{products.length}</div>
//                 <div className="stat-label">Total Products</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{categories.length}</div>
//                 <div className="stat-label">Categories</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{products.filter(p => p.stock < 10).length}</div>
//                 <div className="stat-label">Low Stock</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{products.filter(p => p.stock === 0).length}</div>
//                 <div className="stat-label">Out of Stock</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Card className="content-card">
//         <Card.Body>
//           {loading ? (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading products...</h4>
//               <p>Please wait while we fetch your products</p>
//             </div>
//           ) : error ? (
//             <Alert variant="danger" className="error-alert">
//               <i className="bi bi-exclamation-triangle me-2"></i> Error: {error}
//             </Alert>
//           ) : products.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-box"></i></div>
//               <h4>No Products Found</h4>
//               <p>Start building your catalog by adding your first product</p>
//               <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add First Product
//               </Button>
//             </div>
//           ) : (
//             <>
//               <div className="table-responsive">
//                 <Table className="products-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Product</th>
//                       <th>Brand</th>
//                       <th>Description</th>
//                       <th>Price</th>
//                       <th>Category</th>
//                       <th>Stock</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map(product => {
//                       const stockInfo = getStockIcon(product.stock);
//                       const categoryColorVar = getCategoryColor();
//                       return (
//                         <tr key={product.id}>
//                           <td><span className="product-id" title={`ID: ${product.id}`}>{product.id}</span></td>
//                           <td>
//                             <div className="product-info">
//                               {product.image_url ? (
//                                 <img src={product.image_url} alt={product.name} className="product-thumbnail" />
//                               ) : (
//                                 <div className="product-thumbnail-placeholder"><i className="bi bi-image"></i></div>
//                               )}
//                               <div className="product-details">
//                                 <div className="product-name" title={product.name}>{truncateText(product.name, 25)}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td><span className="product-brand" title={product.brand}>{truncateText(product.brand, 15)}</span></td>
//                           <td><div className="product-description" title={product.description}>{truncateText(product.description, 20)}</div></td>
//                           <td><span className="product-price">{product.price?.toFixed(0)}</span></td>
//                           <td>
//                             <span style={{ color: `var(${categoryColorVar})` }} title={product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}>
//                               {truncateText(product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized', 20)}
//                             </span>
//                           </td>
//                           <td>
//                             <div className="stock-info">
//                               <span className={`stock-icon ${stockInfo.variant}`} title={`${stockInfo.text}`}>
//                                 {/* <stockInfo.icon />*/} {product.stock} 
//                               </span>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="action-buttons">
//                               <Button variant="info" size="sm" onClick={() => handleViewClick(product)} title="View">
//                                 <FaEye />
//                               </Button>
//                               <Button variant="success" size="sm" onClick={() => handleEditClick(product)} title="Edit">
//                                 <FaEdit />
//                               </Button>
//                               <Button variant="danger" size="sm" onClick={() => openDeleteModal(product.id)} title="Delete">
//                                 <FaTrash />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </Table>
//               </div>
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper">
//                   <Pagination className="custom-pagination">
//                     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                     {[...Array(totalPages).keys()].map(page => (
//                       <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
//                         {page + 1}
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

//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Product Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewProduct && (
//             <Row>
//               <Col md={4}>
//                 {viewProduct.image_url ? (
//                   <img src={viewProduct.image_url} alt={viewProduct.name} className="view-product-image" />
//                 ) : (
//                   <div className="view-product-placeholder">
//                     <i className="bi bi-image"></i>
//                     <p>No Image Available</p>
//                   </div>
//                 )}
//               </Col>
//               <Col md={8}>
//                 <div className="product-detail-info">
//                   <h4 className="product-detail-name">{viewProduct.name}</h4>
//                   <div className="product-detail-row"><strong>ID:</strong> {viewProduct.id}</div>
//                   <div className="product-detail-row"><strong>Brand:</strong> {viewProduct.brand || 'N/A'}</div>
//                   <div className="product-detail-row"><strong>Category:</strong> {viewProduct.category?.name || categories.find(cat => cat.id === viewProduct.category_id)?.name || 'Uncategorized'}</div>
//                   <div className="product-detail-row"><strong>Price:</strong> <span className="detail-price">{viewProduct.price?.toFixed(0)}</span></div>
//                   <div className="product-detail-row"><strong>Stock:</strong> {viewProduct.stock} - {getStockIcon(viewProduct.stock).text}</div>
//                   <div className="product-detail-row"><strong>Description:</strong> <div className="detail-description">{viewProduct.description || 'No description available'}</div></div>
//                   {viewProduct.image_url && <div className="product-detail-row"><strong>Image URL:</strong> <div className="detail-url">{viewProduct.image_url}</div></div>}
//                 </div>
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-product" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Name *</Form.Label>
//                 <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Brand</Form.Label>
//                 <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Price *</Form.Label>
//                 <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Stock Quantity *</Form.Label>
//                 <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" required />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category *</Form.Label>
//                 <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                   <option value="">Select a category</option>
//                   {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Image URL</Form.Label>
//                 <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" />
//               </Form.Group>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowAddModal(false); clearForm(); }}>Cancel</Button>
//           <Button className="btn-add-product" onClick={handleAddProduct}><FaPlus className="me-2" /> Add Product</Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Name *</Form.Label>
//                 <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Brand</Form.Label>
//                 <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Price *</Form.Label>
//                 <Form.Control type="number" step="100" name="price" value={formData.price} onChange={handleInputChange} required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Stock Quantity *</Form.Label>
//                 <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category *</Form.Label>
//                 <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                   <option value="">Select a category</option>
//                   {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Image URL</Form.Label>
//                 <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//               </Form.Group>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowEditModal(false); clearForm(); }}>Cancel</Button>
//           <Button className="btn-add-product" onClick={handleUpdateProduct}><FaEdit className="me-2" /> Save Changes</Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="delete-confirmation">
//             <div className="delete-icon"><FaTrash /></div>
//             <h5>Delete Product</h5>
//             <p>Are you sure you want to delete this product? This action cannot be undone.</p>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>Cancel</Button>
//           <Button variant="danger" onClick={handleDeleteProduct}><FaTrash className="me-2" /> Delete</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminProductsPage;





// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Modal, Form, Spinner, Alert, Pagination, Card, Row, Col, Button } from 'react-bootstrap';
// import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter, FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// // import './styles/global.css';
// import './styles/AdminProductsPage.css';

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [viewProduct, setViewProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     brand: '',
//     description: '',
//     price: '',
//     category_id: '',
//     image_url: '',
//     stock: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 10;
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [stockFilter, setStockFilter] = useState('');

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         search: searchQuery,
//         page: currentPage,
//         limit: productsPerPage
//       });

//       const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || 'Failed to fetch products.');

//       let filteredProducts = data.products || [];
//       if (categoryFilter) {
//         filteredProducts = filteredProducts.filter(p => p.category?.id === parseInt(categoryFilter));
//       }
//       if (stockFilter) {
//         filteredProducts = filteredProducts.filter(p => {
//           if (stockFilter === 'in') return p.stock >= 10;
//           if (stockFilter === 'low') return p.stock > 0 && p.stock < 10;
//           if (stockFilter === 'out') return p.stock === 0;
//           return true;
//         });
//       }

//       setProducts(filteredProducts);
//       if (data.total_count !== undefined) {
//         setTotalPages(Math.ceil(data.total_count / productsPerPage));
//       }
//     } catch (err) {
//       console.error("Fetch products error:", err);
//       setError(err.message);
//       toast.error(`Error fetching products: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, searchQuery, currentPage, categoryFilter, stockFilter]);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/categories/?page=1&per_page=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch categories.');
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//       toast.error(`Error fetching categories: ${err.message}`);
//     }
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//   }, [fetchProducts, fetchCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearForm = () => {
//     setFormData({ name: '', brand: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
//   };

//   const handleAddProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       toast.error("Authentication token missing. Please log in.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to add product.');
//       }

//       toast.success('Product added successfully!');
//       setShowAddModal(false);
//       clearForm();
//       setCurrentPage(1);
//       fetchProducts();
//     } catch (err) {
//       console.error("Add product error:", err);
//       toast.error(`Error adding product: ${err.message}`);
//     }
//   };

//   const handleEditClick = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       name: product.name,
//       brand: product.brand || '',
//       description: product.description || '',
//       price: product.price,
//       category_id: product.category?.id || product.category_id || '',
//       image_url: product.image_url || '',
//       stock: product.stock
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (product) => {
//     setViewProduct(product);
//     setShowViewModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentProduct) {
//       toast.error("Authentication token missing or no product selected for edit.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update product.');
//       }

//       toast.success('Product updated successfully!');
//       setShowEditModal(false);
//       setCurrentProduct(null);
//       clearForm();
//       fetchProducts();
//     } catch (err) {
//       console.error("Update product error:", err);
//       toast.error(`Error updating product: ${err.message}`);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !productIdToDelete) {
//       toast.error("Authentication token missing or no product selected for deletion.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/delete/${productIdToDelete}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete product.');
//       }

//       toast.success('Product deleted successfully!');
//       setShowDeleteModal(false);
//       setProductIdToDelete(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete product error:", err);
//       toast.error(`Error deleting product: ${err.message}`);
//     }
//   };

//   const openDeleteModal = (productId) => {
//     setProductIdToDelete(productId);
//     setShowDeleteModal(true);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleFilterChange = (setter) => (e) => {
//     setter(e.target.value);
//     setCurrentPage(1);
//   };

//   const getStockIcon = (stock) => {
//     if (stock === 0) return { icon: FaTimes, variant: 'danger', text: 'Out of Stock' };
//     if (stock < 10) return { icon: FaExclamationTriangle, variant: 'warning', text: 'Low Stock' };
//     return { icon: FaCheck, variant: 'success', text: 'In Stock' };
//   };

//   const getCategoryColor = () => {
//     return '--grey-dark';
//   };

//   return (
//     <div className="products-container">
//       <div className="products-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">PRODUCTS</h1>
//             <p className="page-subtitle">Manage your product inventory.</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                 className="search-input"
//               />
//             </div>
//             <div className="filter-group">
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="filter-select">
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </Form.Select>
//               </div>
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={stockFilter} onChange={handleFilterChange(setStockFilter)} className="filter-select">
//                   <option value="">All Stock Status</option>
//                   <option value="in">In Stock</option>
//                   <option value="low">Low Stock</option>
//                   <option value="out">Out of Stock</option>
//                 </Form.Select>
//               </div>
//             </div>
//             <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Product
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Row className="stats-row g-3 mb-4">
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{products.length}</div>
//                 <div className="stat-label">Total Products</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{categories.length}</div>
//                 <div className="stat-label">Categories</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{products.filter(p => p.stock < 10).length}</div>
//                 <div className="stat-label">Low Stock</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col xs={12} sm={6} md={3}>
//           <Card className="stat-card h-100">
//             <Card.Body className="d-flex flex-column justify-content-center">
//               <div className="stat-content text-center">
//                 <div className="stat-number">{products.filter(p => p.stock === 0).length}</div>
//                 <div className="stat-label">Out of Stock</div>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Card className="content-card">
//         <Card.Body>
//           {loading ? (
//             <div className="loading-container">
//               <Spinner animation="border" className="loading-spinner" />
//               <h4>Loading products...</h4>
//               <p>Please wait while we fetch your products</p>
//             </div>
//           ) : error ? (
//             <Alert variant="danger" className="error-alert">
//               <i className="bi bi-exclamation-triangle me-2"></i> Error: {error}
//             </Alert>
//           ) : products.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon"><i className="bi bi-box"></i></div>
//               <h4>No Products Found</h4>
//               <p>Start building your catalog by adding your first product</p>
//               <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//                 <FaPlus className="me-2" /> Add First Product
//               </Button>
//             </div>
//           ) : (
//             <>
//               <div className="table-responsive">
//                 <Table className="products-table">
//                   <thead>
//                     <tr>
//                       <th>ID</th>
//                       <th>Product</th>
//                       <th>Brand</th>
//                       <th>Description</th>
//                       <th>Price</th>
//                       <th>Category</th>
//                       <th>Stock</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {products.map(product => {
//                       const stockInfo = getStockIcon(product.stock);
//                       const categoryColorVar = getCategoryColor();
//                       const StockIconComponent = stockInfo.icon; // Dynamically assign the icon component
//                       return (
//                         <tr key={product.id}>
//                           <td><span className="product-id" title={`ID: ${product.id}`}>{product.id}</span></td>
//                           <td>
//                             <div className="product-info">
//                               {product.image_url ? (
//                                 <img src={product.image_url} alt={product.name} className="product-thumbnail" />
//                               ) : (
//                                 <div className="product-thumbnail-placeholder"><i className="bi bi-image"></i></div>
//                               )}
//                               <div className="product-details">
//                                 <div className="product-name" title={product.name}>{truncateText(product.name, 25)}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td><span className="product-brand" title={product.brand}>{truncateText(product.brand, 15)}</span></td>
//                           <td><div className="product-description" title={product.description}>{truncateText(product.description, 20)}</div></td>
//                           <td><span className="product-price">{product.price?.toFixed(0)}</span></td>
//                           <td>
//                             <span style={{ color: `var(${categoryColorVar})` }} title={product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}>
//                               {truncateText(product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized', 20)}
//                             </span>
//                           </td>
//                           <td>
//                             <div className="stock-info">
//                               <span className={`stock-icon ${stockInfo.variant}`} title={`${stockInfo.text}`}>
//                                 {/* <StockIconComponent /> */} {product.stock}
//                               </span>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="action-buttons">
//                               <Button variant="info" size="sm" onClick={() => handleViewClick(product)} title="View">
//                                 <FaEye />
//                               </Button>
//                               <Button variant="success" size="sm" onClick={() => handleEditClick(product)} title="Edit">
//                                 <FaEdit />
//                               </Button>
//                               <Button variant="danger" size="sm" onClick={() => openDeleteModal(product.id)} title="Delete">
//                                 <FaTrash />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </Table>
//               </div>
//               {totalPages > 1 && (
//                 <div className="pagination-wrapper">
//                   <Pagination className="custom-pagination">
//                     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                     {[...Array(totalPages).keys()].map(page => (
//                       <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
//                         {page + 1}
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

//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Product Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewProduct && (
//             <Row>
//               <Col md={4}>
//                 {viewProduct.image_url ? (
//                   <img src={viewProduct.image_url} alt={viewProduct.name} className="view-product-image" />
//                 ) : (
//                   <div className="view-product-placeholder">
//                     <i className="bi bi-image"></i>
//                     <p>No Image Available</p>
//                   </div>
//                 )}
//               </Col>
//               <Col md={8}>
//                 <div className="product-detail-info">
//                   <h4 className="product-detail-name">{viewProduct.name}</h4>
//                   <div className="product-detail-row"><strong>ID:</strong> {viewProduct.id}</div>
//                   <div className="product-detail-row"><strong>Brand:</strong> {viewProduct.brand || 'N/A'}</div>
//                   <div className="product-detail-row"><strong>Category:</strong> {viewProduct.category?.name || categories.find(cat => cat.id === viewProduct.category_id)?.name || 'Uncategorized'}</div>
//                   <div className="product-detail-row"><strong>Price:</strong> <span className="detail-price">{viewProduct.price?.toFixed(2)}</span></div>
//                   <div className="product-detail-row"><strong>Stock:</strong> {viewProduct.stock} - {getStockIcon(viewProduct.stock).text}</div>
//                   <div className="product-detail-row"><strong>Description:</strong> <div className="detail-description">{viewProduct.description || 'No description available'}</div></div>
//                   {viewProduct.image_url && <div className="product-detail-row"><strong>Image URL:</strong> <div className="detail-url">{viewProduct.image_url}</div></div>}
//                 </div>
//               </Col>
//             </Row>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-product" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Name *</Form.Label>
//                 <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Brand</Form.Label>
//                 <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Price *</Form.Label>
//                 <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Stock Quantity *</Form.Label>
//                 <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" required />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category *</Form.Label>
//                 <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                   <option value="">Select a category</option>
//                   {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Image URL</Form.Label>
//                 <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" />
//               </Form.Group>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowAddModal(false); clearForm(); }}>Cancel</Button>
//           <Button className="btn-add-product" onClick={handleAddProduct}><FaPlus className="me-2" /> Add Product</Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Row>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Name *</Form.Label>
//                 <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Brand</Form.Label>
//                 <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Price *</Form.Label>
//                 <Form.Control type="number" step="100" name="price" value={formData.price} onChange={handleInputChange} required />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Stock Quantity *</Form.Label>
//                 <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Category *</Form.Label>
//                 <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                   <option value="">Select a category</option>
//                   {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Image URL</Form.Label>
//                 <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//               </Form.Group>
//             </Col>
//           </Row>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowEditModal(false); clearForm(); }}>Cancel</Button>
//           <Button className="btn-add-product" onClick={handleUpdateProduct}><FaEdit className="me-2" /> Save Changes</Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="delete-confirmation">
//             <div className="delete-icon"><FaTrash /></div>
//             <h5>Delete Product</h5>
//             <p>Are you sure you want to delete this product? This action cannot be undone.</p>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>Cancel</Button>
//           <Button variant="danger" onClick={handleDeleteProduct}><FaTrash className="me-2" /> Delete</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminProductsPage;








// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Button, Form, Modal, Card, Spinner, Alert, Pagination, Row, Col } from 'react-bootstrap';
// import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import './styles/AdminProductsPage.css'; // Ensure this CSS file exists

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [viewProduct, setViewProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     brand: '',
//     description: '',
//     price: '',
//     category_id: '',
//     image_url: '',
//     stock: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 10;
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [stockFilter, setStockFilter] = useState('');

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         search: searchQuery,
//         page: currentPage,
//         limit: productsPerPage
//       });

//       const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || 'Failed to fetch products.');

//       let filteredProducts = data.products || [];
//       if (categoryFilter) {
//         filteredProducts = filteredProducts.filter(p => p.category?.id === parseInt(categoryFilter));
//       }
//       if (stockFilter) {
//         filteredProducts = filteredProducts.filter(p => {
//           if (stockFilter === 'in') return p.stock >= 10;
//           if (stockFilter === 'low') return p.stock > 0 && p.stock < 10;
//           if (stockFilter === 'out') return p.stock === 0;
//           return true;
//         });
//       }

//       setProducts(filteredProducts);
//       if (data.total_count !== undefined) {
//         setTotalPages(Math.ceil(data.total_count / productsPerPage));
//       }
//     } catch (err) {
//       console.error("Fetch products error:", err);
//       setError(err.message);
//       toast.error(`Error fetching products: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, searchQuery, currentPage, categoryFilter, stockFilter]);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/categories/?page=1&per_page=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch categories.');
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//       toast.error(`Error fetching categories: ${err.message}`);
//     }
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//   }, [fetchProducts, fetchCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearForm = () => {
//     setFormData({ name: '', brand: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
//   };

//   const handleAddProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       toast.error("Authentication token missing. Please log in.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to add product.');
//       }

//       toast.success('Product added successfully!');
//       setShowAddModal(false);
//       clearForm();
//       setCurrentPage(1);
//       fetchProducts();
//     } catch (err) {
//       console.error("Add product error:", err);
//       toast.error(`Error adding product: ${err.message}`);
//     }
//   };

//   const handleEditClick = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       name: product.name,
//       brand: product.brand || '',
//       description: product.description || '',
//       price: product.price,
//       category_id: product.category?.id || product.category_id || '',
//       image_url: product.image_url || '',
//       stock: product.stock
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (product) => {
//     setViewProduct(product);
//     setShowViewModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentProduct) {
//       toast.error("Authentication token missing or no product selected for edit.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update product.');
//       }

//       toast.success('Product updated successfully!');
//       setShowEditModal(false);
//       setCurrentProduct(null);
//       clearForm();
//       fetchProducts();
//     } catch (err) {
//       console.error("Update product error:", err);
//       toast.error(`Error updating product: ${err.message}`);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !productIdToDelete) {
//       toast.error("Authentication token missing or no product selected for deletion.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/delete/${productIdToDelete}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete product.');
//       }

//       toast.success('Product deleted successfully!');
//       setShowDeleteModal(false);
//       setProductIdToDelete(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete product error:", err);
//       toast.error(`Error deleting product: ${err.message}`);
//     }
//   };

//   const openDeleteModal = (productId) => {
//     setProductIdToDelete(productId);
//     setShowDeleteModal(true);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleFilterChange = (setter) => (e) => {
//     setter(e.target.value);
//     setCurrentPage(1);
//   };

//   const getStockIcon = (stock) => {
//     if (stock === 0) return { color: 'rgb(220, 53, 69)', text: 'Out of Stock' }; // Red
//     if (stock < 10) return { color: 'rgb(255, 193, 7)', text: 'Low Stock' }; // Yellow
//     return { color: 'rgb(40, 167, 69)', text: 'In Stock' }; // Green
//   };

//   const getCategoryColor = () => {
//     return '--grey-dark';
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner animation="border" className="loading-spinner" />
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert className="error-alert">{error}</Alert>;
//   }

//   return (
//     <div className="products-container">
//       <div className="products-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">PRODUCTS</h1>
//             <p className="page-subtitle">Manage your product inventory.</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                 className="search-input"
//               />
//             </div>
//             <div className="filter-group">
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="filter-select">
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </Form.Select>
//               </div>
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={stockFilter} onChange={handleFilterChange(setStockFilter)} className="filter-select">
//                   <option value="">All Stock Status</option>
//                   <option value="in">In Stock</option>
//                   <option value="low">Low Stock</option>
//                   <option value="out">Out of Stock</option>
//                 </Form.Select>
//               </div>
//             </div>
//             <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Product
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="content-card">
//         {products.length === 0 ? (
//           <div className="empty-state">
//             <FaFilter className="empty-icon" />
//             <p>No products found.</p>
//           </div>
//         ) : (
//           <>
//             <Table responsive className="products-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Product</th>
//                   <th>Brand</th>
//                   <th>Description</th>
//                   <th>Price</th>
//                   <th>Category</th>
//                   <th>Stock</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map(product => {
//                   const stockInfo = getStockIcon(product.stock);
//                   const categoryColorVar = getCategoryColor();
//                   return (
//                     <tr key={product.id}>
//                       <td>{product.id}</td>
//                       <td>
//                         <div className="product-info">
//                           {product.image_url ? (
//                             <img src={product.image_url} alt={product.name} className="product-thumbnail" />
//                           ) : (
//                             <div className="product-thumbnail-placeholder">No Image</div>
//                           )}
//                           {truncateText(product.name, 25)}
//                         </div>
//                       </td>
//                       <td>{truncateText(product.brand, 15)}</td>
//                       <td>{truncateText(product.description, 20)}</td>
//                       <td>{product.price?.toFixed(0)}</td>
//                       <td>
//                         <span style={{ color: `var(${categoryColorVar})` }} title={product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}>
//                           {truncateText(product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized', 20)}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="stock-info">
//                           <span style={{ color: stockInfo.color }} title={stockInfo.text}>{product.stock}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <Button variant="info" size="sm" onClick={() => handleViewClick(product)} title="View">
//                             <FaEye />
//                           </Button>
//                           <Button variant="success" size="sm" onClick={() => handleEditClick(product)} title="Edit">
//                             <FaEdit />
//                           </Button>
//                           <Button variant="danger" size="sm" onClick={() => openDeleteModal(product.id)} title="Delete">
//                             <FaTrash />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>

//             {totalPages > 1 && (
//               <div className="pagination-wrapper">
//                 <Pagination className="custom-pagination">
//                   <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                   {[...Array(totalPages).keys()].map(page => (
//                     <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
//                       {page + 1}
//                     </Pagination.Item>
//                   ))}
//                   <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//                 </Pagination>
//                 <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* View Product Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Product Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewProduct && (
//             <div>
//               {viewProduct.image_url ? (
//                 <img src={viewProduct.image_url} alt={viewProduct.name} className="view-product-image" />
//               ) : (
//                 <div className="view-product-placeholder">No Image Available</div>
//               )}
//               <h4 className="product-detail-name">{viewProduct.name}</h4>
//               <div className="product-detail-row"><strong>ID:</strong> {viewProduct.id}</div>
//               <div className="product-detail-row"><strong>Brand:</strong> {viewProduct.brand || 'N/A'}</div>
//               <div className="product-detail-row"><strong>Category:</strong> {viewProduct.category?.name || categories.find(cat => cat.id === viewProduct.category_id)?.name || 'Uncategorized'}</div>
//               <div className="product-detail-row"><strong>Price:</strong> <span className="detail-price">{viewProduct.price?.toFixed(2)}</span></div>
//               <div className="product-detail-row"><strong>Stock:</strong> <span style={{ color: getStockIcon(viewProduct.stock).color }}>{viewProduct.stock}</span> - {getStockIcon(viewProduct.stock).text}</div>
//               <div className="product-detail-row"><strong>Description:</strong> <div className="detail-description">{viewProduct.description || 'No description available'}</div></div>
//               {viewProduct.image_url && <div className="product-detail-row"><strong>Image URL:</strong> <div className="detail-url">{viewProduct.image_url}</div></div>}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-product" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Product Modal */}
//       <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Name *</Form.Label>
//                   <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price *</Form.Label>
//                   <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Stock Quantity *</Form.Label>
//                   <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" required />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                     <option value="">Select a category</option>
//                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="secondary" onClick={() => { setShowAddModal(false); clearForm(); }}>Cancel</Button>
//             <Button className="btn-add-product" onClick={handleAddProduct}><FaPlus className="me-2" /> Add Product</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Edit Product Modal */}
//       <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Name *</Form.Label>
//                   <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price *</Form.Label>
//                   <Form.Control type="number" step="100" name="price" value={formData.price} onChange={handleInputChange} required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Stock Quantity *</Form.Label>
//                   <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                     <option value="">Select a category</option>
//                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="secondary" onClick={() => { setShowEditModal(false); clearForm(); }}>Cancel</Button>
//             <Button className="btn-add-product" onClick={handleUpdateProduct}><FaEdit className="me-2" /> Save Changes</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="delete-confirmation">
//           <FaTrash className="delete-icon" />
//           <p>Are you sure you want to delete this product? This action cannot be undone.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>Cancel</Button>
//           <Button variant="danger" onClick={handleDeleteProduct}><FaTrash className="me-2" /> Delete</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminProductsPage;



// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Button, Form, Modal, Card, Spinner, Alert, Pagination, Row, Col } from 'react-bootstrap';
// import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import './styles/AdminProductsPage.css'; // Ensure this CSS file exists

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [viewProduct, setViewProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     brand: '',
//     description: '',
//     price: '',
//     category_id: '',
//     image_url: '',
//     stock: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 10;
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [stockFilter, setStockFilter] = useState('');

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }

//       const params = new URLSearchParams({
//         search: searchQuery,
//         page: currentPage,
//         limit: productsPerPage
//       });

//       const response = await fetch(`${API_BASE_URL}/products/?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || 'Failed to fetch products.');

//       let filteredProducts = data.products || [];
//       if (categoryFilter) {
//         filteredProducts = filteredProducts.filter(p => p.category?.id === parseInt(categoryFilter));
//       }
//       if (stockFilter) {
//         filteredProducts = filteredProducts.filter(p => {
//           if (stockFilter === 'in') return p.stock >= 10;
//           if (stockFilter === 'low') return p.stock > 0 && p.stock < 10;
//           if (stockFilter === 'out') return p.stock === 0;
//           return true;
//         });
//       }

//       setProducts(filteredProducts);
//       if (data.total_count !== undefined) {
//         setTotalPages(Math.ceil(data.total_count / productsPerPage));
//       }
//     } catch (err) {
//       console.error("Fetch products error:", err);
//       setError(err.message);
//       toast.error(`Error fetching products: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL, searchQuery, currentPage, categoryFilter, stockFilter]);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/categories/?page=1&per_page=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch categories.');
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//       toast.error(`Error fetching categories: ${err.message}`);
//     }
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//   }, [fetchProducts, fetchCategories]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearForm = () => {
//     setFormData({ name: '', brand: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
//   };

//   const handleAddProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       toast.error("Authentication token missing. Please log in.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to add product.');
//       }

//       toast.success('Product added successfully!');
//       setShowAddModal(false);
//       clearForm();
//       setCurrentPage(1);
//       fetchProducts();
//     } catch (err) {
//       console.error("Add product error:", err);
//       toast.error(`Error adding product: ${err.message}`);
//     }
//   };

//   const handleEditClick = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       name: product.name,
//       brand: product.brand || '',
//       description: product.description || '',
//       price: product.price,
//       category_id: product.category?.id || product.category_id || '',
//       image_url: product.image_url || '',
//       stock: product.stock
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (product) => {
//     setViewProduct(product);
//     setShowViewModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentProduct) {
//       toast.error("Authentication token missing or no product selected for edit.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update product.');
//       }

//       toast.success('Product updated successfully!');
//       setShowEditModal(false);
//       setCurrentProduct(null);
//       clearForm();
//       fetchProducts();
//     } catch (err) {
//       console.error("Update product error:", err);
//       toast.error(`Error updating product: ${err.message}`);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !productIdToDelete) {
//       toast.error("Authentication token missing or no product selected for deletion.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/delete/${productIdToDelete}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete product.');
//       }

//       toast.success('Product deleted successfully!');
//       setShowDeleteModal(false);
//       setProductIdToDelete(null);
//       fetchProducts();
//     } catch (err) {
//       console.error("Delete product error:", err);
//       toast.error(`Error deleting product: ${err.message}`);
//     }
//   };

//   const openDeleteModal = (productId) => {
//     setProductIdToDelete(productId);
//     setShowDeleteModal(true);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleFilterChange = (setter) => (e) => {
//     setter(e.target.value);
//     setCurrentPage(1);
//   };

//   const getStockInfo = (stock) => {
//     if (stock === 0) return { display: 'Out of Stock', color: 'rgb(220, 53, 69)' }; // Red
//     if (stock < 10) return { display: stock, color: 'rgb(255, 193, 7)' }; // Yellow
//     return { display: stock, color: 'rgb(40, 167, 69)' }; // Green
//   };

//   const getCategoryColor = () => {
//     return '--grey-dark';
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner animation="border" className="loading-spinner" />
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert className="error-alert">{error}</Alert>;
//   }

//   return (
//     <div className="products-container">
//       <div className="products-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">PRODUCTS</h1>
//             <p className="page-subtitle">Manage your product inventory.</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
//                 className="search-input"
//               />
//             </div>
//             <div className="filter-group">
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="filter-select">
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </Form.Select>
//               </div>
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={stockFilter} onChange={handleFilterChange(setStockFilter)} className="filter-select">
//                   <option value="">All Stock Status</option>
//                   <option value="in">In Stock</option>
//                   <option value="low">Low Stock</option>
//                   <option value="out">Out of Stock</option>
//                 </Form.Select>
//               </div>
//             </div>
//             <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Product
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="content-card">
//         {products.length === 0 ? (
//           <div className="empty-state">
//             <FaFilter className="empty-icon" />
//             <p>No products found.</p>
//           </div>
//         ) : (
//           <>
//             <Table responsive className="products-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Product</th>
//                   <th>Brand</th>
//                   <th>Description</th>
//                   <th>Price</th>
//                   <th>Category</th>
//                   <th>Stock</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map(product => {
//                   const stockInfo = getStockInfo(product.stock);
//                   const categoryColorVar = getCategoryColor();
//                   return (
//                     <tr key={product.id}>
//                       <td>{product.id}</td>
//                       <td>
//                         <div className="product-info">
//                           {product.image_url ? (
//                             <img src={product.image_url} alt={product.name} className="product-thumbnail" />
//                           ) : (
//                             <div className="product-thumbnail-placeholder">No Image</div>
//                           )}
//                           {truncateText(product.name, 25)}
//                         </div>
//                       </td>
//                       <td>{truncateText(product.brand, 15)}</td>
//                       <td>{truncateText(product.description, 20)}</td>
//                       <td>{product.price?.toFixed(0)}</td>
//                       <td>
//                         <span style={{ color: `var(${categoryColorVar})` }} title={product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}>
//                           {truncateText(product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized', 20)}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="stock-info">
//                           <span style={{ color: stockInfo.color }} title={stockInfo.display === 'Out of Stock' ? stockInfo.display : `${stockInfo.display} - ${stockInfo.display === 0 ? 'Out of Stock' : stockInfo.display < 10 ? 'Low Stock' : 'In Stock'}`}>{stockInfo.display}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <Button variant="info" size="sm" onClick={() => handleViewClick(product)} title="View">
//                             <FaEye />
//                           </Button>
//                           <Button variant="success" size="sm" onClick={() => handleEditClick(product)} title="Edit">
//                             <FaEdit />
//                           </Button>
//                           <Button variant="danger" size="sm" onClick={() => openDeleteModal(product.id)} title="Delete">
//                             <FaTrash />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>

//             {totalPages > 1 && (
//               <div className="pagination-wrapper">
//                 <Pagination className="custom-pagination">
//                   <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                   {[...Array(totalPages).keys()].map(page => (
//                     <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
//                       {page + 1}
//                     </Pagination.Item>
//                   ))}
//                   <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//                 </Pagination>
//                 <div className="pagination-info">Page {currentPage} of {totalPages}</div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* View Product Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Product Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewProduct && (
//             <div>
//               {viewProduct.image_url ? (
//                 <img src={viewProduct.image_url} alt={viewProduct.name} className="view-product-image" />
//               ) : (
//                 <div className="view-product-placeholder">No Image Available</div>
//               )}
//               <h4 className="product-detail-name">{viewProduct.name}</h4>
//               <div className="product-detail-row"><strong>ID:</strong> {viewProduct.id}</div>
//               <div className="product-detail-row"><strong>Brand:</strong> {viewProduct.brand || 'N/A'}</div>
//               <div className="product-detail-row"><strong>Category:</strong> {viewProduct.category?.name || categories.find(cat => cat.id === viewProduct.category_id)?.name || 'Uncategorized'}</div>
//               <div className="product-detail-row"><strong>Price:</strong> <span className="detail-price">{viewProduct.price?.toFixed(2)}</span></div>
//               <div className="product-detail-row"><strong>Stock:</strong> <span style={{ color: getStockInfo(viewProduct.stock).color }}>{getStockInfo(viewProduct.stock).display}</span></div>
//               <div className="product-detail-row"><strong>Description:</strong> <div className="detail-description">{viewProduct.description || 'No description available'}</div></div>
//               {viewProduct.image_url && <div className="product-detail-row"><strong>Image URL:</strong> <div className="detail-url">{viewProduct.image_url}</div></div>}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-product" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Product Modal */}
//       <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Name *</Form.Label>
//                   <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price *</Form.Label>
//                   <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Stock Quantity *</Form.Label>
//                   <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" required />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                     <option value="">Select a category</option>
//                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="secondary" onClick={() => { setShowAddModal(false); clearForm(); }}>Cancel</Button>
//             <Button className="btn-add-product" onClick={handleAddProduct}><FaPlus className="me-2" /> Add Product</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Edit Product Modal */}
//       <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Name *</Form.Label>
//                   <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price *</Form.Label>
//                   <Form.Control type="number" step="100" name="price" value={formData.price} onChange={handleInputChange} required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Stock Quantity *</Form.Label>
//                   <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                     <option value="">Select a category</option>
//                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="secondary" onClick={() => { setShowEditModal(false); clearForm(); }}>Cancel</Button>
//             <Button className="btn-add-product" onClick={handleUpdateProduct}><FaEdit className="me-2" /> Save Changes</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="delete-confirmation">
//           <FaTrash className="delete-icon" />
//           <p>Are you sure you want to delete this product? This action cannot be undone.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>Cancel</Button>
//           <Button variant="danger" onClick={handleDeleteProduct}><FaTrash className="me-2" /> Delete</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminProductsPage;





// import React, { useState, useEffect, useCallback } from 'react';
// import { Table, Button, Form, Modal, Card, Spinner, Alert, Pagination, Row, Col } from 'react-bootstrap';
// import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import './styles/AdminProductsPage.css'; // Ensure this CSS file exists

// const AdminProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [allProducts, setAllProducts] = useState([]); // Store all products for client-side filtering
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [productIdToDelete, setProductIdToDelete] = useState(null);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [viewProduct, setViewProduct] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     brand: '',
//     description: '',
//     price: '',
//     category_id: '',
//     image_url: '',
//     stock: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 10;
//   const [categoryFilter, setCategoryFilter] = useState('');
//   const [stockFilter, setStockFilter] = useState('');

//   const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

//   const truncateText = (text, maxLength = 20) => {
//     if (!text) return 'N/A';
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
//   };

//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }

//       // Fetch ALL products first (remove pagination from API call to get all data)
//       const response = await fetch(`${API_BASE_URL}/products/?page=1&limit=1000`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || 'Failed to fetch products.');

//       const fetchedProducts = data.products || [];
//       setAllProducts(fetchedProducts);

//       // Apply client-side filtering and search
//       applyFiltersAndPagination(fetchedProducts);

//     } catch (err) {
//       console.error("Fetch products error:", err);
//       setError(err.message);
//       toast.error(`Error fetching products: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_BASE_URL]);

//   const applyFiltersAndPagination = useCallback((productsToFilter = allProducts) => {
//     let filteredProducts = [...productsToFilter];

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase().trim();
//       filteredProducts = filteredProducts.filter(product => 
//         product.name?.toLowerCase().includes(query) ||
//         product.brand?.toLowerCase().includes(query) ||
//         product.description?.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (categoryFilter) {
//       filteredProducts = filteredProducts.filter(p => 
//         p.category?.id === parseInt(categoryFilter) || p.category_id === parseInt(categoryFilter)
//       );
//     }

//     // Apply stock filter
//     if (stockFilter) {
//       filteredProducts = filteredProducts.filter(p => {
//         if (stockFilter === 'in') return p.stock >= 10;
//         if (stockFilter === 'low') return p.stock > 0 && p.stock < 10;
//         if (stockFilter === 'out') return p.stock === 0;
//         return true;
//       });
//     }

//     // Calculate pagination
//     const totalFilteredProducts = filteredProducts.length;
//     const calculatedTotalPages = Math.ceil(totalFilteredProducts / productsPerPage);
//     setTotalPages(calculatedTotalPages);

//     // Ensure current page is valid
//     const validCurrentPage = currentPage > calculatedTotalPages && calculatedTotalPages > 0 ? 1 : currentPage;
//     if (validCurrentPage !== currentPage) {
//       setCurrentPage(validCurrentPage);
//     }

//     // Apply pagination
//     const startIndex = (validCurrentPage - 1) * productsPerPage;
//     const endIndex = startIndex + productsPerPage;
//     const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

//     setProducts(paginatedProducts);
//   }, [allProducts, searchQuery, categoryFilter, stockFilter, currentPage, productsPerPage]);

//   // Apply filters whenever dependencies change
//   useEffect(() => {
//     if (allProducts.length > 0) {
//       applyFiltersAndPagination();
//     }
//   }, [applyFiltersAndPagination]);

//   const fetchCategories = useCallback(async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         toast.error("Authentication token missing. Please log in.");
//         return;
//       }
//       const response = await fetch(`${API_BASE_URL}/categories/?page=1&per_page=100`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || 'Failed to fetch categories.');
//       setCategories(data.categories || []);
//     } catch (err) {
//       console.error("Fetch categories error:", err);
//       toast.error(`Error fetching categories: ${err.message}`);
//     }
//   }, [API_BASE_URL]);

//   useEffect(() => {
//     fetchCategories();
//     fetchProducts();
//   }, [fetchCategories, fetchProducts]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearForm = () => {
//     setFormData({ name: '', brand: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
//   };

//   const handleAddProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       toast.error("Authentication token missing. Please log in.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/create`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to add product.');
//       }

//       toast.success('Product added successfully!');
//       setShowAddModal(false);
//       clearForm();
//       setCurrentPage(1);
//       fetchProducts(); // Refresh the product list
//     } catch (err) {
//       console.error("Add product error:", err);
//       toast.error(`Error adding product: ${err.message}`);
//     }
//   };

//   const handleEditClick = (product) => {
//     setCurrentProduct(product);
//     setFormData({
//       name: product.name,
//       brand: product.brand || '',
//       description: product.description || '',
//       price: product.price,
//       category_id: product.category?.id || product.category_id || '',
//       image_url: product.image_url || '',
//       stock: product.stock
//     });
//     setShowEditModal(true);
//   };

//   const handleViewClick = (product) => {
//     setViewProduct(product);
//     setShowViewModal(true);
//   };

//   const handleUpdateProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !currentProduct) {
//       toast.error("Authentication token missing or no product selected for edit.");
//       return;
//     }

//     const { name, price, category_id, stock } = formData;

//     if (!name.trim()) {
//       toast.error("Product Name is required.");
//       return;
//     }
//     if (price === '' || isNaN(parseFloat(price))) {
//       toast.error("Price must be a valid number.");
//       return;
//     }
//     if (category_id === '') {
//       toast.error("Category is required.");
//       return;
//     }
//     if (stock === '' || isNaN(parseInt(stock))) {
//       toast.error("Stock must be a valid integer.");
//       return;
//     }

//     const payload = {
//       name: name.trim(),
//       brand: formData.brand.trim() || null,
//       description: formData.description.trim() || null,
//       price: parseFloat(price),
//       category_id: parseInt(category_id),
//       image_url: formData.image_url.trim() || null,
//       stock: parseInt(stock)
//     };

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update product.');
//       }

//       toast.success('Product updated successfully!');
//       setShowEditModal(false);
//       setCurrentProduct(null);
//       clearForm();
//       fetchProducts(); // Refresh the product list
//     } catch (err) {
//       console.error("Update product error:", err);
//       toast.error(`Error updating product: ${err.message}`);
//     }
//   };

//   const handleDeleteProduct = async () => {
//     const token = sessionStorage.getItem('token');
//     if (!token || !productIdToDelete) {
//       toast.error("Authentication token missing or no product selected for deletion.");
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/products/delete/${productIdToDelete}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to delete product.');
//       }

//       toast.success('Product deleted successfully!');
//       setShowDeleteModal(false);
//       setProductIdToDelete(null);
//       fetchProducts(); // Refresh the product list
//     } catch (err) {
//       console.error("Delete product error:", err);
//       toast.error(`Error deleting product: ${err.message}`);
//     }
//   };

//   const openDeleteModal = (productId) => {
//     setProductIdToDelete(productId);
//     setShowDeleteModal(true);
//   };

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleFilterChange = (setter) => (e) => {
//     setter(e.target.value);
//     setCurrentPage(1); // Reset to first page when filtering
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const getStockInfo = (stock) => {
//     if (stock === 0) return { display: 'Out of Stock', color: 'rgb(220, 53, 69)' }; // Red
//     if (stock < 10) return { display: stock, color: 'rgb(255, 193, 7)' }; // Yellow
//     return { display: stock, color: 'rgb(40, 167, 69)' }; // Green
//   };

//   const getCategoryColor = () => {
//     return '--grey-dark';
//   };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <Spinner animation="border" className="loading-spinner" />
//         <p>Loading products...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <Alert className="error-alert">{error}</Alert>;
//   }

//   return (
//     <div className="products-container">
//       <div className="products-header">
//         <div className="header-content">
//           <div className="title-section">
//             <h1 className="page-title">PRODUCTS</h1>
//             <p className="page-subtitle">Manage your product inventory.</p>
//           </div>
//           <div className="header-actions">
//             <div className="search-wrapper">
//               <FaSearch className="search-icon" />
//               <Form.Control
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="search-input"
//               />
//             </div>
//             <div className="filter-group">
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="filter-select">
//                   <option value="">All Categories</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>{cat.name}</option>
//                   ))}
//                 </Form.Select>
//               </div>
//               <div className="filter-wrapper">
//                 <FaFilter className="filter-icon" />
//                 <Form.Select value={stockFilter} onChange={handleFilterChange(setStockFilter)} className="filter-select">
//                   <option value="">All Stock Status</option>
//                   <option value="in">In Stock</option>
//                   <option value="low">Low Stock</option>
//                   <option value="out">Out of Stock</option>
//                 </Form.Select>
//               </div>
//             </div>
//             <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
//               <FaPlus className="me-2" /> Add New Product
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="content-card">
//         {products.length === 0 ? (
//           <div className="empty-state">
//             <FaFilter className="empty-icon" />
//             <p>No products found.</p>
//             {(searchQuery || categoryFilter || stockFilter) && (
//               <p>Try adjusting your search or filters.</p>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="mb-3 text-muted">
//               Showing {products.length} of {allProducts.length} products
//               {(searchQuery || categoryFilter || stockFilter) && ' (filtered)'}
//             </div>
            
//             <Table responsive className="products-table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Product</th>
//                   <th>Brand</th>
//                   <th>Description</th>
//                   <th>Price</th>
//                   <th>Category</th>
//                   <th>Stock</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map(product => {
//                   const stockInfo = getStockInfo(product.stock);
//                   const categoryColorVar = getCategoryColor();
//                   return (
//                     <tr key={product.id}>
//                       <td>{product.id}</td>
//                       <td>
//                         <div className="product-info">
//                           {product.image_url ? (
//                             <img src={product.image_url} alt={product.name} className="product-thumbnail" />
//                           ) : (
//                             <div className="product-thumbnail-placeholder">No Image</div>
//                           )}
//                           {truncateText(product.name, 25)}
//                         </div>
//                       </td>
//                       <td>{truncateText(product.brand, 15)}</td>
//                       <td>{truncateText(product.description, 20)}</td>
//                       <td>${product.price?.toFixed(2)}</td>
//                       <td>
//                         <span style={{ color: `var(${categoryColorVar})` }} title={product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}>
//                           {truncateText(product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized', 20)}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="stock-info">
//                           <span style={{ color: stockInfo.color }} title={stockInfo.display === 'Out of Stock' ? stockInfo.display : `${stockInfo.display} - ${stockInfo.display === 0 ? 'Out of Stock' : stockInfo.display < 10 ? 'Low Stock' : 'In Stock'}`}>{stockInfo.display}</span>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="action-buttons">
//                           <Button variant="info" size="sm" onClick={() => handleViewClick(product)} title="View">
//                             <FaEye />
//                           </Button>
//                           <Button variant="success" size="sm" onClick={() => handleEditClick(product)} title="Edit">
//                             <FaEdit />
//                           </Button>
//                           <Button variant="danger" size="sm" onClick={() => openDeleteModal(product.id)} title="Delete">
//                             <FaTrash />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>

//             {totalPages > 1 && (
//               <div className="pagination-wrapper">
//                 <Pagination className="custom-pagination">
//                   <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
//                   {[...Array(totalPages).keys()].map(page => (
//                     <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
//                       {page + 1}
//                     </Pagination.Item>
//                   ))}
//                   <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
//                 </Pagination>
//                 <div className="pagination-info">
//                   Page {currentPage} of {totalPages}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* View Product Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Product Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {viewProduct && (
//             <div>
//               {viewProduct.image_url ? (
//                 <img src={viewProduct.image_url} alt={viewProduct.name} className="view-product-image" />
//               ) : (
//                 <div className="view-product-placeholder">No Image Available</div>
//               )}
//               <h4 className="product-detail-name">{viewProduct.name}</h4>
//               <div className="product-detail-row"><strong>ID:</strong> {viewProduct.id}</div>
//               <div className="product-detail-row"><strong>Brand:</strong> {viewProduct.brand || 'N/A'}</div>
//               <div className="product-detail-row"><strong>Category:</strong> {viewProduct.category?.name || categories.find(cat => cat.id === viewProduct.category_id)?.name || 'Uncategorized'}</div>
//               <div className="product-detail-row"><strong>Price:</strong> <span className="detail-price">${viewProduct.price?.toFixed(2)}</span></div>
//               <div className="product-detail-row"><strong>Stock:</strong> <span style={{ color: getStockInfo(viewProduct.stock).color }}>{getStockInfo(viewProduct.stock).display}</span></div>
//               <div className="product-detail-row"><strong>Description:</strong> <div className="detail-description">{viewProduct.description || 'No description available'}</div></div>
//               {viewProduct.image_url && <div className="product-detail-row"><strong>Image URL:</strong> <div className="detail-url">{viewProduct.image_url}</div></div>}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
//           <Button className="btn-add-product" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>
//             <FaEdit className="me-2" /> Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Add Product Modal */}
//       <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Add New Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Name *</Form.Label>
//                   <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price *</Form.Label>
//                   <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Stock Quantity *</Form.Label>
//                   <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" required />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                     <option value="">Select a category</option>
//                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="secondary" onClick={() => { setShowAddModal(false); clearForm(); }}>Cancel</Button>
//             <Button className="btn-add-product" onClick={handleAddProduct}><FaPlus className="me-2" /> Add Product</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Edit Product Modal */}
//       <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearForm(); }} size="lg">
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Edit Product</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Product Name *</Form.Label>
//                   <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Brand</Form.Label>
//                   <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price *</Form.Label>
//                   <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Stock Quantity *</Form.Label>
//                   <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Category *</Form.Label>
//                   <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
//                     <option value="">Select a category</option>
//                     {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
//                   </Form.Select>
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Image URL</Form.Label>
//                   <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
//                 </Form.Group>
//               </Col>
//             </Row>
//             <Button variant="secondary" onClick={() => { setShowEditModal(false); clearForm(); }}>Cancel</Button>
//             <Button className="btn-add-product" onClick={handleUpdateProduct}><FaEdit className="me-2" /> Save Changes</Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>
//         <Modal.Header closeButton className="custom-modal-header">
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="delete-confirmation">
//           <FaTrash className="delete-icon" />
//           <p>Are you sure you want to delete this product? This action cannot be undone.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>Cancel</Button>
//           <Button variant="danger" onClick={handleDeleteProduct}><FaTrash className="me-2" /> Delete</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AdminProductsPage;




import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, Modal, Spinner, Alert, Pagination, Row, Col } from 'react-bootstrap';
import { FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/AdminProductsPage.css';


const AdminProductsPage = () => {
  // Main state for displayed products, all fetched products, and categories
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Modal and form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    stock: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 10;
  
  const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';

  // Helper function to truncate text for table view
  const truncateText = (text, maxLength = 20) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Fetches all products and sets the `allProducts` state.
  // This is the core data-fetching function, now responsible for fetching all available data.
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }
      
      // Attempt to fetch a large number of products to work with client-side pagination.
      // NOTE: For a real-world application, server-side pagination is more efficient for large datasets.
      const response = await fetch(`${API_BASE_URL}/products/?limit=10000`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch products.');
      
      const fetchedProducts = data.products || [];
      setAllProducts(fetchedProducts);
      
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.message);
      toast.error(`Error fetching products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Fetches all categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token missing. Please log in.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/categories/?page=1&per_page=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch categories.');
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Fetch categories error:", err);
      toast.error(`Error fetching categories: ${err.message}`);
    }
  }, [API_BASE_URL]);

  // UseEffect to fetch initial data on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // UseEffect to handle all filtering and pagination logic
  // This hook runs whenever `allProducts`, `searchQuery`, `categoryFilter`, `stockFilter`, or `currentPage` changes.
  useEffect(() => {
    let filteredProducts = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product => 
        product.name?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filteredProducts = filteredProducts.filter(p => 
        p.category?.id === parseInt(categoryFilter) || p.category_id === parseInt(categoryFilter)
      );
    }

    // Apply stock filter
    if (stockFilter) {
      filteredProducts = filteredProducts.filter(p => {
        if (stockFilter === 'in') return p.stock >= 10;
        if (stockFilter === 'low') return p.stock > 0 && p.stock < 10;
        if (stockFilter === 'out') return p.stock === 0;
        return true;
      });
    }

    // Calculate pagination based on the filtered data
    const totalFilteredProducts = filteredProducts.length;
    const calculatedTotalPages = Math.ceil(totalFilteredProducts / productsPerPage);
    setTotalPages(calculatedTotalPages);
    
    // Ensure current page is valid after filtering
    const validCurrentPage = currentPage > calculatedTotalPages && calculatedTotalPages > 0 ? 1 : currentPage;
    
    // Apply pagination
    const startIndex = (validCurrentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    setProducts(paginatedProducts);
    setCurrentPage(validCurrentPage); // Update state to the new valid page
    
  }, [allProducts, searchQuery, categoryFilter, stockFilter, currentPage, productsPerPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({ name: '', brand: '', description: '', price: '', category_id: '', image_url: '', stock: '' });
  };

  const handleAddProduct = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error("Authentication token missing. Please log in.");
      return;
    }

    const { name, price, category_id, stock } = formData;
    if (!name.trim() || price === '' || isNaN(parseFloat(price)) || category_id === '' || stock === '' || isNaN(parseInt(stock))) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: name.trim(),
      brand: formData.brand.trim() || null,
      description: formData.description.trim() || null,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      image_url: formData.image_url.trim() || null,
      stock: parseInt(stock)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/products/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add product.');

      toast.success('Product added successfully!');
      setShowAddModal(false);
      clearForm();
      fetchProducts();
    } catch (err) {
      console.error("Add product error:", err);
      toast.error(`Error adding product: ${err.message}`);
    }
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      description: product.description || '',
      price: product.price,
      category_id: product.category?.id || product.category_id || '',
      image_url: product.image_url || '',
      stock: product.stock
    });
    setShowEditModal(true);
  };

  const handleViewClick = (product) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const handleUpdateProduct = async () => {
    const token = sessionStorage.getItem('token');
    if (!token || !currentProduct) {
      toast.error("Authentication token missing or no product selected for edit.");
      return;
    }

    const { name, price, category_id, stock } = formData;
    if (!name.trim() || price === '' || isNaN(parseFloat(price)) || category_id === '' || stock === '' || isNaN(parseInt(stock))) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      name: name.trim(),
      brand: formData.brand.trim() || null,
      description: formData.description.trim() || null,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      image_url: formData.image_url.trim() || null,
      stock: parseInt(stock)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update product.');

      toast.success('Product updated successfully!');
      setShowEditModal(false);
      setCurrentProduct(null);
      clearForm();
      fetchProducts();
    } catch (err) {
      console.error("Update product error:", err);
      toast.error(`Error updating product: ${err.message}`);
    }
  };

  const handleDeleteProduct = async () => {
    const token = sessionStorage.getItem('token');
    if (!token || !productIdToDelete) {
      toast.error("Authentication token missing or no product selected for deletion.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/delete/${productIdToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete product.');

      toast.success('Product deleted successfully!');
      setShowDeleteModal(false);
      setProductIdToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      toast.error(`Error deleting product: ${err.message}`);
    }
  };

  const openDeleteModal = (productId) => {
    setProductIdToDelete(productId);
    setShowDeleteModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getStockInfo = (stock) => {
    if (stock === 0) return { display: 'Out of Stock', color: 'rgb(220, 53, 69)' };
    if (stock < 10) return { display: stock, color: 'rgb(255, 193, 7)' };
    return { display: stock, color: 'rgb(40, 167, 69)' };
  };

  const getCategoryColor = () => {
    return '--grey-dark';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" className="loading-spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <Alert className="error-alert">{error}</Alert>;
  }

  return (
    <div className="products-container">
      <ToastContainer />
      <div className="products-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">PRODUCTS</h1>
            <p className="page-subtitle">Manage your product inventory.</p>
          </div>
          <div className="header-actions">
            <div className="search-wrapper">
              <FaSearch className="search-icon" />
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <div className="filter-wrapper">
                <FaFilter className="filter-icon" />
                <Form.Select value={categoryFilter} onChange={handleFilterChange(setCategoryFilter)} className="filter-select">
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="filter-wrapper">
                <FaFilter className="filter-icon" />
                <Form.Select value={stockFilter} onChange={handleFilterChange(setStockFilter)} className="filter-select">
                  <option value="">All Stock Status</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </Form.Select>
              </div>
            </div>
            <Button className="btn-add-product" onClick={() => setShowAddModal(true)}>
              <FaPlus className="me-2" /> Add New Product
            </Button>
          </div>
        </div>
      </div>

      <div className="content-card">
        {products.length === 0 ? (
          <div className="empty-state">
            <FaFilter className="empty-icon" />
            <p>No products found.</p>
            {(searchQuery || categoryFilter || stockFilter) && (
              <p>Try adjusting your search or filters.</p>
            )}
          </div>
        ) : (
          <>
            <div className="mb-3 text-muted">
              Showing {products.length} of {allProducts.length} products
              {(searchQuery || categoryFilter || stockFilter) && ' (filtered)'}
            </div>
            
            <Table responsive className="products-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const stockInfo = getStockInfo(product.stock);
                  const categoryColorVar = getCategoryColor();
                  return (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <div className="product-info">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="product-thumbnail" />
                          ) : (
                            <div className="product-thumbnail-placeholder">No Image</div>
                          )}
                          {truncateText(product.name, 25)}
                        </div>
                      </td>
                      <td>{truncateText(product.brand, 15)}</td>
                      <td>{truncateText(product.description, 20)}</td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>
                        <span style={{ color: `var(${categoryColorVar})` }} title={product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized'}>
                          {truncateText(product.category?.name || categories.find(cat => cat.id === product.category_id)?.name || 'Uncategorized', 20)}
                        </span>
                      </td>
                      <td>
                        <div className="stock-info">
                          <span style={{ color: stockInfo.color }} title={stockInfo.display === 'Out of Stock' ? stockInfo.display : `${stockInfo.display} - ${stockInfo.display === 0 ? 'Out of Stock' : stockInfo.display < 10 ? 'Low Stock' : 'In Stock'}`}>{stockInfo.display}</span>
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button variant="info" size="sm" onClick={() => handleViewClick(product)} title="View">
                            <FaEye />
                          </Button>
                          <Button variant="success" size="sm" onClick={() => handleEditClick(product)} title="Edit">
                            <FaEdit />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteModal(product.id)} title="Delete">
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <Pagination className="custom-pagination">
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages).keys()].map(page => (
                    <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                      {page + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </Pagination>
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Product Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewProduct && (
            <div>
              {viewProduct.image_url ? (
                <img src={viewProduct.image_url} alt={viewProduct.name} className="view-product-image" />
              ) : (
                <div className="view-product-placeholder">No Image Available</div>
              )}
              <h4 className="product-detail-name">{viewProduct.name}</h4>
              <div className="product-detail-row"><strong>ID:</strong> {viewProduct.id}</div>
              <div className="product-detail-row"><strong>Brand:</strong> {viewProduct.brand || 'N/A'}</div>
              <div className="product-detail-row"><strong>Category:</strong> {viewProduct.category?.name || categories.find(cat => cat.id === viewProduct.category_id)?.name || 'Uncategorized'}</div>
              <div className="product-detail-row"><strong>Price:</strong> <span className="detail-price">${viewProduct.price?.toFixed(2)}</span></div>
              <div className="product-detail-row"><strong>Stock:</strong> <span style={{ color: getStockInfo(viewProduct.stock).color }}>{getStockInfo(viewProduct.stock).display}</span></div>
              <div className="product-detail-row"><strong>Description:</strong> <div className="detail-description">{viewProduct.description || 'No description available'}</div></div>
              {viewProduct.image_url && <div className="product-detail-row"><strong>Image URL:</strong> <div className="detail-url">{viewProduct.image_url}</div></div>}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
          <Button className="btn-add-product" onClick={() => { setShowViewModal(false); handleEditClick(viewProduct); }}>
            <FaEdit className="me-2" /> Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={() => { setShowAddModal(false); clearForm(); }} size="lg">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Enter brand name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock quantity" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowAddModal(false); clearForm(); }}>Cancel</Button>
          <Button className="btn-add-product" onClick={handleAddProduct}><FaPlus className="me-2" /> Add Product</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => { setShowEditModal(false); clearForm(); }} size="lg">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name *</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price *</Form.Label>
                  <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity *</Form.Label>
                  <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select name="category_id" value={formData.category_id} onChange={handleInputChange} required>
                    <option value="">Select a category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInputChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowEditModal(false); clearForm(); }}>Cancel</Button>
          <Button className="btn-add-product" onClick={handleUpdateProduct}><FaEdit className="me-2" /> Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="delete-confirmation">
          <FaTrash className="delete-icon" />
          <p>Are you sure you want to delete this product? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setProductIdToDelete(null); }}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteProduct}><FaTrash className="me-2" /> Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
