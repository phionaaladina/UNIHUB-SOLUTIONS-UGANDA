


// import React, { useContext, useState } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link } from 'react-router-dom';

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     checkout,
//     isLoading
//   } = useContext(CartContext);

//   const [showCheckout, setShowCheckout] = useState(false);
//   const [customerInfo, setCustomerInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod',
//     momoNumber: '',
//     momoNetwork: 'mtn'
//   });
//   const [checkoutError, setCheckoutError] = useState('');
//   const [checkoutSuccess, setCheckoutSuccess] = useState('');
//   const [paymentProof, setPaymentProof] = useState(null);
//   const [showPaymentDetails, setShowPaymentDetails] = useState(false);

//   // Mobile Money merchant numbers
//   const MOMO_MERCHANTS = {
//     mtn: {
//       name: 'MTN Mobile Money',
//       number: '0771234567', // Replace with actual merchant number
//       accountName: 'TechStore Uganda Ltd'
//     },
//     airtel: {
//       name: 'Airtel Money',
//       number: '0700123456', // Replace with actual merchant number
//       accountName: 'TechStore Uganda Ltd'
//     }
//   };

//   const handleQuantityChange = (productId, newQuantity) => {
//     console.log('🔢 Updating quantity for product:', productId, 'to:', newQuantity);
//     if (newQuantity < 1) {
//       handleRemoveItem(productId);
//     } else {
//       updateQuantity(productId, newQuantity);
//     }
//   };

//   const handleRemoveItem = (productId) => {
//     console.log('🗑️ Removing item:', productId);
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       removeFromCart(productId);
//     }
//   };

//   const handleClearCart = () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       clearCart();
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log('Input changed:', name, '=', value); // Debug log
//     setCustomerInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       if (!allowedTypes.includes(file.type)) {
//         setCheckoutError('Please upload a valid image file (JPEG, PNG, or WebP)');
//         e.target.value = '';
//         return;
//       }
      
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         setCheckoutError('File size must be less than 5MB');
//         e.target.value = '';
//         return;
//       }
      
//       setPaymentProof(file);
//       setCheckoutError('');
//     }
//   };

//   // ✅ IMPROVED: The handleCheckout function now always sends FormData
//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setCheckoutError('');
//     setCheckoutSuccess('');

//     // Validate required fields with more specific error messages
//     if (!customerInfo.name || customerInfo.name.trim() === '') {
//       setCheckoutError('Please enter your full name');
//       return;
//     }

//     if (!customerInfo.email || customerInfo.email.trim() === '') {
//       setCheckoutError('Please enter your email address');
//       return;
//     }

//     if (!customerInfo.phone || customerInfo.phone.trim() === '') {
//       setCheckoutError('Please enter your phone number');
//       return;
//     }

//     if (!customerInfo.email.includes('@')) {
//       setCheckoutError('Please enter a valid email address');
//       return;
//     }

//     // Validate Mobile Money payment if selected
//     if (customerInfo.paymentMethod === 'momo') {
//       if (!customerInfo.momoNumber) {
//         setCheckoutError('Please enter your Mobile Money number');
//         return;
//       }
      
//       // Validate phone number format for Mobile Money
//       const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
//       if (!phoneRegex.test(customerInfo.momoNumber)) {
//         setCheckoutError('Please enter a valid Mobile Money number');
//         return;
//       }

//       if (!paymentProof) {
//         setCheckoutError('Please upload proof of payment for Mobile Money transactions');
//         return;
//       }
//     }

//     console.log('💳 Starting checkout process...');

//     try {
//       // Create FormData object and append all necessary data
//       const formData = new FormData();
//       formData.append('customerInfo', JSON.stringify(customerInfo));
//       formData.append('cart', JSON.stringify(cart));
//       formData.append('total', getCartTotal());
      
//       // Conditionally append paymentProof if a file was selected
//       if (customerInfo.paymentMethod === 'momo' && paymentProof) {
//         formData.append('paymentProof', paymentProof);
//       }
      
//       const result = await checkout(formData);
      
//       if (result.success) {
//         const paymentMessage = customerInfo.paymentMethod === 'cod' 
//           ? 'Order placed successfully! You will pay cash on delivery.'
//           : 'Order placed successfully! We have received your payment proof and will verify it shortly. You will receive a confirmation message once verified.';
        
//         setCheckoutSuccess(paymentMessage);
//         setShowCheckout(false);
//         setShowPaymentDetails(false);
//         setPaymentProof(null);
//         setCustomerInfo({
//           name: '',
//           email: '',
//           phone: '',
//           address: '',
//           city: '',
//           notes: '',
//           paymentMethod: 'cod',
//           momoNumber: '',
//           momoNetwork: 'mtn'
//         });
//       } else {
//         setCheckoutError(result.error || 'Checkout failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Checkout error:', error);
//       setCheckoutError('Checkout failed. Please try again.');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `UGX ${amount.toLocaleString()}`;
//   };

//   // Empty cart state
//   if (cart.length === 0) {
//     return (
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-8 text-center">
//             <div className="empty-cart-container p-5">
//               <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
//               <h2 className="mb-3">Your Cart is Empty</h2>
//               <p className="text-muted mb-4">
//                 Looks like you haven't added any products to your cart yet. 
//                 Start shopping to build your perfect setup!
//               </p>
//               <Link to="/products" className="btn btn-primary btn-lg px-4">
//                 <i className="bi bi-arrow-left me-2"></i>
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>

//           {checkoutSuccess && (
//             <div className="row justify-content-center mt-4">
//               <div className="col-md-8">
//                 <div className="alert alert-success text-center" role="alert">
//                   <i className="bi bi-check-circle me-2"></i>
//                   {checkoutSuccess}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         <div className="col-12">
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item">
//                 <Link to="/products">Products</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">Cart</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="mb-0">
//               <i className="bi bi-cart3 me-2"></i>
//               Shopping Cart ({getCartItemsCount()} items)
//             </h2>
//             <button 
//               className="btn btn-outline-danger btn-sm"
//               onClick={handleClearCart}
//               disabled={isLoading}
//             >
//               <i className="bi bi-trash me-1"></i>
//               Clear Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Error/Success Messages */}
//       {checkoutError && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-danger" role="alert">
//               <i className="bi bi-exclamation-triangle me-2"></i>
//               {checkoutError}
//             </div>
//           </div>
//         </div>
//       )}

//       {checkoutSuccess && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-success" role="alert">
//               <i className="bi bi-check-circle me-2"></i>
//               {checkoutSuccess}
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="row">
//         {/* Cart Items */}
//         <div className="col-lg-8">
//           <div className="card shadow-sm mb-4">
//             <div className="card-header bg-light">
//               <h5 className="mb-0">Cart Items</h5>
//             </div>
//             <div className="card-body p-0">
//               {cart.map((item, index) => (
//                 <div key={item.id} className={`cart-item p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
//                   <div className="row align-items-center">
//                     <div className="col-md-2 col-sm-3">
//                       <img
//                         src={item.image_url || '/api/placeholder/100/100'}
//                         alt={item.name}
//                         className="img-fluid rounded"
//                         style={{ maxHeight: '80px', objectFit: 'cover' }}
//                         onError={(e) => {
//                           e.target.src = '/api/placeholder/100/100';
//                         }}
//                       />
//                     </div>
//                     <div className="col-md-4 col-sm-9">
//                       <h6 className="mb-1">{item.name}</h6>
//                       <small className="text-muted">
//                         {item.description && item.description.length > 50 
//                           ? `${item.description.substring(0, 50)}...` 
//                           : item.description
//                         }
//                       </small>
//                     </div>
//                     <div className="col-md-2 col-6 mt-2 mt-md-0">
//                       <label className="form-label small">Price</label>
//                       <div className="fw-bold text-primary">
//                         {formatCurrency(item.price)}
//                       </div>
//                     </div>
//                     <div className="col-md-2 col-6 mt-2 mt-md-0">
//                       <label htmlFor={`quantity-${item.id}`} className="form-label small">Quantity</label>
//                       <div className="input-group input-group-sm">
//                         <button
//                           className="btn btn-outline-secondary"
//                           type="button"
//                           onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                           disabled={isLoading}
//                         >
//                           <i className="bi bi-dash"></i>
//                         </button>
//                         <input
//                           type="number"
//                           className="form-control text-center"
//                           id={`quantity-${item.id}`}
//                           value={item.quantity}
//                           min="1"
//                           onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
//                           disabled={isLoading}
//                         />
//                         <button
//                           className="btn btn-outline-secondary"
//                           type="button"
//                           onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                           disabled={isLoading}
//                         >
//                           <i className="bi bi-plus"></i>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="col-md-1 col-6 mt-2 mt-md-0">
//                       <label className="form-label small">Total</label>
//                       <div className="fw-bold">
//                         {formatCurrency(item.price * item.quantity)}
//                       </div>
//                     </div>
//                     <div className="col-md-1 col-6 mt-2 mt-md-0 text-end">
//                       <button
//                         className="btn btn-outline-danger btn-sm"
//                         onClick={() => handleRemoveItem(item.id)}
//                         disabled={isLoading}
//                         title="Remove item"
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Continue Shopping */}
//           <Link to="/products" className="btn btn-outline-primary">
//             <i className="bi bi-arrow-left me-2"></i>
//             Continue Shopping
//           </Link>
//         </div>

//         {/* Order Summary */}
//         <div className="col-lg-4">
//           <div className="card shadow-sm mb-4">
//             <div className="card-header bg-primary text-white">
//               <h5 className="mb-0">Order Summary</h5>
//             </div>
//             <div className="card-body">
//               <div className="d-flex justify-content-between mb-2">
//                 <span>Items ({getCartItemsCount()})</span>
//                 <span>{formatCurrency(getCartTotal())}</span>
//               </div>
//               <div className="d-flex justify-content-between mb-2">
//                 <span>Shipping</span>
//                 <span className="text-success">FREE</span>
//               </div>
//               <hr />
//               <div className="d-flex justify-content-between mb-3">
//                 <strong>Total</strong>
//                 <strong className="text-primary">{formatCurrency(getCartTotal())}</strong>
//               </div>

//               {!showCheckout ? (
//                 <button
//                   className="btn btn-success w-100 btn-lg"
//                   onClick={() => setShowCheckout(true)}
//                   disabled={isLoading}
//                 >
//                   <i className="bi bi-credit-card me-2"></i>
//                   Proceed to Checkout
//                 </button>
//               ) : (
//                 <div>
//                   <button
//                     className="btn btn-outline-secondary w-100 mb-3"
//                     onClick={() => {
//                       setShowCheckout(false);
//                       setShowPaymentDetails(false);
//                       setPaymentProof(null);
//                     }}
//                   >
//                     <i className="bi bi-arrow-left me-2"></i>
//                     Back to Cart
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Security Badge */}
//           <div className="card shadow-sm">
//             <div className="card-body text-center">
//               <i className="bi bi-shield-check text-success display-6 mb-2"></i>
//               <h6 className="mb-2">Secure Checkout</h6>
//               <small className="text-muted">
//                 Your information is protected with industry-standard encryption
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Checkout Form Modal/Section */}
//       {showCheckout && (
//         <div className="row mt-4">
//           <div className="col-12">
//             <div className="card shadow">
//               <div className="card-header bg-success text-white">
//                 <h5 className="mb-0">
//                   <i className="bi bi-person-check me-2"></i>
//                   Customer Information & Payment
//                 </h5>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handleCheckout}>
//                   {/* Customer Information */}
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="name" className="form-label">
//                         Full Name <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="name"
//                         name="name"
//                         value={customerInfo.name}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="email" className="form-label">
//                         Email Address <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         name="email"
//                         value={customerInfo.email}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="phone" className="form-label">
//                         Phone Number <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         id="phone"
//                         name="phone"
//                         value={customerInfo.phone}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="city" className="form-label">City</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="city"
//                         name="city"
//                         value={customerInfo.city}
//                         onChange={handleInputChange}
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="address" className="form-label">Delivery Address</label>
//                     <textarea
//                       className="form-control"
//                       id="address"
//                       name="address"
//                       rows="3"
//                       value={customerInfo.address}
//                       onChange={handleInputChange}
//                       disabled={isLoading}
//                       placeholder="Enter your full delivery address"
//                     ></textarea>
//                   </div>

//                   {/* Payment Method Section */}
//                   <div className="mb-4">
//                     <h6 className="mb-3">
//                       <i className="bi bi-credit-card me-2"></i>
//                       Payment Method <span className="text-danger">*</span>
//                     </h6>
//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="paymentMethod"
//                             id="cod"
//                             value="cod"
//                             checked={customerInfo.paymentMethod === 'cod'}
//                             onChange={handleInputChange}
//                             disabled={isLoading}
//                           />
//                           <label className="form-check-label" htmlFor="cod">
//                             <div className="d-flex align-items-center">
//                               <i className="bi bi-cash-coin text-success me-2"></i>
//                               <div>
//                                 <strong>Cash on Delivery</strong>
//                                 <br />
//                                 <small className="text-muted">Pay when your order arrives</small>
//                               </div>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                       <div className="col-md-6 mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="paymentMethod"
//                             id="momo"
//                             value="momo"
//                             checked={customerInfo.paymentMethod === 'momo'}
//                             onChange={(e) => {
//                               handleInputChange(e);
//                               if (e.target.value === 'momo') {
//                                 setShowPaymentDetails(true);
//                               } else {
//                                 setShowPaymentDetails(false);
//                                 setPaymentProof(null);
//                               }
//                             }}
//                             disabled={isLoading}
//                           />
//                           <label className="form-check-label" htmlFor="momo">
//                             <div className="d-flex align-items-center">
//                               <i className="bi bi-phone text-primary me-2"></i>
//                               <div>
//                                 <strong>Mobile Money</strong>
//                                 <br />
//                                 <small className="text-muted">Pay with your mobile money</small>
//                               </div>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Mobile Money Details */}
//                     {customerInfo.paymentMethod === 'momo' && (
//                       <div className="card border-primary mt-3">
//                         <div className="card-header bg-light">
//                           <h6 className="mb-0">Mobile Money Payment</h6>
//                         </div>
//                         <div className="card-body">
//                           <div className="row">
//                             <div className="col-md-6 mb-3">
//                               <label htmlFor="momoNetwork" className="form-label">
//                                 Your Network <span className="text-danger">*</span>
//                               </label>
//                               <select
//                                 className="form-select"
//                                 id="momoNetwork"
//                                 name="momoNetwork"
//                                 value={customerInfo.momoNetwork}
//                                 onChange={handleInputChange}
//                                 required
//                                 disabled={isLoading}
//                               >
//                                 <option value="mtn">MTN Mobile Money</option>
//                                 <option value="airtel">Airtel Money</option>
//                               </select>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                               <label htmlFor="momoNumber" className="form-label">
//                                 Your Mobile Money Number <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="tel"
//                                 className="form-control"
//                                 id="momoNumber"
//                                 name="momoNumber"
//                                 value={customerInfo.momoNumber}
//                                 onChange={handleInputChange}
//                                 required
//                                 disabled={isLoading}
//                               />
//                             </div>
//                           </div>
                          
//                           {/* Payment Instructions */}
//                           <div className="alert alert-info">
//                             <i className="bi bi-info-circle me-2"></i>
//                             <strong>Instructions:</strong> Pay **{formatCurrency(getCartTotal())}** to **{MOMO_MERCHANTS[customerInfo.momoNetwork].number}** ({MOMO_MERCHANTS[customerInfo.momoNetwork].accountName}). Once complete, upload the payment screenshot below.
//                           </div>

//                           <div className="mb-3">
//                             <label htmlFor="paymentProof" className="form-label">
//                               Upload Payment Proof <span className="text-danger">*</span>
//                             </label>
//                             <input
//                               type="file"
//                               className="form-control"
//                               id="paymentProof"
//                               name="paymentProof"
//                               accept="image/jpeg, image/png, image/webp"
//                               onChange={handleFileUpload}
//                               disabled={isLoading}
//                               required
//                             />
//                             {paymentProof && (
//                               <div className="mt-2">
//                                 <small className="text-success">
//                                   <i className="bi bi-check-circle me-1"></i>
//                                   File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
//                                 </small>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Submit Button */}
//                   <div className="d-grid gap-2">
//                     <button 
//                       type="submit" 
//                       className="btn btn-lg btn-success" 
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                           Processing...
//                         </>
//                       ) : (
//                         `Place Order (${formatCurrency(getCartTotal())})`
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;



//GUEST USER
// import React, { useContext, useState } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link } from 'react-router-dom';

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     checkout,
//     isLoading,
//     isAuthenticated
//   } = useContext(CartContext);

//   const [currentView, setCurrentView] = useState('cart');

//   const [customerInfo, setCustomerInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod',
//     momoNumber: '',
//     momoNetwork: 'mtn'
//   });
//   const [checkoutError, setCheckoutError] = useState('');
//   const [checkoutSuccess, setCheckoutSuccess] = useState('');
//   const [paymentProof, setPaymentProof] = useState(null);
//   const [showPaymentDetails, setShowPaymentDetails] = useState(false);

//   const MOMO_MERCHANTS = {
//     mtn: {
//       name: 'MTN Mobile Money',
//       number: '0771234567', // Replace with actual merchant number
//       accountName: 'TechStore Uganda Ltd'
//     },
//     airtel: {
//       name: 'Airtel Money',
//       number: '0700123456', // Replace with actual merchant number
//       accountName: 'TechStore Uganda Ltd'
//     }
//   };

//   const handleQuantityChange = (productId, newQuantity) => {
//     console.log('🔢 Updating quantity for product:', productId, 'to:', newQuantity);
//     if (newQuantity < 1) {
//       handleRemoveItem(productId);
//     } else {
//       updateQuantity(productId, newQuantity);
//     }
//   };

//   const handleRemoveItem = (productId) => {
//     console.log('🗑️ Removing item:', productId);
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       removeFromCart(productId);
//     }
//   };

//   const handleClearCart = () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       clearCart();
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     console.log('Input changed:', name, '=', value); // Debug log
//     setCustomerInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       const maxSize = 5 * 1024 * 1024; // 5MB
      
//       if (!allowedTypes.includes(file.type)) {
//         setCheckoutError('Please upload a valid image file (JPEG, PNG, or WebP)');
//         e.target.value = '';
//         return;
//       }
      
//       if (file.size > maxSize) {
//         setCheckoutError('File size must be less than 5MB');
//         e.target.value = '';
//         return;
//       }
      
//       setPaymentProof(file);
//       setCheckoutError('');
//       console.log('✅ Payment proof file selected:', file.name);
//     }
//   };

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setCheckoutError('');
//     setCheckoutSuccess('');

//     // Validation logic
//     if (!customerInfo.name || customerInfo.name.trim() === '') {
//       setCheckoutError('Please enter your full name');
//       return;
//     }

//     if (!customerInfo.email || customerInfo.email.trim() === '') {
//       setCheckoutError('Please enter your email address');
//       return;
//     }

//     if (!customerInfo.phone || customerInfo.phone.trim() === '') {
//       setCheckoutError('Please enter your phone number');
//       return;
//     }

//     if (!customerInfo.email.includes('@')) {
//       setCheckoutError('Please enter a valid email address');
//       return;
//     }

//     if (customerInfo.paymentMethod === 'momo') {
//       if (!customerInfo.momoNumber) {
//         setCheckoutError('Please enter your Mobile Money number');
//         return;
//       }
      
//       const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
//       if (!phoneRegex.test(customerInfo.momoNumber)) {
//         setCheckoutError('Please enter a valid Mobile Money number');
//         return;
//       }

//       if (!paymentProof) {
//         setCheckoutError('Please upload proof of payment for Mobile Money transactions');
//         return;
//       }
//     }

//     console.log('💳 Starting checkout process...');

//     try {
//       const formData = new FormData();
      
//       // Ensure customerInfo includes all necessary fields
//       const completeCustomerInfo = {
//         ...customerInfo,
//         name: customerInfo.name.trim(),
//         email: customerInfo.email.trim(),
//         phone: customerInfo.phone.trim(),
//       };
      
//       formData.append('customerInfo', JSON.stringify(completeCustomerInfo));
//       formData.append('cart', JSON.stringify(cart));
//       formData.append('total', getCartTotal().toString());
      
//       // Only append payment proof if it exists
//       if (customerInfo.paymentMethod === 'momo' && paymentProof) {
//         formData.append('paymentProof', paymentProof);
//       }
      
//       const result = await checkout(formData);
      
//       if (result.success) {
//         const paymentMessage = customerInfo.paymentMethod === 'cod' 
//           ? 'Order placed successfully! You will pay cash on delivery.'
//           : 'Order placed successfully! We have received your payment proof and will verify it shortly. You will receive a confirmation message once verified.';
        
//         setCheckoutSuccess(paymentMessage);
//         setCurrentView('cart');
//         setShowPaymentDetails(false);
//         setPaymentProof(null);
        
//         // Reset form
//         setCustomerInfo({
//           name: '',
//           email: '',
//           phone: '',
//           address: '',
//           city: '',
//           notes: '',
//           paymentMethod: 'cod',
//           momoNumber: '',
//           momoNetwork: 'mtn'
//         });
        
//         // Clear any file input
//         const fileInput = document.getElementById('paymentProof');
//         if (fileInput) {
//           fileInput.value = '';
//         }
        
//       } else {
//         setCheckoutError(result.error || 'Checkout failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Checkout error:', error);
//       setCheckoutError('Checkout failed. Please try again.');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `UGX ${amount.toLocaleString()}`;
//   };

//   const renderPaymentInstructions = () => {
//     const merchant = MOMO_MERCHANTS[customerInfo.momoNetwork];
//     return (
//       <div className="alert alert-info">
//         <i className="bi bi-info-circle me-2"></i>
//         <strong>Payment Instructions:</strong>
//         <ol className="mb-0 mt-2">
//           <li>Send <strong>{formatCurrency(getCartTotal())}</strong> to <strong>{merchant.number}</strong></li>
//           <li>Account Name: <strong>{merchant.accountName}</strong></li>
//           <li>Network: <strong>{merchant.name}</strong></li>
//           <li>Take a screenshot of the payment confirmation</li>
//           <li>Upload the screenshot below</li>
//         </ol>
//       </div>
//     );
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-8 text-center">
//             <div className="empty-cart-container p-5">
//               <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
//               <h2 className="mb-3">Your Cart is Empty</h2>
//               <p className="text-muted mb-4">
//                 Looks like you haven't added any products to your cart yet. 
//                 Start shopping to build your perfect setup!
//               </p>
//               <Link to="/products" className="btn btn-primary btn-lg px-4">
//                 <i className="bi bi-arrow-left me-2"></i>
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>

//           {checkoutSuccess && (
//             <div className="row justify-content-center mt-4">
//               <div className="col-md-8">
//                 <div className="alert alert-success text-center" role="alert">
//                   <i className="bi bi-check-circle me-2"></i>
//                   {checkoutSuccess}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         <div className="col-12">
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item">
//                 <Link to="/products">Products</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">Cart</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="mb-0">
//               <i className="bi bi-cart3 me-2"></i>
//               Shopping Cart ({getCartItemsCount()} items)
//             </h2>
//             <button 
//               className="btn btn-outline-danger btn-sm"
//               onClick={handleClearCart}
//               disabled={isLoading}
//             >
//               <i className="bi bi-trash me-1"></i>
//               Clear Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {checkoutError && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-danger" role="alert">
//               <i className="bi bi-exclamation-triangle me-2"></i>
//               {checkoutError}
//             </div>
//           </div>
//         </div>
//       )}

//       {checkoutSuccess && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-success" role="alert">
//               <i className="bi bi-check-circle me-2"></i>
//               {checkoutSuccess}
//             </div>
//           </div>
//         </div>
//       )}

//       {currentView === 'cart' && (
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-light">
//                 <h5 className="mb-0">Cart Items</h5>
//               </div>
//               <div className="card-body p-0">
//                 {cart.map((item, index) => (
//                   <div key={item.id} className={`cart-item p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
//                     <div className="row align-items-center">
//                       <div className="col-md-2 col-sm-3">
//                         <img
//                           src={item.image_url || '/api/placeholder/100/100'}
//                           alt={item.name}
//                           className="img-fluid rounded"
//                           style={{ maxHeight: '80px', objectFit: 'cover' }}
//                           onError={(e) => {
//                             e.target.src = '/api/placeholder/100/100';
//                           }}
//                         />
//                       </div>
//                       <div className="col-md-4 col-sm-9">
//                         <h6 className="mb-1">{item.name}</h6>
//                         <small className="text-muted">
//                           {item.description && item.description.length > 50 
//                             ? `${item.description.substring(0, 50)}...` 
//                             : item.description
//                           }
//                         </small>
//                       </div>
//                       <div className="col-md-2 col-6 mt-2 mt-md-0">
//                         <label className="form-label small">Price</label>
//                         <div className="fw-bold text-primary">
//                           {formatCurrency(item.price)}
//                         </div>
//                       </div>
//                       <div className="col-md-2 col-6 mt-2 mt-md-0">
//                         <label htmlFor={`quantity-${item.id}`} className="form-label small">Quantity</label>
//                         <div className="input-group input-group-sm">
//                           <button
//                             className="btn btn-outline-secondary"
//                             type="button"
//                             onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                             disabled={isLoading}
//                           >
//                             <i className="bi bi-dash"></i>
//                           </button>
//                           <input
//                             type="number"
//                             className="form-control text-center"
//                             id={`quantity-${item.id}`}
//                             value={item.quantity}
//                             min="1"
//                             onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
//                             disabled={isLoading}
//                           />
//                           <button
//                             className="btn btn-outline-secondary"
//                             type="button"
//                             onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                             disabled={isLoading}
//                           >
//                             <i className="bi bi-plus"></i>
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-md-1 col-6 mt-2 mt-md-0">
//                         <label className="form-label small">Total</label>
//                         <div className="fw-bold">
//                           {formatCurrency(item.price * item.quantity)}
//                         </div>
//                       </div>
//                       <div className="col-md-1 col-6 mt-2 mt-md-0 text-end">
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => handleRemoveItem(item.id)}
//                           disabled={isLoading}
//                           title="Remove item"
//                         >
//                           <i className="bi bi-trash"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Link to="/products" className="btn btn-outline-primary">
//               <i className="bi bi-arrow-left me-2"></i>
//               Continue Shopping
//             </Link>
//           </div>

//           <div className="col-lg-4">
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-primary text-white">
//                 <h5 className="mb-0">Order Summary</h5>
//               </div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Items ({getCartItemsCount()})</span>
//                   <span>{formatCurrency(getCartTotal())}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Shipping</span>
//                   <span className="text-success">FREE</span>
//                 </div>
//                 <hr />
//                 <div className="d-flex justify-content-between mb-3">
//                   <strong>Total</strong>
//                   <strong className="text-primary">{formatCurrency(getCartTotal())}</strong>
//                 </div>
                
//                 <button
//                   className="btn btn-success w-100 btn-lg"
//                   onClick={() => setCurrentView('options')}
//                   disabled={isLoading}
//                 >
//                   <i className="bi bi-credit-card me-2"></i>
//                   Proceed to Checkout
//                 </button>
                
//               </div>
//             </div>

//             <div className="card shadow-sm">
//               <div className="card-body text-center">
//                 <i className="bi bi-shield-check text-success display-6 mb-2"></i>
//                 <h6 className="mb-2">Secure Checkout</h6>
//                 <small className="text-muted">
//                   Your information is protected with industry-standard encryption
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {currentView === 'options' && (
//         <div className="row mt-4">
//           <div className="col-12 col-md-8 offset-md-2">
//             <div className="card shadow-sm p-4 text-center">
//               <h4 className="mb-3">How would you like to check out?</h4>
              
//               {/* Show different options based on authentication status */}
//               {!isAuthenticated && (
//                 <>
//                   <div className="d-grid gap-2 mb-3">
//                     <Link to="/login" className="btn btn-primary btn-lg">
//                       <i className="bi bi-person-circle me-2"></i>
//                       Log In to Your Account
//                     </Link>
//                   </div>
//                   <div className="d-grid gap-2 mb-3">
//                     <Link to="/register" className="btn btn-outline-primary btn-lg">
//                       <i className="bi bi-person-plus me-2"></i>
//                       Create New Account
//                     </Link>
//                   </div>
//                   <hr />
//                   <button
//                     className="btn btn-link btn-lg text-secondary"
//                     onClick={() => setCurrentView('checkout')}
//                   >
//                     <i className="bi bi-person me-2"></i>
//                     Continue as a Guest
//                   </button>
//                 </>
//               )}

//               {/* If user is already authenticated, go directly to checkout */}
//               {isAuthenticated && (
//                 <button
//                   className="btn btn-success btn-lg w-100"
//                   onClick={() => setCurrentView('checkout')}
//                 >
//                   <i className="bi bi-credit-card me-2"></i>
//                   Proceed to Checkout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {currentView === 'checkout' && (
//         <div className="row mt-4">
//           <div className="col-12">
//             <div className="card shadow">
//               <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
//                 <h5 className="mb-0">
//                   <i className="bi bi-person-check me-2"></i>
//                   {isAuthenticated ? 'Confirm Your Order' : 'Customer Information & Payment'}
//                 </h5>
//                 <button 
//                   className="btn btn-outline-light btn-sm"
//                   onClick={() => setCurrentView('cart')}
//                 >
//                   <i className="bi bi-x-circle me-1"></i>
//                   Cancel
//                 </button>
//               </div>
//               <div className="card-body">
//                 <form onSubmit={handleCheckout}>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="name" className="form-label">
//                         Full Name <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="name"
//                         name="name"
//                         value={customerInfo.name}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="Enter your full name"
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="email" className="form-label">
//                         Email Address <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         id="email"
//                         name="email"
//                         value={customerInfo.email}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="Enter your email address"
//                       />
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="phone" className="form-label">
//                         Phone Number <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         id="phone"
//                         name="phone"
//                         value={customerInfo.phone}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="Enter your phone number"
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="city" className="form-label">City</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         id="city"
//                         name="city"
//                         value={customerInfo.city}
//                         onChange={handleInputChange}
//                         disabled={isLoading}
//                         placeholder="Enter your city"
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="address" className="form-label">Delivery Address</label>
//                     <textarea
//                       className="form-control"
//                       id="address"
//                       name="address"
//                       rows="3"
//                       value={customerInfo.address}
//                       onChange={handleInputChange}
//                       disabled={isLoading}
//                       placeholder="Enter your full delivery address"
//                     ></textarea>
//                   </div>

//                   <div className="mb-3">
//                     <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//                     <textarea
//                       className="form-control"
//                       id="notes"
//                       name="notes"
//                       rows="2"
//                       value={customerInfo.notes}
//                       onChange={handleInputChange}
//                       disabled={isLoading}
//                       placeholder="Any special instructions for your order"
//                     ></textarea>
//                   </div>

//                   <div className="mb-4">
//                     <h6 className="mb-3">
//                       <i className="bi bi-credit-card me-2"></i>
//                       Payment Method <span className="text-danger">*</span>
//                     </h6>
//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="paymentMethod"
//                             id="cod"
//                             value="cod"
//                             checked={customerInfo.paymentMethod === 'cod'}
//                             onChange={handleInputChange}
//                             disabled={isLoading}
//                           />
//                           <label className="form-check-label" htmlFor="cod">
//                             <div className="d-flex align-items-center">
//                               <i className="bi bi-cash-coin text-success me-2"></i>
//                               <div>
//                                 <strong>Cash on Delivery</strong>
//                                 <br />
//                                 <small className="text-muted">Pay when your order arrives</small>
//                               </div>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                       <div className="col-md-6 mb-3">
//                         <div className="form-check">
//                           <input
//                             className="form-check-input"
//                             type="radio"
//                             name="paymentMethod"
//                             id="momo"
//                             value="momo"
//                             checked={customerInfo.paymentMethod === 'momo'}
//                             onChange={(e) => {
//                               handleInputChange(e);
//                               if (e.target.value === 'momo') {
//                                 setShowPaymentDetails(true);
//                               } else {
//                                 setShowPaymentDetails(false);
//                                 setPaymentProof(null);
//                               }
//                             }}
//                             disabled={isLoading}
//                           />
//                           <label className="form-check-label" htmlFor="momo">
//                             <div className="d-flex align-items-center">
//                               <i className="bi bi-phone text-primary me-2"></i>
//                               <div>
//                                 <strong>Mobile Money</strong>
//                                 <br />
//                                 <small className="text-muted">Pay with your mobile money</small>
//                               </div>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     {customerInfo.paymentMethod === 'momo' && (
//                       <div className="card border-primary mt-3">
//                         <div className="card-header bg-light">
//                           <h6 className="mb-0">Mobile Money Payment</h6>
//                         </div>
//                         <div className="card-body">
//                           <div className="row">
//                             <div className="col-md-6 mb-3">
//                               <label htmlFor="momoNetwork" className="form-label">
//                                 Your Network <span className="text-danger">*</span>
//                               </label>
//                               <select
//                                 className="form-select"
//                                 id="momoNetwork"
//                                 name="momoNetwork"
//                                 value={customerInfo.momoNetwork}
//                                 onChange={handleInputChange}
//                                 required
//                                 disabled={isLoading}
//                               >
//                                 <option value="mtn">MTN Mobile Money</option>
//                                 <option value="airtel">Airtel Money</option>
//                               </select>
//                             </div>
//                             <div className="col-md-6 mb-3">
//                               <label htmlFor="momoNumber" className="form-label">
//                                 Your Mobile Money Number <span className="text-danger">*</span>
//                               </label>
//                               <input
//                                 type="tel"
//                                 className="form-control"
//                                 id="momoNumber"
//                                 name="momoNumber"
//                                 value={customerInfo.momoNumber}
//                                 onChange={handleInputChange}
//                                 required
//                                 disabled={isLoading}
//                                 placeholder="e.g., 0771234567"
//                               />
//                             </div>
//                           </div>
                          
//                           {renderPaymentInstructions()}

//                           <div className="mb-3">
//                             <label htmlFor="paymentProof" className="form-label">
//                               Upload Payment Proof <span className="text-danger">*</span>
//                             </label>
//                             <input
//                               type="file"
//                               className="form-control"
//                               id="paymentProof"
//                               name="paymentProof"
//                               accept="image/jpeg, image/png, image/webp"
//                               onChange={handleFileUpload}
//                               disabled={isLoading}
//                               required
//                             />
//                             <div className="form-text">
//                               Upload a clear screenshot of your payment confirmation. Max file size: 5MB
//                             </div>
//                             {paymentProof && (
//                               <div className="mt-2">
//                                 <small className="text-success">
//                                   <i className="bi bi-check-circle me-1"></i>
//                                   File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
//                                 </small>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="d-grid gap-2">
//                     <button 
//                       type="submit" 
//                       className="btn btn-lg btn-success" 
//                       disabled={isLoading}
//                     >
//                       {isLoading ? (
//                         <>
//                           <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <i className="bi bi-check-circle me-2"></i>
//                           Place Order ({formatCurrency(getCartTotal())})
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;



//AUTHENTICATED USER CHECKOUT COMPONENT FEW DETAILS

// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     checkout,
//     isLoading,
//     isAuthenticated
//   } = useContext(CartContext);

//   const [currentView, setCurrentView] = useState('cart');
//   const [userProfile, setUserProfile] = useState(null);

//   // Separate state for guest users (full form)
//   const [guestInfo, setGuestInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod',
//     momoNumber: '',
//     momoNetwork: 'mtn'
//   });

//   // Minimal state for authenticated users (just delivery & payment)
//   const [authUserInfo, setAuthUserInfo] = useState({
//     deliveryAddress: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod',
//     momoNumber: '',
//     momoNetwork: 'mtn'
//   });

//   const [checkoutError, setCheckoutError] = useState('');
//   const [checkoutSuccess, setCheckoutSuccess] = useState('');
//   const [paymentProof, setPaymentProof] = useState(null);

//   const MOMO_MERCHANTS = {
//     mtn: {
//       name: 'MTN Mobile Money',
//       number: '0771234567',
//       accountName: 'TechStore Uganda Ltd'
//     },
//     airtel: {
//       name: 'Airtel Money',
//       number: '0700123456',
//       accountName: 'TechStore Uganda Ltd'
//     }
//   };

//   // Fetch user profile for authenticated users
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (isAuthenticated) {
//         try {
//           const token = sessionStorage.getItem('token');
//           const decoded = jwtDecode(token);
          
//           // You can either decode from JWT or make an API call to get user details
//           // For now, I'll show how to extract from JWT (adjust based on your JWT structure)
//           setUserProfile({
//             id: decoded.sub || decoded.user_id,
//             name: decoded.name || decoded.username || 'User',
//             email: decoded.email || '',
//             phone: decoded.phone || ''
//           });
//         } catch (error) {
//           console.error('Failed to get user profile:', error);
//         }
//       }
//     };

//     fetchUserProfile();
//   }, [isAuthenticated]);

//   const handleQuantityChange = (productId, newQuantity) => {
//     if (newQuantity < 1) {
//       handleRemoveItem(productId);
//     } else {
//       updateQuantity(productId, newQuantity);
//     }
//   };

//   const handleRemoveItem = (productId) => {
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       removeFromCart(productId);
//     }
//   };

//   const handleClearCart = () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       clearCart();
//     }
//   };

//   // Handle input changes for guest users
//   const handleGuestInputChange = (e) => {
//     const { name, value } = e.target;
//     setGuestInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle input changes for authenticated users (minimal form)
//   const handleAuthInputChange = (e) => {
//     const { name, value } = e.target;
//     setAuthUserInfo(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       const maxSize = 5 * 1024 * 1024; // 5MB
      
//       if (!allowedTypes.includes(file.type)) {
//         setCheckoutError('Please upload a valid image file (JPEG, PNG, or WebP)');
//         e.target.value = '';
//         return;
//       }
      
//       if (file.size > maxSize) {
//         setCheckoutError('File size must be less than 5MB');
//         e.target.value = '';
//         return;
//       }
      
//       setPaymentProof(file);
//       setCheckoutError('');
//     }
//   };

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setCheckoutError('');
//     setCheckoutSuccess('');

//     try {
//       const formData = new FormData();
      
//       if (isAuthenticated) {
//         // AUTHENTICATED USER - Use minimal info + profile data
//         const customerInfo = {
//           name: userProfile?.name || 'User',
//           email: userProfile?.email || '',
//           phone: userProfile?.phone || '',
//           address: authUserInfo.deliveryAddress,
//           city: authUserInfo.city,
//           notes: authUserInfo.notes,
//           paymentMethod: authUserInfo.paymentMethod,
//           momoNumber: authUserInfo.momoNumber,
//           momoNetwork: authUserInfo.momoNetwork
//         };

//         // Minimal validation for authenticated users
//         if (authUserInfo.paymentMethod === 'momo') {
//           if (!authUserInfo.momoNumber) {
//             setCheckoutError('Please enter your Mobile Money number');
//             return;
//           }
//           if (!paymentProof) {
//             setCheckoutError('Please upload proof of payment for Mobile Money transactions');
//             return;
//           }
//         }

//         formData.append('customerInfo', JSON.stringify(customerInfo));
        
//       } else {
//         // GUEST USER - Full validation
//         if (!guestInfo.name?.trim()) {
//           setCheckoutError('Please enter your full name');
//           return;
//         }
//         if (!guestInfo.email?.trim() || !guestInfo.email.includes('@')) {
//           setCheckoutError('Please enter a valid email address');
//           return;
//         }
//         if (!guestInfo.phone?.trim()) {
//           setCheckoutError('Please enter your phone number');
//           return;
//         }
        
//         if (guestInfo.paymentMethod === 'momo') {
//           if (!guestInfo.momoNumber) {
//             setCheckoutError('Please enter your Mobile Money number');
//             return;
//           }
//           if (!paymentProof) {
//             setCheckoutError('Please upload proof of payment');
//             return;
//           }
//         }

//         const customerInfo = {
//           name: guestInfo.name.trim(),
//           email: guestInfo.email.trim(),
//           phone: guestInfo.phone.trim(),
//           address: guestInfo.address,
//           city: guestInfo.city,
//           notes: guestInfo.notes,
//           paymentMethod: guestInfo.paymentMethod,
//           momoNumber: guestInfo.momoNumber,
//           momoNetwork: guestInfo.momoNetwork
//         };

//         formData.append('customerInfo', JSON.stringify(customerInfo));
//         formData.append('cart', JSON.stringify(cart));
//       }

//       formData.append('total', getCartTotal().toString());
      
//       if (paymentProof) {
//         formData.append('paymentProof', paymentProof);
//       }
      
//       const result = await checkout(formData);
      
//       if (result.success) {
//         const currentPaymentMethod = isAuthenticated ? authUserInfo.paymentMethod : guestInfo.paymentMethod;
//         const paymentMessage = currentPaymentMethod === 'cod' 
//           ? 'Order placed successfully! You will pay cash on delivery.'
//           : 'Order placed successfully! We have received your payment proof and will verify it shortly.';
        
//         setCheckoutSuccess(paymentMessage);
//         setCurrentView('cart');
//         setPaymentProof(null);
        
//         // Reset forms
//         if (isAuthenticated) {
//           setAuthUserInfo({
//             deliveryAddress: '',
//             city: '',
//             notes: '',
//             paymentMethod: 'cod',
//             momoNumber: '',
//             momoNetwork: 'mtn'
//           });
//         } else {
//           setGuestInfo({
//             name: '',
//             email: '',
//             phone: '',
//             address: '',
//             city: '',
//             notes: '',
//             paymentMethod: 'cod',
//             momoNumber: '',
//             momoNetwork: 'mtn'
//           });
//         }
        
//         const fileInput = document.getElementById('paymentProof');
//         if (fileInput) fileInput.value = '';
        
//       } else {
//         setCheckoutError(result.error || 'Checkout failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Checkout error:', error);
//       setCheckoutError('Checkout failed. Please try again.');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `UGX ${amount.toLocaleString()}`;
//   };

//   const renderPaymentInstructions = () => {
//     const currentPaymentMethod = isAuthenticated ? authUserInfo.paymentMethod : guestInfo.paymentMethod;
//     const currentNetwork = isAuthenticated ? authUserInfo.momoNetwork : guestInfo.momoNetwork;
    
//     if (currentPaymentMethod !== 'momo') return null;
    
//     const merchant = MOMO_MERCHANTS[currentNetwork];
//     return (
//       <div className="alert alert-info">
//         <i className="bi bi-info-circle me-2"></i>
//         <strong>Payment Instructions:</strong>
//         <ol className="mb-0 mt-2">
//           <li>Send <strong>{formatCurrency(getCartTotal())}</strong> to <strong>{merchant.number}</strong></li>
//           <li>Account Name: <strong>{merchant.accountName}</strong></li>
//           <li>Network: <strong>{merchant.name}</strong></li>
//           <li>Take a screenshot of the payment confirmation</li>
//           <li>Upload the screenshot below</li>
//         </ol>
//       </div>
//     );
//   };

//   // Render authenticated user checkout form (streamlined)
//   const renderAuthenticatedCheckout = () => (
//     <div className="card shadow">
//       <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
//         <h5 className="mb-0">
//           <i className="bi bi-person-check me-2"></i>
//           Complete Your Order
//         </h5>
//         <button 
//           className="btn btn-outline-light btn-sm"
//           onClick={() => setCurrentView('cart')}
//         >
//           <i className="bi bi-x-circle me-1"></i>
//           Back to Cart
//         </button>
//       </div>
//       <div className="card-body">
//         {/* User Info Display */}
//         <div className="alert alert-info">
//           <i className="bi bi-person-circle me-2"></i>
//           <strong>Ordering as:</strong> {userProfile?.name} ({userProfile?.email})
//         </div>

//         <form onSubmit={handleCheckout}>
//           <h6 className="mb-3">
//             <i className="bi bi-truck me-2"></i>
//             Delivery Information
//           </h6>
          
//           <div className="row">
//             <div className="col-md-8 mb-3">
//               <label htmlFor="deliveryAddress" className="form-label">
//                 Delivery Address <span className="text-danger">*</span>
//               </label>
//               <textarea
//                 className="form-control"
//                 id="deliveryAddress"
//                 name="deliveryAddress"
//                 rows="2"
//                 value={authUserInfo.deliveryAddress}
//                 onChange={handleAuthInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your full delivery address"
//               ></textarea>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label htmlFor="city" className="form-label">City</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="city"
//                 name="city"
//                 value={authUserInfo.city}
//                 onChange={handleAuthInputChange}
//                 disabled={isLoading}
//                 placeholder="Enter your city"
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//             <textarea
//               className="form-control"
//               id="notes"
//               name="notes"
//               rows="2"
//               value={authUserInfo.notes}
//               onChange={handleAuthInputChange}
//               disabled={isLoading}
//               placeholder="Any special instructions for your order"
//             ></textarea>
//           </div>

//           {/* Payment Method */}
//           <div className="mb-4">
//             <h6 className="mb-3">
//               <i className="bi bi-credit-card me-2"></i>
//               Payment Method <span className="text-danger">*</span>
//             </h6>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="cod"
//                     value="cod"
//                     checked={authUserInfo.paymentMethod === 'cod'}
//                     onChange={handleAuthInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="cod">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-cash-coin text-success me-2"></i>
//                       <div>
//                         <strong>Cash on Delivery</strong>
//                         <br />
//                         <small className="text-muted">Pay when your order arrives</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="momo"
//                     value="momo"
//                     checked={authUserInfo.paymentMethod === 'momo'}
//                     onChange={handleAuthInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="momo">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-phone text-primary me-2"></i>
//                       <div>
//                         <strong>Mobile Money</strong>
//                         <br />
//                         <small className="text-muted">Pay with your mobile money</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {authUserInfo.paymentMethod === 'momo' && (
//               <div className="card border-primary mt-3">
//                 <div className="card-header bg-light">
//                   <h6 className="mb-0">Mobile Money Payment</h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="momoNetwork" className="form-label">
//                         Your Network <span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         id="momoNetwork"
//                         name="momoNetwork"
//                         value={authUserInfo.momoNetwork}
//                         onChange={handleAuthInputChange}
//                         required
//                         disabled={isLoading}
//                       >
//                         <option value="mtn">MTN Mobile Money</option>
//                         <option value="airtel">Airtel Money</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="momoNumber" className="form-label">
//                         Your Mobile Money Number <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         id="momoNumber"
//                         name="momoNumber"
//                         value={authUserInfo.momoNumber}
//                         onChange={handleAuthInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="e.g., 0771234567"
//                       />
//                     </div>
//                   </div>
                  
//                   {renderPaymentInstructions()}

//                   <div className="mb-3">
//                     <label htmlFor="paymentProof" className="form-label">
//                       Upload Payment Proof <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       id="paymentProof"
//                       name="paymentProof"
//                       accept="image/jpeg, image/png, image/webp"
//                       onChange={handleFileUpload}
//                       disabled={isLoading}
//                       required
//                     />
//                     <div className="form-text">
//                       Upload a clear screenshot of your payment confirmation. Max file size: 5MB
//                     </div>
//                     {paymentProof && (
//                       <div className="mt-2">
//                         <small className="text-success">
//                           <i className="bi bi-check-circle me-1"></i>
//                           File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
//                         </small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="d-grid gap-2">
//             <button 
//               type="submit" 
//               className="btn btn-lg btn-success" 
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   Place Order ({formatCurrency(getCartTotal())})
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   // Render guest checkout form (full form)
//   const renderGuestCheckout = () => (
//     <div className="card shadow">
//       <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
//         <h5 className="mb-0">
//           <i className="bi bi-person me-2"></i>
//           Customer Information & Payment
//         </h5>
//         <button 
//           className="btn btn-outline-light btn-sm"
//           onClick={() => setCurrentView('options')}
//         >
//           <i className="bi bi-x-circle me-1"></i>
//           Back
//         </button>
//       </div>
//       <div className="card-body">
//         <form onSubmit={handleCheckout}>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="name" className="form-label">
//                 Full Name <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="name"
//                 name="name"
//                 value={guestInfo.name}
//                 onChange={handleGuestInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your full name"
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label htmlFor="email" className="form-label">
//                 Email Address <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 name="email"
//                 value={guestInfo.email}
//                 onChange={handleGuestInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your email address"
//               />
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="phone" className="form-label">
//                 Phone Number <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="tel"
//                 className="form-control"
//                 id="phone"
//                 name="phone"
//                 value={guestInfo.phone}
//                 onChange={handleGuestInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your phone number"
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label htmlFor="city" className="form-label">City</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="city"
//                 name="city"
//                 value={guestInfo.city}
//                 onChange={handleGuestInputChange}
//                 disabled={isLoading}
//                 placeholder="Enter your city"
//               />
//             </div>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="address" className="form-label">Delivery Address</label>
//             <textarea
//               className="form-control"
//               id="address"
//               name="address"
//               rows="3"
//               value={guestInfo.address}
//               onChange={handleGuestInputChange}
//               disabled={isLoading}
//               placeholder="Enter your full delivery address"
//             ></textarea>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//             <textarea
//               className="form-control"
//               id="notes"
//               name="notes"
//               rows="2"
//               value={guestInfo.notes}
//               onChange={handleGuestInputChange}
//               disabled={isLoading}
//               placeholder="Any special instructions for your order"
//             ></textarea>
//           </div>

//           {/* Payment Method - Same as authenticated but using guestInfo */}
//           <div className="mb-4">
//             <h6 className="mb-3">
//               <i className="bi bi-credit-card me-2"></i>
//               Payment Method <span className="text-danger">*</span>
//             </h6>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="guest-cod"
//                     value="cod"
//                     checked={guestInfo.paymentMethod === 'cod'}
//                     onChange={handleGuestInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="guest-cod">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-cash-coin text-success me-2"></i>
//                       <div>
//                         <strong>Cash on Delivery</strong>
//                         <br />
//                         <small className="text-muted">Pay when your order arrives</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="guest-momo"
//                     value="momo"
//                     checked={guestInfo.paymentMethod === 'momo'}
//                     onChange={handleGuestInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="guest-momo">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-phone text-primary me-2"></i>
//                       <div>
//                         <strong>Mobile Money</strong>
//                         <br />
//                         <small className="text-muted">Pay with your mobile money</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {guestInfo.paymentMethod === 'momo' && (
//               <div className="card border-primary mt-3">
//                 <div className="card-header bg-light">
//                   <h6 className="mb-0">Mobile Money Payment</h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="guest-momoNetwork" className="form-label">
//                         Your Network <span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         id="guest-momoNetwork"
//                         name="momoNetwork"
//                         value={guestInfo.momoNetwork}
//                         onChange={handleGuestInputChange}
//                         required
//                         disabled={isLoading}
//                       >
//                         <option value="mtn">MTN Mobile Money</option>
//                         <option value="airtel">Airtel Money</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="guest-momoNumber" className="form-label">
//                         Your Mobile Money Number <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         id="guest-momoNumber"
//                         name="momoNumber"
//                         value={guestInfo.momoNumber}
//                         onChange={handleGuestInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="e.g., 0771234567"
//                       />
//                     </div>
//                   </div>
                  
//                   {renderPaymentInstructions()}

//                   <div className="mb-3">
//                     <label htmlFor="guest-paymentProof" className="form-label">
//                       Upload Payment Proof <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       id="guest-paymentProof"
//                       name="paymentProof"
//                       accept="image/jpeg, image/png, image/webp"
//                       onChange={handleFileUpload}
//                       disabled={isLoading}
//                       required
//                     />
//                     <div className="form-text">
//                       Upload a clear screenshot of your payment confirmation. Max file size: 5MB
//                     </div>
//                     {paymentProof && (
//                       <div className="mt-2">
//                         <small className="text-success">
//                           <i className="bi bi-check-circle me-1"></i>
//                           File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
//                         </small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="d-grid gap-2">
//             <button 
//               type="submit" 
//               className="btn btn-lg btn-success" 
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   Place Order ({formatCurrency(getCartTotal())})
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   // Empty cart display
//   if (cart.length === 0) {
//     return (
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-8 text-center">
//             <div className="empty-cart-container p-5">
//               <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
//               <h2 className="mb-3">Your Cart is Empty</h2>
//               <p className="text-muted mb-4">
//                 Looks like you haven't added any products to your cart yet. 
//                 Start shopping to build your perfect setup!
//               </p>
//               <Link to="/products" className="btn btn-primary btn-lg px-4">
//                 <i className="bi bi-arrow-left me-2"></i>
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>

//           {checkoutSuccess && (
//             <div className="row justify-content-center mt-4">
//               <div className="col-md-8">
//                 <div className="alert alert-success text-center" role="alert">
//                   <i className="bi bi-check-circle me-2"></i>
//                   {checkoutSuccess}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         <div className="col-12">
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item">
//                 <Link to="/products">Products</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">Cart</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="mb-0">
//               <i className="bi bi-cart3 me-2"></i>
//               Shopping Cart ({getCartItemsCount()} items)
//             </h2>
//             <button 
//               className="btn btn-outline-danger btn-sm"
//               onClick={handleClearCart}
//               disabled={isLoading}
//             >
//               <i className="bi bi-trash me-1"></i>
//               Clear Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {checkoutError && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-danger" role="alert">
//               <i className="bi bi-exclamation-triangle me-2"></i>
//               {checkoutError}
//             </div>
//           </div>
//         </div>
//       )}

//       {checkoutSuccess && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-success" role="alert">
//               <i className="bi bi-check-circle me-2"></i>
//               {checkoutSuccess}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CART VIEW */}
//       {currentView === 'cart' && (
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-light">
//                 <h5 className="mb-0">Cart Items</h5>
//               </div>
//               <div className="card-body p-0">
//                 {cart.map((item, index) => (
//                   <div key={item.id} className={`cart-item p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
//                     <div className="row align-items-center">
//                       <div className="col-md-2 col-sm-3">
//                         <img
//                           src={item.image_url || '/api/placeholder/100/100'}
//                           alt={item.name}
//                           className="img-fluid rounded"
//                           style={{ maxHeight: '80px', objectFit: 'cover' }}
//                           onError={(e) => {
//                             e.target.src = '/api/placeholder/100/100';
//                           }}
//                         />
//                       </div>
//                       <div className="col-md-4 col-sm-9">
//                         <h6 className="mb-1">{item.name}</h6>
//                         <small className="text-muted">
//                           {item.description && item.description.length > 50 
//                             ? `${item.description.substring(0, 50)}...` 
//                             : item.description
//                           }
//                         </small>
//                       </div>
//                       <div className="col-md-2 col-6 mt-2 mt-md-0">
//                         <label className="form-label small">Price</label>
//                         <div className="fw-bold text-primary">
//                           {formatCurrency(item.price)}
//                         </div>
//                       </div>
//                       <div className="col-md-2 col-6 mt-2 mt-md-0">
//                         <label htmlFor={`quantity-${item.id}`} className="form-label small">Quantity</label>
//                         <div className="input-group input-group-sm">
//                           <button
//                             className="btn btn-outline-secondary"
//                             type="button"
//                             onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                             disabled={isLoading}
//                           >
//                             <i className="bi bi-dash"></i>
//                           </button>
//                           <input
//                             type="number"
//                             className="form-control text-center"
//                             id={`quantity-${item.id}`}
//                             value={item.quantity}
//                             min="1"
//                             onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
//                             disabled={isLoading}
//                           />
//                           <button
//                             className="btn btn-outline-secondary"
//                             type="button"
//                             onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                             disabled={isLoading}
//                           >
//                             <i className="bi bi-plus"></i>
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-md-1 col-6 mt-2 mt-md-0">
//                         <label className="form-label small">Total</label>
//                         <div className="fw-bold">
//                           {formatCurrency(item.price * item.quantity)}
//                         </div>
//                       </div>
//                       <div className="col-md-1 col-6 mt-2 mt-md-0 text-end">
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => handleRemoveItem(item.id)}
//                           disabled={isLoading}
//                           title="Remove item"
//                         >
//                           <i className="bi bi-trash"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Link to="/products" className="btn btn-outline-primary">
//               <i className="bi bi-arrow-left me-2"></i>
//               Continue Shopping
//             </Link>
//           </div>

//           <div className="col-lg-4">
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-primary text-white">
//                 <h5 className="mb-0">Order Summary</h5>
//               </div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Items ({getCartItemsCount()})</span>
//                   <span>{formatCurrency(getCartTotal())}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Shipping</span>
//                   <span className="text-success">FREE</span>
//                 </div>
//                 <hr />
//                 <div className="d-flex justify-content-between mb-3">
//                   <strong>Total</strong>
//                   <strong className="text-primary">{formatCurrency(getCartTotal())}</strong>
//                 </div>
                
//                 <button
//                   className="btn btn-success w-100 btn-lg"
//                   onClick={() => setCurrentView('options')}
//                   disabled={isLoading}
//                 >
//                   <i className="bi bi-credit-card me-2"></i>
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>

//             <div className="card shadow-sm">
//               <div className="card-body text-center">
//                 <i className="bi bi-shield-check text-success display-6 mb-2"></i>
//                 <h6 className="mb-2">Secure Checkout</h6>
//                 <small className="text-muted">
//                   Your information is protected with industry-standard encryption
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* OPTIONS VIEW - Login/Guest Choice */}
//       {currentView === 'options' && (
//         <div className="row mt-4">
//           <div className="col-12 col-md-8 offset-md-2">
//             <div className="card shadow-sm p-4 text-center">
//               <h4 className="mb-3">How would you like to check out?</h4>
              
//               {!isAuthenticated ? (
//                 <>
//                   <div className="d-grid gap-2 mb-3">
//                     <Link to="/login" className="btn btn-primary btn-lg">
//                       <i className="bi bi-person-circle me-2"></i>
//                       Log In to Your Account
//                     </Link>
//                   </div>
//                   <div className="d-grid gap-2 mb-3">
//                     <Link to="/register" className="btn btn-outline-primary btn-lg">
//                       <i className="bi bi-person-plus me-2"></i>
//                       Create New Account
//                     </Link>
//                   </div>
//                   <hr />
//                   <button
//                     className="btn btn-link btn-lg text-secondary"
//                     onClick={() => setCurrentView('checkout')}
//                   >
//                     <i className="bi bi-person me-2"></i>
//                     Continue as a Guest
//                   </button>
//                 </>
//               ) : (
//                 <div>
//                   <div className="alert alert-info mb-4">
//                     <i className="bi bi-person-check me-2"></i>
//                     Welcome back, <strong>{userProfile?.name || 'User'}</strong>!
//                   </div>
//                   <button
//                     className="btn btn-success btn-lg w-100 mb-3"
//                     onClick={() => setCurrentView('checkout')}
//                   >
//                     <i className="bi bi-credit-card me-2"></i>
//                     Continue to Checkout
//                   </button>
//                   <small className="text-muted d-block">
//                     We'll use your saved account information to speed up checkout
//                   </small>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CHECKOUT VIEW */}
//       {currentView === 'checkout' && (
//         <div className="row mt-4">
//           <div className="col-12">
//             {isAuthenticated ? renderAuthenticatedCheckout() : renderGuestCheckout()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;


// import React, { useContext, useState, useEffect } from 'react';
// import { CartContext } from '../context/CartContext';
// import { Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const Cart = () => {
//   const {
//     cart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     checkout,
//     isLoading,
//     isAuthenticated
//   } = useContext(CartContext);

//   const [currentView, setCurrentView] = useState('cart');
//   const [userProfile, setUserProfile] = useState(null);
//   const [guestInfo, setGuestInfo] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod',
//     momoNumber: '',
//     momoNetwork: 'mtn'
//   });
//   const [authUserInfo, setAuthUserInfo] = useState({
//     deliveryAddress: '',
//     city: '',
//     notes: '',
//     paymentMethod: 'cod',
//     momoNumber: '',
//     momoNetwork: 'mtn'
//   });
//   const [checkoutError, setCheckoutError] = useState('');
//   const [checkoutSuccess, setCheckoutSuccess] = useState('');
//   const [paymentProof, setPaymentProof] = useState(null);

//   const MOMO_MERCHANTS = {
//     mtn: {
//       name: 'MTN Mobile Money',
//       number: '0771234567',
//       accountName: 'TechStore Uganda Ltd'
//     },
//     airtel: {
//       name: 'Airtel Money',
//       number: '0700123456',
//       accountName: 'TechStore Uganda Ltd'
//     }
//   };

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       if (isAuthenticated) {
//         try {
//           const token = sessionStorage.getItem('token');
//           if (!token) {
//             console.error('No token found');
//             setCheckoutError('No authentication token found. Please log in again.');
//             return;
//           }
//           const decoded = jwtDecode(token);
//           setUserProfile({
//             id: decoded.sub || decoded.user_id,
//             name: decoded.name || `${decoded.first_name} ${decoded.last_name}` || 'User',
//             email: decoded.email || '',
//             phone: decoded.contact || ''
//           });
//         } catch (error) {
//           console.error('Failed to get user profile:', error);
//           setCheckoutError('Failed to load user profile. Please log in again.');
//         }
//       }
//     };
//     fetchUserProfile();
//   }, [isAuthenticated]);

//   const handleQuantityChange = (productId, newQuantity) => {
//     if (newQuantity < 1) {
//       handleRemoveItem(productId);
//     } else {
//       updateQuantity(productId, newQuantity);
//     }
//   };

//   const handleRemoveItem = (productId) => {
//     if (window.confirm('Are you sure you want to remove this item from your cart?')) {
//       removeFromCart(productId);
//     }
//   };

//   const handleClearCart = () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       clearCart();
//     }
//   };

//   const handleGuestInputChange = (e) => {
//     const { name, value } = e.target;
//     setGuestInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAuthInputChange = (e) => {
//     const { name, value } = e.target;
//     setAuthUserInfo(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (!allowedTypes.includes(file.type)) {
//         setCheckoutError('Please upload a valid image file (JPEG, PNG, or WebP)');
//         e.target.value = '';
//         return;
//       }
//       if (file.size > maxSize) {
//         setCheckoutError('File size must be less than 5MB');
//         e.target.value = '';
//         return;
//       }
//       setPaymentProof(file);
//       setCheckoutError('');
//     }
//   };

//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     setCheckoutError('');
//     setCheckoutSuccess('');

//     try {
//       const formData = new FormData();

//       if (isAuthenticated) {
//         if (!userProfile?.email || !userProfile?.phone) {
//           setCheckoutError('Missing email or phone in your profile. Please update your account details.');
//           return;
//         }
//         const customerInfo = {
//           name: userProfile.name || 'User',
//           email: userProfile.email,
//           phone: userProfile.phone,  // Maps to contact in backend
//           address: authUserInfo.deliveryAddress,
//           city: authUserInfo.city,
//           notes: authUserInfo.notes,
//           paymentMethod: authUserInfo.paymentMethod,
//           momoNumber: authUserInfo.momoNumber,
//           momoNetwork: authUserInfo.momoNetwork
//         };

//         if (!customerInfo.address?.trim()) {
//           setCheckoutError('Please enter your delivery address');
//           return;
//         }
//         if (authUserInfo.paymentMethod === 'momo') {
//           if (!authUserInfo.momoNumber) {
//             setCheckoutError('Please enter your Mobile Money number');
//             return;
//           }
//           if (!paymentProof) {
//             setCheckoutError('Please upload proof of payment for Mobile Money transactions');
//             return;
//           }
//         }

//         formData.append('customerInfo', JSON.stringify(customerInfo));
//       } else {
//         if (!guestInfo.name?.trim()) {
//           setCheckoutError('Please enter your full name');
//           return;
//         }
//         if (!guestInfo.email?.trim() || !guestInfo.email.includes('@')) {
//           setCheckoutError('Please enter a valid email address');
//           return;
//         }
//         if (!guestInfo.phone?.trim()) {
//           setCheckoutError('Please enter your phone number');
//           return;
//         }
//         if (!guestInfo.address?.trim()) {
//           setCheckoutError('Please enter your delivery address');
//           return;
//         }
//         if (guestInfo.paymentMethod === 'momo') {
//           if (!guestInfo.momoNumber) {
//             setCheckoutError('Please enter your Mobile Money number');
//             return;
//           }
//           if (!paymentProof) {
//             setCheckoutError('Please upload proof of payment');
//             return;
//           }
//         }

//         const customerInfo = {
//           name: guestInfo.name.trim(),
//           email: guestInfo.email.trim(),
//           phone: guestInfo.phone.trim(),
//           address: guestInfo.address,
//           city: guestInfo.city,
//           notes: guestInfo.notes,
//           paymentMethod: guestInfo.paymentMethod,
//           momoNumber: guestInfo.momoNumber,
//           momoNetwork: guestInfo.momoNetwork
//         };

//         formData.append('customerInfo', JSON.stringify(customerInfo));
//         formData.append('cart', JSON.stringify(cart));
//       }

//       formData.append('total', getCartTotal().toString());
//       if (paymentProof) {
//         formData.append('paymentProof', paymentProof);
//       }

//       const result = await checkout(formData);

//       if (result.success) {
//         const currentPaymentMethod = isAuthenticated ? authUserInfo.paymentMethod : guestInfo.paymentMethod;
//         const paymentMessage = currentPaymentMethod === 'cod'
//           ? 'Order placed successfully! You will pay cash on delivery.'
//           : 'Order placed successfully! We have received your payment proof and will verify it shortly.';

//         setCheckoutSuccess(paymentMessage);
//         setCurrentView('cart');
//         setPaymentProof(null);

//         if (isAuthenticated) {
//           setAuthUserInfo({
//             deliveryAddress: '',
//             city: '',
//             notes: '',
//             paymentMethod: 'cod',
//             momoNumber: '',
//             momoNetwork: 'mtn'
//           });
//         } else {
//           setGuestInfo({
//             name: '',
//             email: '',
//             phone: '',
//             address: '',
//             city: '',
//             notes: '',
//             paymentMethod: 'cod',
//             momoNumber: '',
//             momoNetwork: 'mtn'
//           });
//         }

//         const fileInput = document.getElementById('paymentProof');
//         if (fileInput) fileInput.value = '';
//       } else {
//         setCheckoutError(result.error || 'Checkout failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Checkout error:', error);
//       setCheckoutError('Checkout failed. Please try again.');
//     }
//   };

//   const formatCurrency = (amount) => {
//     return `UGX ${amount.toLocaleString()}`;
//   };

//   const renderPaymentInstructions = () => {
//     const currentPaymentMethod = isAuthenticated ? authUserInfo.paymentMethod : guestInfo.paymentMethod;
//     const currentNetwork = isAuthenticated ? authUserInfo.momoNetwork : guestInfo.momoNetwork;

//     if (currentPaymentMethod !== 'momo') return null;

//     const merchant = MOMO_MERCHANTS[currentNetwork];
//     return (
//       <div className="alert alert-info">
//         <i className="bi bi-info-circle me-2"></i>
//         <strong>Payment Instructions:</strong>
//         <ol className="mb-0 mt-2">
//           <li>Send <strong>{formatCurrency(getCartTotal())}</strong> to <strong>{merchant.number}</strong></li>
//           <li>Account Name: <strong>{merchant.accountName}</strong></li>
//           <li>Network: <strong>{merchant.name}</strong></li>
//           <li>Take a screenshot of the payment confirmation</li>
//           <li>Upload the screenshot below</li>
//         </ol>
//       </div>
//     );
//   };

//   const renderAuthenticatedCheckout = () => (
//     <div className="card shadow">
//       <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
//         <h5 className="mb-0">
//           <i className="bi bi-person-check me-2"></i>
//           Complete Your Order
//         </h5>
//         <button
//           className="btn btn-outline-light btn-sm"
//           onClick={() => setCurrentView('cart')}
//         >
//           <i className="bi bi-x-circle me-1"></i>
//           Back to Cart
//         </button>
//       </div>
//       <div className="card-body">
//         <div className="alert alert-info">
//           <i className="bi bi-person-circle me-2"></i>
//           <strong>Ordering as:</strong> {userProfile?.name} ({userProfile?.email})
//         </div>

//         <form onSubmit={handleCheckout}>
//           <h6 className="mb-3">
//             <i className="bi bi-truck me-2"></i>
//             Delivery Information
//           </h6>
//           <div className="row">
//             <div className="col-md-8 mb-3">
//               <label htmlFor="deliveryAddress" className="form-label">
//                 Delivery Address <span className="text-danger">*</span>
//               </label>
//               <textarea
//                 className="form-control"
//                 id="deliveryAddress"
//                 name="deliveryAddress"
//                 rows="2"
//                 value={authUserInfo.deliveryAddress}
//                 onChange={handleAuthInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your full delivery address"
//               ></textarea>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label htmlFor="city" className="form-label">City</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="city"
//                 name="city"
//                 value={authUserInfo.city}
//                 onChange={handleAuthInputChange}
//                 disabled={isLoading}
//                 placeholder="Enter your city"
//               />
//             </div>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//             <textarea
//               className="form-control"
//               id="notes"
//               name="notes"
//               rows="2"
//               value={authUserInfo.notes}
//               onChange={handleAuthInputChange}
//               disabled={isLoading}
//               placeholder="Any special instructions for your order"
//             ></textarea>
//           </div>

//           <div className="mb-4">
//             <h6 className="mb-3">
//               <i className="bi bi-credit-card me-2"></i>
//               Payment Method <span className="text-danger">*</span>
//             </h6>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="cod"
//                     value="cod"
//                     checked={authUserInfo.paymentMethod === 'cod'}
//                     onChange={handleAuthInputChange} // Fixed typo
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="cod">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-cash-coin text-success me-2"></i>
//                       <div>
//                         <strong>Cash on Delivery</strong>
//                         <br />
//                         <small className="text-muted">Pay when your order arrives</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="momo"
//                     value="momo"
//                     checked={authUserInfo.paymentMethod === 'momo'}
//                     onChange={handleAuthInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="momo">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-phone text-primary me-2"></i>
//                       <div>
//                         <strong>Mobile Money</strong>
//                         <br />
//                         <small className="text-muted">Pay with your mobile money</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {authUserInfo.paymentMethod === 'momo' && (
//               <div className="card border-primary mt-3">
//                 <div className="card-header bg-light">
//                   <h6 className="mb-0">Mobile Money Payment</h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="momoNetwork" className="form-label">
//                         Your Network <span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         id="momoNetwork"
//                         name="momoNetwork"
//                         value={authUserInfo.momoNetwork}
//                         onChange={handleAuthInputChange}
//                         required
//                         disabled={isLoading}
//                       >
//                         <option value="mtn">MTN Mobile Money</option>
//                         <option value="airtel">Airtel Money</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="momoNumber" className="form-label">
//                         Your Mobile Money Number <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         id="momoNumber"
//                         name="momoNumber"
//                         value={authUserInfo.momoNumber}
//                         onChange={handleAuthInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="e.g., 0771234567"
//                       />
//                     </div>
//                   </div>

//                   {renderPaymentInstructions()}

//                   <div className="mb-3">
//                     <label htmlFor="paymentProof" className="form-label">
//                       Upload Payment Proof <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       id="paymentProof"
//                       name="paymentProof"
//                       accept="image/jpeg,image/png,image/webp"
//                       onChange={handleFileUpload}
//                       disabled={isLoading}
//                       required
//                     />
//                     <div className="form-text">
//                       Upload a clear screenshot of your payment confirmation. Max file size: 5MB
//                     </div>
//                     {paymentProof && (
//                       <div className="mt-2">
//                         <small className="text-success">
//                           <i className="bi bi-check-circle me-1"></i>
//                           File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
//                         </small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="d-grid gap-2">
//             <button
//               type="submit"
//               className="btn btn-lg btn-success"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   Place Order ({formatCurrency(getCartTotal())})
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   const renderGuestCheckout = () => (
//     <div className="card shadow">
//       <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
//         <h5 className="mb-0">
//           <i className="bi bi-person me-2"></i>
//           Customer Information & Payment
//         </h5>
//         <button
//           className="btn btn-outline-light btn-sm"
//           onClick={() => setCurrentView('options')}
//         >
//           <i className="bi bi-x-circle me-1"></i>
//           Back
//         </button>
//       </div>
//       <div className="card-body">
//         <form onSubmit={handleCheckout}>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="name" className="form-label">
//                 Full Name <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="name"
//                 name="name"
//                 value={guestInfo.name}
//                 onChange={handleGuestInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your full name"
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label htmlFor="email" className="form-label">
//                 Email Address <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="email"
//                 name="email"
//                 value={guestInfo.email}
//                 onChange={handleGuestInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your email address"
//               />
//             </div>
//           </div>
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="phone" className="form-label">
//                 Phone Number <span className="text-danger">*</span>
//               </label>
//               <input
//                 type="tel"
//                 className="form-control"
//                 id="phone"
//                 name="phone"
//                 value={guestInfo.phone}
//                 onChange={handleGuestInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter your phone number"
//               />
//             </div>
//             <div className="col-md-6 mb-3">
//               <label htmlFor="city" className="form-label">City</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="city"
//                 name="city"
//                 value={guestInfo.city}
//                 onChange={handleGuestInputChange}
//                 disabled={isLoading}
//                 placeholder="Enter your city"
//               />
//             </div>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="address" className="form-label">
//               Delivery Address <span className="text-danger">*</span>
//             </label>
//             <textarea
//               className="form-control"
//               id="address"
//               name="address"
//               rows="3"
//               value={guestInfo.address}
//               onChange={handleGuestInputChange}
//               disabled={isLoading}
//               placeholder="Enter your full delivery address"
//             ></textarea>
//           </div>

//           <div className="mb-3">
//             <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
//             <textarea
//               className="form-control"
//               id="notes"
//               name="notes"
//               rows="2"
//               value={guestInfo.notes}
//               onChange={handleGuestInputChange}
//               disabled={isLoading}
//               placeholder="Any special instructions for your order"
//             ></textarea>
//           </div>

//           <div className="mb-4">
//             <h6 className="mb-3">
//               <i className="bi bi-credit-card me-2"></i>
//               Payment Method <span className="text-danger">*</span>
//             </h6>
//             <div className="row">
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="guest-cod"
//                     value="cod"
//                     checked={guestInfo.paymentMethod === 'cod'}
//                     onChange={handleGuestInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="guest-cod">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-cash-coin text-success me-2"></i>
//                       <div>
//                         <strong>Cash on Delivery</strong>
//                         <br />
//                         <small className="text-muted">Pay when your order arrives</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//               <div className="col-md-6 mb-3">
//                 <div className="form-check">
//                   <input
//                     className="form-check-input"
//                     type="radio"
//                     name="paymentMethod"
//                     id="guest-momo"
//                     value="momo"
//                     checked={guestInfo.paymentMethod === 'momo'}
//                     onChange={handleGuestInputChange}
//                     disabled={isLoading}
//                   />
//                   <label className="form-check-label" htmlFor="guest-momo">
//                     <div className="d-flex align-items-center">
//                       <i className="bi bi-phone text-primary me-2"></i>
//                       <div>
//                         <strong>Mobile Money</strong>
//                         <br />
//                         <small className="text-muted">Pay with your mobile money</small>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             {guestInfo.paymentMethod === 'momo' && (
//               <div className="card border-primary mt-3">
//                 <div className="card-header bg-light">
//                   <h6 className="mb-0">Mobile Money Payment</h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="guest-momoNetwork" className="form-label">
//                         Your Network <span className="text-danger">*</span>
//                       </label>
//                       <select
//                         className="form-select"
//                         id="guest-momoNetwork"
//                         name="momoNetwork"
//                         value={guestInfo.momoNetwork}
//                         onChange={handleGuestInputChange}
//                         required
//                         disabled={isLoading}
//                       >
//                         <option value="mtn">MTN Mobile Money</option>
//                         <option value="airtel">Airtel Money</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label htmlFor="guest-momoNumber" className="form-label">
//                         Your Mobile Money Number <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="tel"
//                         className="form-control"
//                         id="guest-momoNumber"
//                         name="momoNumber"
//                         value={guestInfo.momoNumber}
//                         onChange={handleGuestInputChange}
//                         required
//                         disabled={isLoading}
//                         placeholder="e.g., 0771234567"
//                       />
//                     </div>
//                   </div>

//                   {renderPaymentInstructions()}

//                   <div className="mb-3">
//                     <label htmlFor="guest-paymentProof" className="form-label">
//                       Upload Payment Proof <span className="text-danger">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       className="form-control"
//                       id="guest-paymentProof"
//                       name="paymentProof"
//                       accept="image/jpeg,image/png,image/webp"
//                       onChange={handleFileUpload}
//                       disabled={isLoading}
//                       required
//                     />
//                     <div className="form-text">
//                       Upload a clear screenshot of your payment confirmation. Max file size: 5MB
//                     </div>
//                     {paymentProof && (
//                       <div className="mt-2">
//                         <small className="text-success">
//                           <i className="bi bi-check-circle me-1"></i>
//                           File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
//                         </small>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="d-grid gap-2">
//             <button
//               type="submit"
//               className="btn btn-lg btn-success"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   Place Order ({formatCurrency(getCartTotal())})
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   if (cart.length === 0) {
//     return (
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-8 text-center">
//             <div className="empty-cart-container p-5">
//               <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
//               <h2 className="mb-3">Your Cart is Empty</h2>
//               <p className="text-muted mb-4">
//                 Looks like you haven't added any products to your cart yet.
//                 Start shopping to build your perfect setup!
//               </p>
//               <Link to="/products" className="btn btn-primary btn-lg px-4">
//                 <i className="bi bi-arrow-left me-2"></i>
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>

//           {checkoutSuccess && (
//             <div className="row justify-content-center mt-4">
//               <div className="col-md-8">
//                 <div className="alert alert-success text-center" role="alert">
//                   <i className="bi bi-check-circle me-2"></i>
//                   {checkoutSuccess}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         <div className="col-12">
//           <nav aria-label="breadcrumb">
//             <ol className="breadcrumb">
//               <li className="breadcrumb-item">
//                 <Link to="/">Home</Link>
//               </li>
//               <li className="breadcrumb-item">
//                 <Link to="/products">Products</Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">Cart</li>
//             </ol>
//           </nav>
//         </div>
//       </div>

//       <div className="row">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="mb-0">
//               <i className="bi bi-cart3 me-2"></i>
//               Shopping Cart ({getCartItemsCount()} items)
//             </h2>
//             <button
//               className="btn btn-outline-danger btn-sm"
//               onClick={handleClearCart}
//               disabled={isLoading}
//             >
//               <i className="bi bi-trash me-1"></i>
//               Clear Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {checkoutError && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-danger" role="alert">
//               <i className="bi bi-exclamation-triangle me-2"></i>
//               {checkoutError}
//             </div>
//           </div>
//         </div>
//       )}

//       {checkoutSuccess && (
//         <div className="row mb-3">
//           <div className="col-12">
//             <div className="alert alert-success" role="alert">
//               <i className="bi bi-check-circle me-2"></i>
//               {checkoutSuccess}
//             </div>
//           </div>
//         </div>
//       )}

//       {currentView === 'cart' && (
//         <div className="row">
//           <div className="col-lg-8">
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-light">
//                 <h5 className="mb-0">Cart Items</h5>
//               </div>
//               <div className="card-body p-0">
//                 {cart.map((item, index) => (
//                   <div key={item.id} className={`cart-item p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
//                     <div className="row align-items-center">
//                       <div className="col-md-2 col-sm-3">
//                         <img
//                           src={item.image_url || '/api/placeholder/100/100'}
//                           alt={item.name}
//                           className="img-fluid rounded"
//                           style={{ maxHeight: '80px', objectFit: 'cover' }}
//                           onError={(e) => {
//                             e.target.src = '/api/placeholder/100/100';
//                           }}
//                         />
//                       </div>
//                       <div className="col-md-4 col-sm-9">
//                         <h6 className="mb-1">{item.name}</h6>
//                         <small className="text-muted">
//                           {item.description && item.description.length > 50
//                             ? `${item.description.substring(0, 50)}...`
//                             : item.description
//                           }
//                         </small>
//                       </div>
//                       <div className="col-md-2 col-6 mt-2 mt-md-0">
//                         <label className="form-label small">Price</label>
//                         <div className="fw-bold text-primary">
//                           {formatCurrency(item.price)}
//                         </div>
//                       </div>
//                       <div className="col-md-2 col-6 mt-2 mt-md-0">
//                         <label htmlFor={`quantity-${item.id}`} className="form-label small">Quantity</label>
//                         <div className="input-group input-group-sm">
//                           <button
//                             className="btn btn-outline-secondary"
//                             type="button"
//                             onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
//                             disabled={isLoading}
//                           >
//                             <i className="bi bi-dash"></i>
//                           </button>
//                           <input
//                             type="number"
//                             className="form-control text-center"
//                             id={`quantity-${item.id}`}
//                             value={item.quantity}
//                             min="1"
//                             onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
//                             disabled={isLoading}
//                           />
//                           <button
//                             className="btn btn-outline-secondary"
//                             type="button"
//                             onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
//                             disabled={isLoading}
//                           >
//                             <i className="bi bi-plus"></i>
//                           </button>
//                         </div>
//                       </div>
//                       <div className="col-md-1 col-6 mt-2 mt-md-0">
//                         <label className="form-label small">Total</label>
//                         <div className="fw-bold">
//                           {formatCurrency(item.price * item.quantity)}
//                         </div>
//                       </div>
//                       <div className="col-md-1 col-6 mt-2 mt-md-0 text-end">
//                         <button
//                           className="btn btn-outline-danger btn-sm"
//                           onClick={() => handleRemoveItem(item.id)}
//                           disabled={isLoading}
//                           title="Remove item"
//                         >
//                           <i className="bi bi-trash"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <Link to="/products" className="btn btn-outline-primary">
//               <i className="bi bi-arrow-left me-2"></i>
//               Continue Shopping
//             </Link>
//           </div>

//           <div className="col-lg-4">
//             <div className="card shadow-sm mb-4">
//               <div className="card-header bg-primary text-white">
//                 <h5 className="mb-0">Order Summary</h5>
//               </div>
//               <div className="card-body">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Items ({getCartItemsCount()})</span>
//                   <span>{formatCurrency(getCartTotal())}</span>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>Shipping</span>
//                   <span className="text-success">FREE</span>
//                 </div>
//                 <hr />
//                 <div className="d-flex justify-content-between mb-3">
//                   <strong>Total</strong>
//                   <strong className="text-primary">{formatCurrency(getCartTotal())}</strong>
//                 </div>

//                 <button
//                   className="btn btn-success w-100 btn-lg"
//                   onClick={() => setCurrentView('options')}
//                   disabled={isLoading}
//                 >
//                   <i className="bi bi-credit-card me-2"></i>
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>

//             <div className="card shadow-sm">
//               <div className="card-body text-center">
//                 <i className="bi bi-shield-check text-success display-6 mb-2"></i>
//                 <h6 className="mb-2">Secure Checkout</h6>
//                 <small className="text-muted">
//                   Your information is protected with industry-standard encryption
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {currentView === 'options' && (
//         <div className="row mt-4">
//           <div className="col-12 col-md-8 offset-md-2">
//             <div className="card shadow-sm p-4 text-center">
//               <h4 className="mb-3">How would you like to check out?</h4>

//               {!isAuthenticated ? (
//                 <>
//                   <div className="d-grid gap-2 mb-3">
//                     <Link to="/login" className="btn btn-primary btn-lg">
//                       <i className="bi bi-person-circle me-2"></i>
//                       Log In to Your Account
//                     </Link>
//                   </div>
//                   <div className="d-grid gap-2 mb-3">
//                     <Link to="/register" className="btn btn-outline-primary btn-lg">
//                       <i className="bi bi-person-plus me-2"></i>
//                       Create New Account
//                     </Link>
//                   </div>
//                   <hr />
//                   <button
//                     className="btn btn-link btn-lg text-secondary"
//                     onClick={() => setCurrentView('checkout')}
//                   >
//                     <i className="bi bi-person me-2"></i>
//                     Continue as a Guest
//                   </button>
//                 </>
//               ) : (
//                 <div>
//                   <div className="alert alert-info mb-4">
//                     <i className="bi bi-person-check me-2"></i>
//                     Welcome back, <strong>{userProfile?.name || 'User'}</strong>!
//                   </div>
//                   <button
//                     className="btn btn-success btn-lg w-100 mb-3"
//                     onClick={() => setCurrentView('checkout')}
//                   >
//                     <i className="bi bi-credit-card me-2"></i>
//                     Continue to Checkout
//                   </button>
//                   <small className="text-muted d-block">
//                     We'll use your saved account information to speed up checkout
//                   </small>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {currentView === 'checkout' && (
//         <div className="row mt-4">
//           <div className="col-12">
//             {isAuthenticated ? renderAuthenticatedCheckout() : renderGuestCheckout()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;


import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    checkout,
    isLoading,
    isAuthenticated
  } = useContext(CartContext);

  const [currentView, setCurrentView] = useState('cart');
  const [userProfile, setUserProfile] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod',
    momoNumber: '',
    momoNetwork: 'mtn'
  });
  const [authUserInfo, setAuthUserInfo] = useState({
    deliveryAddress: '',
    city: '',
    notes: '',
    paymentMethod: 'cod',
    momoNumber: '',
    momoNetwork: 'mtn'
  });
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);

  const MOMO_MERCHANTS = {
    mtn: {
      name: 'MTN Mobile Money',
      number: '0771234567',
      accountName: 'TechStore Uganda Ltd'
    },
    airtel: {
      name: 'Airtel Money',
      number: '0700123456',
      accountName: 'TechStore Uganda Ltd'
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const token = sessionStorage.getItem('token');
          if (!token) {
            setCheckoutError('No authentication token found. Please log in again.');
            return;
          }
          const decoded = jwtDecode(token);
          setUserProfile({
            id: decoded.sub || decoded.user_id,
            name: decoded.name || `${decoded.first_name} ${decoded.last_name}` || 'User',
            email: decoded.email || '',
            phone: decoded.contact || ''
          });
        } catch (error) {
          console.error('Failed to get user profile:', error);
          setCheckoutError('Failed to load user profile. Please log in again.');
          sessionStorage.removeItem('token');
        }
      } else {
        setUserProfile(null);
      }
    };
    fetchUserProfile();
  }, [isAuthenticated]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
    }
  };

  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthInputChange = (e) => {
    const { name, value } = e.target;
    setAuthUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!allowedTypes.includes(file.type)) {
        setCheckoutError('Please upload a valid image file (JPEG, PNG, or WebP)');
        e.target.value = '';
        return;
      }
      if (file.size > maxSize) {
        setCheckoutError('File size must be less than 5MB');
        e.target.value = '';
        return;
      }
      setPaymentProof(file);
      setCheckoutError('');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError('');
    setCheckoutSuccess('');

    try {
      const formData = new FormData();

      if (isAuthenticated()) {
        if (!userProfile?.email || !userProfile?.phone) {
          setCheckoutError('Missing email or phone in your profile. Please update your account details.');
          return;
        }
        const customerInfo = {
          name: userProfile.name || 'User',
          email: userProfile.email,
          phone: userProfile.phone,
          address: authUserInfo.deliveryAddress,
          city: authUserInfo.city,
          notes: authUserInfo.notes,
          paymentMethod: authUserInfo.paymentMethod,
          momoNumber: authUserInfo.momoNumber,
          momoNetwork: authUserInfo.momoNetwork
        };

        if (!customerInfo.address?.trim()) {
          setCheckoutError('Please enter your delivery address');
          return;
        }
        if (authUserInfo.paymentMethod === 'momo') {
          if (!authUserInfo.momoNumber) {
            setCheckoutError('Please enter your Mobile Money number');
            return;
          }
          if (!paymentProof) {
            setCheckoutError('Please upload proof of payment for Mobile Money transactions');
            return;
          }
        }

        formData.append('customerInfo', JSON.stringify(customerInfo));
      } else {
        if (!guestInfo.name?.trim()) {
          setCheckoutError('Please enter your full name');
          return;
        }
        if (!guestInfo.email?.trim() || !guestInfo.email.includes('@')) {
          setCheckoutError('Please enter a valid email address');
          return;
        }
        if (!guestInfo.phone?.trim()) {
          setCheckoutError('Please enter your phone number');
          return;
        }
        if (!guestInfo.address?.trim()) {
          setCheckoutError('Please enter your delivery address');
          return;
        }
        if (guestInfo.paymentMethod === 'momo') {
          if (!guestInfo.momoNumber) {
            setCheckoutError('Please enter your Mobile Money number');
            return;
          }
          if (!paymentProof) {
            setCheckoutError('Please upload proof of payment');
            return;
          }
        }

        const customerInfo = {
          name: guestInfo.name.trim(),
          email: guestInfo.email.trim(),
          phone: guestInfo.phone.trim(),
          address: guestInfo.address,
          city: guestInfo.city,
          notes: guestInfo.notes,
          paymentMethod: guestInfo.paymentMethod,
          momoNumber: guestInfo.momoNumber,
          momoNetwork: guestInfo.momoNetwork
        };

        formData.append('customerInfo', JSON.stringify(customerInfo));
      }

      formData.append('total', getCartTotal().toString());
      if (paymentProof) {
        formData.append('paymentProof', paymentProof);
      }

      const result = await checkout(formData);

      if (result.success) {
        const currentPaymentMethod = isAuthenticated() ? authUserInfo.paymentMethod : guestInfo.paymentMethod;
        const paymentMessage = currentPaymentMethod === 'cod'
          ? 'Order placed successfully! You will pay cash on delivery.'
          : 'Order placed successfully! We have received your payment proof and will verify it shortly.';

        setCheckoutSuccess(paymentMessage);
        setCurrentView('cart');
        setPaymentProof(null);

        if (isAuthenticated()) {
          setAuthUserInfo({
            deliveryAddress: '',
            city: '',
            notes: '',
            paymentMethod: 'cod',
            momoNumber: '',
            momoNetwork: 'mtn'
          });
        } else {
          setGuestInfo({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            notes: '',
            paymentMethod: 'cod',
            momoNumber: '',
            momoNetwork: 'mtn'
          });
        }

        const fileInput = document.getElementById('paymentProof') || document.getElementById('guest-paymentProof');
        if (fileInput) fileInput.value = '';
      } else {
        setCheckoutError(result.error || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Checkout failed. Please try again.');
      toast.error(error.message || 'Checkout failed. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const renderPaymentInstructions = () => {
    const currentPaymentMethod = isAuthenticated() ? authUserInfo.paymentMethod : guestInfo.paymentMethod;
    const currentNetwork = isAuthenticated() ? authUserInfo.momoNetwork : guestInfo.momoNetwork;

    if (currentPaymentMethod !== 'momo') return null;

    const merchant = MOMO_MERCHANTS[currentNetwork];
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Payment Instructions:</strong>
        <ol className="mb-0 mt-2">
          <li>Send <strong>{formatCurrency(getCartTotal())}</strong> to <strong>{merchant.number}</strong></li>
          <li>Account Name: <strong>{merchant.accountName}</strong></li>
          <li>Network: <strong>{merchant.name}</strong></li>
          <li>Take a screenshot of the payment confirmation</li>
          <li>Upload the screenshot below</li>
        </ol>
      </div>
    );
  };

  const renderAuthenticatedCheckout = () => (
    <div className="card shadow">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-person-check me-2"></i>
          Complete Your Order
        </h5>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setCurrentView('cart')}
        >
          <i className="bi bi-x-circle me-1"></i>
          Back to Cart
        </button>
      </div>
      <div className="card-body">
        <div className="alert alert-info">
          <i className="bi bi-person-circle me-2"></i>
          <strong>Ordering as:</strong> {userProfile?.name} ({userProfile?.email})
        </div>

        <form onSubmit={handleCheckout}>
          <h6 className="mb-3">
            <i className="bi bi-truck me-2"></i>
            Delivery Information
          </h6>
          <div className="row">
            <div className="col-md-8 mb-3">
              <label htmlFor="deliveryAddress" className="form-label">
                Delivery Address <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="deliveryAddress"
                name="deliveryAddress"
                rows="2"
                value={authUserInfo.deliveryAddress}
                onChange={handleAuthInputChange}
                required
                disabled={isLoading}
                placeholder="Enter your full delivery address"
              ></textarea>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={authUserInfo.city}
                onChange={handleAuthInputChange}
                disabled={isLoading}
                placeholder="Enter your city"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
            <textarea
              className="form-control"
              id="notes"
              name="notes"
              rows="2"
              value={authUserInfo.notes}
              onChange={handleAuthInputChange}
              disabled={isLoading}
              placeholder="Any special instructions for your order"
            ></textarea>
          </div>

          <div className="mb-4">
            <h6 className="mb-3">
              <i className="bi bi-credit-card me-2"></i>
              Payment Method <span className="text-danger">*</span>
            </h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="cod"
                    checked={authUserInfo.paymentMethod === 'cod'}
                    onChange={handleAuthInputChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-cash-coin text-success me-2"></i>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <br />
                        <small className="text-muted">Pay when your order arrives</small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="momo"
                    value="momo"
                    checked={authUserInfo.paymentMethod === 'momo'}
                    onChange={handleAuthInputChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="momo">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-phone text-primary me-2"></i>
                      <div>
                        <strong>Mobile Money</strong>
                        <br />
                        <small className="text-muted">Pay with your mobile money</small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {authUserInfo.paymentMethod === 'momo' && (
              <div className="card border-primary mt-3">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Mobile Money Payment</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="momoNetwork" className="form-label">
                        Your Network <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="momoNetwork"
                        name="momoNetwork"
                        value={authUserInfo.momoNetwork}
                        onChange={handleAuthInputChange}
                        required
                        disabled={isLoading}
                      >
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="airtel">Airtel Money</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="momoNumber" className="form-label">
                        Your Mobile Money Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="momoNumber"
                        name="momoNumber"
                        value={authUserInfo.momoNumber}
                        onChange={handleAuthInputChange}
                        required
                        disabled={isLoading}
                        placeholder="e.g., 0771234567"
                      />
                    </div>
                  </div>

                  {renderPaymentInstructions()}

                  <div className="mb-3">
                    <label htmlFor="paymentProof" className="form-label">
                      Upload Payment Proof <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="paymentProof"
                      name="paymentProof"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      required
                    />
                    <div className="form-text">
                      Upload a clear screenshot of your payment confirmation. Max file size: 5MB
                    </div>
                    {paymentProof && (
                      <div className="mt-2">
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-lg btn-success"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Place Order ({formatCurrency(getCartTotal())})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderGuestCheckout = () => (
    <div className="card shadow">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-person me-2"></i>
          Customer Information & Payment
        </h5>
        <button
          className="btn btn-outline-light btn-sm"
          onClick={() => setCurrentView('options')}
        >
          <i className="bi bi-x-circle me-1"></i>
          Back
        </button>
      </div>
      <div className="card-body">
        <form onSubmit={handleCheckout}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={guestInfo.name}
                onChange={handleGuestInputChange}
                required
                disabled={isLoading}
                placeholder="Enter your full name"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={guestInfo.email}
                onChange={handleGuestInputChange}
                required
                disabled={isLoading}
                placeholder="Enter your email address"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="phone" className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={guestInfo.phone}
                onChange={handleGuestInputChange}
                required
                disabled={isLoading}
                placeholder="e.g., +256771234567"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                name="city"
                value={guestInfo.city}
                onChange={handleGuestInputChange}
                disabled={isLoading}
                placeholder="Enter your city"
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Delivery Address <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="address"
              name="address"
              rows="3"
              value={guestInfo.address}
              onChange={handleGuestInputChange}
              required
              disabled={isLoading}
              placeholder="Enter your full delivery address"
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
            <textarea
              className="form-control"
              id="notes"
              name="notes"
              rows="2"
              value={guestInfo.notes}
              onChange={handleGuestInputChange}
              disabled={isLoading}
              placeholder="Any special instructions for your order"
            ></textarea>
          </div>

          <div className="mb-4">
            <h6 className="mb-3">
              <i className="bi bi-credit-card me-2"></i>
              Payment Method <span className="text-danger">*</span>
            </h6>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="guest-cod"
                    value="cod"
                    checked={guestInfo.paymentMethod === 'cod'}
                    onChange={handleGuestInputChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="guest-cod">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-cash-coin text-success me-2"></i>
                      <div>
                        <strong>Cash on Delivery</strong>
                        <br />
                        <small className="text-muted">Pay when your order arrives</small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="guest-momo"
                    value="momo"
                    checked={guestInfo.paymentMethod === 'momo'}
                    onChange={handleGuestInputChange}
                    disabled={isLoading}
                  />
                  <label className="form-check-label" htmlFor="guest-momo">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-phone text-primary me-2"></i>
                      <div>
                        <strong>Mobile Money</strong>
                        <br />
                        <small className="text-muted">Pay with your mobile money</small>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {guestInfo.paymentMethod === 'momo' && (
              <div className="card border-primary mt-3">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Mobile Money Payment</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="guest-momoNetwork" className="form-label">
                        Your Network <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="guest-momoNetwork"
                        name="momoNetwork"
                        value={guestInfo.momoNetwork}
                        onChange={handleGuestInputChange}
                        required
                        disabled={isLoading}
                      >
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="airtel">Airtel Money</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="guest-momoNumber" className="form-label">
                        Your Mobile Money Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="guest-momoNumber"
                        name="momoNumber"
                        value={guestInfo.momoNumber}
                        onChange={handleGuestInputChange}
                        required
                        disabled={isLoading}
                        placeholder="e.g., 0771234567"
                      />
                    </div>
                  </div>

                  {renderPaymentInstructions()}

                  <div className="mb-3">
                    <label htmlFor="guest-paymentProof" className="form-label">
                      Upload Payment Proof <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="guest-paymentProof"
                      name="paymentProof"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                      required
                    />
                    <div className="form-text">
                      Upload a clear screenshot of your payment confirmation. Max file size: 5MB
                    </div>
                    {paymentProof && (
                      <div className="mt-2">
                        <small className="text-success">
                          <i className="bi bi-check-circle me-1"></i>
                          File selected: {paymentProof.name} ({Math.round(paymentProof.size / 1024)} KB)
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-lg btn-success"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Place Order ({formatCurrency(getCartTotal())})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (cart.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="empty-cart-container p-5">
              <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
              <h2 className="mb-3">Your Cart is Empty</h2>
              <p className="text-muted mb-4">
                Looks like you haven't added any products to your cart yet.
                Start shopping to build your perfect setup!
              </p>
              <Link to="/products" className="btn btn-primary btn-lg px-4">
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </Link>
            </div>
          </div>

          {checkoutSuccess && (
            <div className="row justify-content-center mt-4">
              <div className="col-md-8">
                <div className="alert alert-success text-center" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {checkoutSuccess}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/products">Products</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Cart</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">
              <i className="bi bi-cart3 me-2"></i>
              Shopping Cart ({getCartItemsCount()} items)
            </h2>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleClearCart}
              disabled={isLoading}
            >
              <i className="bi bi-trash me-1"></i>
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      {checkoutError && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {checkoutError}
            </div>
          </div>
        </div>
      )}

      {checkoutSuccess && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-success" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {checkoutSuccess}
            </div>
          </div>
        </div>
      )}

      {currentView === 'cart' && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0">Cart Items</h5>
              </div>
              <div className="card-body p-0">
                {cart.map((item, index) => (
                  <div key={item.id} className={`cart-item p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}>
                    <div className="row align-items-center">
                      <div className="col-md-2 col-sm-3">
                        <img
                          src={item.image_url || '/api/placeholder/100/100'}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '80px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/api/placeholder/100/100';
                          }}
                        />
                      </div>
                      <div className="col-md-4 col-sm-9">
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">
                          {item.description && item.description.length > 50
                            ? `${item.description.substring(0, 50)}...`
                            : item.description
                          }
                        </small>
                      </div>
                      <div className="col-md-2 col-6 mt-2 mt-md-0">
                        <label className="form-label small">Price</label>
                        <div className="fw-bold text-primary">
                          {formatCurrency(item.price)}
                        </div>
                      </div>
                      <div className="col-md-2 col-6 mt-2 mt-md-0">
                        <label htmlFor={`quantity-${item.id}`} className="form-label small">Quantity</label>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            id={`quantity-${item.id}`}
                            value={item.quantity}
                            min="1"
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            disabled={isLoading}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-1 col-6 mt-2 mt-md-0">
                        <label className="form-label small">Total</label>
                        <div className="fw-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                      <div className="col-md-1 col-6 mt-2 mt-md-0 text-end">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                          title="Remove item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/products" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({getCartItemsCount()})</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary">{formatCurrency(getCartTotal())}</strong>
                </div>

                <button
                  className="btn btn-success w-100 btn-lg"
                  onClick={() => setCurrentView('options')}
                  disabled={isLoading}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Proceed to Checkout
                </button>
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-shield-check text-success display-6 mb-2"></i>
                <h6 className="mb-2">Secure Checkout</h6>
                <small className="text-muted">
                  Your information is protected with industry-standard encryption
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'options' && (
        <div className="row mt-4">
          <div className="col-12 col-md-8 offset-md-2">
            <div className="card shadow-sm p-4 text-center">
              <h4 className="mb-3">How would you like to check out?</h4>

              {!isAuthenticated() ? (
                <>
                  <div className="d-grid gap-2 mb-3">
                    <Link to="/login" className="btn btn-primary btn-lg">
                      <i className="bi bi-person-circle me-2"></i>
                      Log In to Your Account
                    </Link>
                  </div>
                  <div className="d-grid gap-2 mb-3">
                    <Link to="/register" className="btn btn-outline-primary btn-lg">
                      <i className="bi bi-person-plus me-2"></i>
                      Create New Account
                    </Link>
                  </div>
                  <hr />
                  <button
                    className="btn btn-link btn-lg text-secondary"
                    onClick={() => setCurrentView('checkout')}
                  >
                    <i className="bi bi-person me-2"></i>
                    Continue as a Guest
                  </button>
                </>
              ) : (
                <div>
                  <div className="alert alert-info mb-4">
                    <i className="bi bi-person-check me-2"></i>
                    Welcome back, <strong>{userProfile?.name || 'User'}</strong>!
                  </div>
                  <button
                    className="btn btn-success btn-lg w-100 mb-3"
                    onClick={() => setCurrentView('checkout')}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Continue to Checkout
                  </button>
                  <small className="text-muted d-block">
                    We'll use your saved account information to speed up checkout
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentView === 'checkout' && (
        <div className="row mt-4">
          <div className="col-12">
            {isAuthenticated() ? renderAuthenticatedCheckout() : renderGuestCheckout()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;