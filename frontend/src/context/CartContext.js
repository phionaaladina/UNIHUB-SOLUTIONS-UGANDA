// // context/CartContext.js
// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Check if localStorage is available
//   const isLocalStorageAvailable = () => {
//     try {
//       const test = 'test';
//       localStorage.setItem(test, test);
//       localStorage.removeItem(test);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     if (isLocalStorageAvailable()) {
//       const savedCart = localStorage.getItem('cart');
//       if (savedCart) {
//         try {
//           const parsedCart = JSON.parse(savedCart);
//           if (Array.isArray(parsedCart)) {
//             setCart(parsedCart);
//           }
//         } catch (error) {
//           console.error('Error loading cart from localStorage:', error);
//           // Clear corrupted data
//           localStorage.removeItem('cart');
//         }
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever cart changes
//   useEffect(() => {
//     if (isLocalStorageAvailable()) {
//       try {
//         localStorage.setItem('cart', JSON.stringify(cart));
//       } catch (error) {
//         console.error('Error saving cart to localStorage:', error);
//       }
//     }
//   }, [cart]);

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     // Validate inputs
//     if (!product || !product.id || typeof quantity !== 'number' || quantity <= 0) {
//       console.error('Invalid product or quantity provided to addToCart');
//       return;
//     }

//     console.log('Adding to cart:', product, 'Quantity:', quantity); // Debug log

//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       let newCart;
//       if (existingItem) {
//         // If item exists, update quantity
//         newCart = prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // If item doesn't exist, add new item
//         newCart = [...prevCart, { ...product, quantity }];
//       }
      
//       console.log('New cart state:', newCart); // Debug log
//       return newCart;
//     });
//   };

//   // Remove item from cart completely
//   const removeFromCart = (productId) => {
//     if (!productId) {
//       console.error('No product ID provided to removeFromCart');
//       return;
//     }
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   // Update quantity of specific item
//   const updateQuantity = (productId, newQuantity) => {
//     if (!productId || typeof newQuantity !== 'number') {
//       console.error('Invalid productId or newQuantity provided to updateQuantity');
//       return;
//     }

//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(prevCart =>
//         prevCart.map(item =>
//           item.id === productId
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     }
//   };

//   // Clear entire cart
//   const clearCart = () => {
//     setCart([]);
//   };

//   // Get cart total
//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = parseFloat(item.price) || 0;
//       const quantity = parseInt(item.quantity) || 0;
//       return total + (price * quantity);
//     }, 0);
//   };

//   // Get total items count
//   const getCartItemsCount = () => {
//     return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
//   };

//   // Check if item is in cart
//   const isInCart = (productId) => {
//     if (!productId) return false;
//     return cart.some(item => item.id === productId);
//   };

//   // Get specific item from cart
//   const getCartItem = (productId) => {
//     if (!productId) return null;
//     return cart.find(item => item.id === productId);
//   };

//   // Checkout function - you can customize this to call your backend
//   const checkout = async (customerInfo) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           items: cart,
//           customer: customerInfo,
//           total: getCartTotal(),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Checkout failed: ${response.status}`);
//       }

//       const result = await response.json();
      
//       // Clear cart after successful checkout
//       clearCart();
      
//       return { success: true, data: result };
//     } catch (error) {
//       console.error('Checkout error:', error);
//       return { success: false, error: error.message };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const contextValue = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     isInCart,
//     getCartItem,
//     checkout,
//     isLoading,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };











// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Check if localStorage is available
//   const isLocalStorageAvailable = () => {
//     try {
//       const test = 'test';
//       localStorage.setItem(test, test);
//       localStorage.removeItem(test);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };

//   // Load cart from localStorage on component mount
//   useEffect(() => {
//     if (isLocalStorageAvailable()) {
//       const savedCart = localStorage.getItem('cart');
//       if (savedCart) {
//         try {
//           const parsedCart = JSON.parse(savedCart);
//           if (Array.isArray(parsedCart)) {
//             setCart(parsedCart);
//           }
//         } catch (error) {
//           console.error('Error loading cart from localStorage:', error);
//           // Clear corrupted data
//           localStorage.removeItem('cart');
//         }
//       }
//     }
//   }, []);

//   // Save cart to localStorage whenever cart changes
//   useEffect(() => {
//     if (isLocalStorageAvailable()) {
//       try {
//         localStorage.setItem('cart', JSON.stringify(cart));
//       } catch (error) {
//         console.error('Error saving cart to localStorage:', error);
//       }
//     }
//   }, [cart]);

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     // Validate inputs
//     if (!product || !product.id || typeof quantity !== 'number' || quantity <= 0) {
//       console.error('Invalid product or quantity provided to addToCart');
//       return;
//     }

//     console.log('Adding to cart:', product, 'Quantity:', quantity); // Debug log

//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       let newCart;
//       if (existingItem) {
//         // If item exists, update quantity
//         newCart = prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         // If item doesn't exist, add new item
//         newCart = [...prevCart, { ...product, quantity }];
//       }
      
//       console.log('New cart state:', newCart); // Debug log
//       return newCart;
//     });
//   };

//   // Remove item from cart completely
//   const removeFromCart = (productId) => {
//     if (!productId) {
//       console.error('No product ID provided to removeFromCart');
//       return;
//     }
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   // Update quantity of specific item
//   const updateQuantity = (productId, newQuantity) => {
//     if (!productId || typeof newQuantity !== 'number') {
//       console.error('Invalid productId or newQuantity provided to updateQuantity');
//       return;
//     }

//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(prevCart =>
//         prevCart.map(item =>
//           item.id === productId
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     }
//   };

//   // Clear entire cart
//   const clearCart = () => {
//     setCart([]);
//   };

//   // Get cart total
//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = parseFloat(item.price) || 0;
//       const quantity = parseInt(item.quantity) || 0;
//       return total + (price * quantity);
//     }, 0);
//   };

//   // Get total items count
//   const getCartItemsCount = () => {
//     return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
//   };

//   // Check if item is in cart
//   const isInCart = (productId) => {
//     if (!productId) return false;
//     return cart.some(item => item.id === productId);
//   };

//   // Get specific item from cart
//   const getCartItem = (productId) => {
//     if (!productId) return null;
//     return cart.find(item => item.id === productId);
//   };

//   // Checkout function - call your backend with the cart and customer data
//   const checkout = async (customerInfo) => {
//     setIsLoading(true);
//     const token = sessionStorage.getItem('token');
    
//     if (!token) {
//       setIsLoading(false);
//       return { success: false, error: 'Authentication required. Please log in.' };
//     }
    
//     try {
//       // The corrected URL matches your Flask backend route
//       const response = await fetch('http://127.0.0.1:5000/api/v1/cart/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           cartItems: cart, // Pass the cart items
//           customerInfo: customerInfo, // Pass the customer information
//         }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || `Checkout failed: ${response.status}`);
//       }
      
//       // Clear cart after successful checkout
//       clearCart();
      
//       return { success: true, data: data };
//     } catch (error) {
//       console.error('Checkout error:', error);
//       return { success: false, error: error.message };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const contextValue = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     isInCart,
//     getCartItem,
//     checkout,
//     isLoading,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };




// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Load cart from memory (since localStorage isn't available in Claude artifacts)
//   useEffect(() => {
//     // In a real app, you would load from localStorage here
//     // For now, we'll just initialize with an empty cart
//     console.log('Cart initialized');
//   }, []);

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     if (!product || !product.id || typeof quantity !== 'number' || quantity <= 0) {
//       console.error('Invalid product or quantity provided to addToCart');
//       return;
//     }

//     console.log('Adding to cart:', product, 'Quantity:', quantity);

//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       let newCart;
//       if (existingItem) {
//         newCart = prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         newCart = [...prevCart, { ...product, quantity }];
//       }
      
//       console.log('New cart state:', newCart);
//       return newCart;
//     });
//   };

//   const removeFromCart = (productId) => {
//     if (!productId) {
//       console.error('No product ID provided to removeFromCart');
//       return;
//     }
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   const updateQuantity = (productId, newQuantity) => {
//     if (!productId || typeof newQuantity !== 'number') {
//       console.error('Invalid productId or newQuantity provided to updateQuantity');
//       return;
//     }

//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(prevCart =>
//         prevCart.map(item =>
//           item.id === productId
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = parseFloat(item.price) || 0;
//       const quantity = parseInt(item.quantity) || 0;
//       return total + (price * quantity);
//     }, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
//   };

//   const isInCart = (productId) => {
//     if (!productId) return false;
//     return cart.some(item => item.id === productId);
//   };

//   const getCartItem = (productId) => {
//     if (!productId) return null;
//     return cart.find(item => item.id === productId);
//   };

//   // IMPROVED: Enhanced checkout function with better error handling
//   const checkout = async (customerInfo) => {
//     setIsLoading(true);
    
//     try {
//       console.log('🛒 Starting checkout with cart:', cart);
//       console.log('📋 Customer info:', customerInfo);
      
//       // Check if cart is empty
//       if (cart.length === 0) {
//         throw new Error('Cart is empty');
//       }

//       // Get token from sessionStorage
//       const token = sessionStorage.getItem('token');
      
//       // Prepare checkout data
//       const checkoutData = {
//         customerInfo: customerInfo,
//         cart: cart,
//         total: getCartTotal()
//       };
      
//       console.log('📤 Sending checkout data:', checkoutData);

//       // FIXED: Better fetch configuration with timeout and error handling
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

//       const fetchOptions = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(checkoutData),
//         signal: controller.signal
//       };

//       // Add Authorization header only if token exists
//       if (token) {
//         fetchOptions.headers['Authorization'] = `Bearer ${token}`;
//       }

//       let response;
//       try {
//         // Check if backend is running by making the request
//         response = await fetch('http://127.0.0.1:5000/api/v1/cart/checkout', fetchOptions);
//         clearTimeout(timeoutId);
//       } catch (fetchError) {
//         clearTimeout(timeoutId);
        
//         // Handle specific fetch errors
//         if (fetchError.name === 'AbortError') {
//           throw new Error('Request timeout - Please check your internet connection and try again');
//         } else if (fetchError.message.includes('fetch')) {
//           throw new Error('Cannot connect to server - Please check if the backend server is running on http://127.0.0.1:5000');
//         } else {
//           throw new Error(`Network error: ${fetchError.message}`);
//         }
//       }

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
//       // Get response text first to debug
//       const responseText = await response.text();
//       console.log('📥 Raw response:', responseText);

//       // Handle different response types
//       let data;
//       if (responseText.trim() === '') {
//         throw new Error('Server returned empty response');
//       }

//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         console.error('Failed to parse response as JSON:', parseError);
//         console.error('Response text:', responseText);
//         throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
//       }

//       console.log('📥 Parsed response data:', data);

//       // Handle different HTTP status codes
//       if (response.status === 200 || response.status === 201) {
//         if (data.success) {
//           clearCart();
//           console.log('✅ Checkout successful, cart cleared');
          
//           return {
//             success: true,
//             message: data.message || 'Order placed successfully!',
//             orderId: data.order_id || data.orderId
//           };
//         } else {
//           throw new Error(data.error || data.message || 'Checkout failed - Unknown error');
//         }
//       } else if (response.status === 401) {
//         throw new Error('Authentication failed - Please log in again');
//       } else if (response.status === 400) {
//         throw new Error(data.error || data.message || 'Invalid request data');
//       } else if (response.status === 404) {
//         throw new Error('Checkout endpoint not found - Please check if the server is running');
//       } else if (response.status === 500) {
//         throw new Error('Server error - Please try again later');
//       } else {
//         throw new Error(`Server returned status ${response.status}: ${data.error || data.message || 'Unknown error'}`);
//       }
      
//     } catch (error) {
//       console.error('💥 Checkout error:', error);
      
//       // Return a more detailed error response
//       return {
//         success: false,
//         error: error.message || 'An unexpected error occurred during checkout'
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const contextValue = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     isInCart,
//     getCartItem,
//     checkout,
//     isLoading,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };



// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Load cart from memory (since localStorage isn't available in Claude artifacts)
//   useEffect(() => {
//     // In a real app, you would load from localStorage here
//     // For now, we'll just initialize with an empty cart
//     console.log('Cart initialized');
//   }, []);

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     if (!product || !product.id || typeof quantity !== 'number' || quantity <= 0) {
//       console.error('Invalid product or quantity provided to addToCart');
//       return;
//     }

//     console.log('Adding to cart:', product, 'Quantity:', quantity);

//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       let newCart;
//       if (existingItem) {
//         newCart = prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         newCart = [...prevCart, { ...product, quantity }];
//       }
      
//       console.log('New cart state:', newCart);
//       return newCart;
//     });
//   };

//   const removeFromCart = (productId) => {
//     if (!productId) {
//       console.error('No product ID provided to removeFromCart');
//       return;
//     }
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   const updateQuantity = (productId, newQuantity) => {
//     if (!productId || typeof newQuantity !== 'number') {
//       console.error('Invalid productId or newQuantity provided to updateQuantity');
//       return;
//     }

//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(prevCart =>
//         prevCart.map(item =>
//           item.id === productId
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     }
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = parseFloat(item.price) || 0;
//       const quantity = parseInt(item.quantity) || 0;
//       return total + (price * quantity);
//     }, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
//   };

//   const isInCart = (productId) => {
//     if (!productId) return false;
//     return cart.some(item => item.id === productId);
//   };

//   const getCartItem = (productId) => {
//     if (!productId) return null;
//     return cart.find(item => item.id === productId);
//   };

//   // ✅ IMPROVED: The checkout function now expects and handles FormData
//   const checkout = async (formData) => {
//     setIsLoading(true);
    
//     try {
//       console.log('🛒 Starting checkout with FormData:', formData);
      
//       // Check if cart is empty
//       if (cart.length === 0) {
//         throw new Error('Cart is empty');
//       }

//       const token = sessionStorage.getItem('token');
      
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

//       const fetchOptions = {
//         method: 'POST',
//         // Note: No 'Content-Type' header is set here. The browser will automatically
//         // set 'multipart/form-data' when using FormData.
//         body: formData,
//         signal: controller.signal
//       };

//       if (token) {
//         fetchOptions.headers = {
//           'Authorization': `Bearer ${token}`,
//         };
//       }

//       let response;
//       try {
//         response = await fetch('http://127.0.0.1:5000/api/v1/cart/checkout', fetchOptions);
//         clearTimeout(timeoutId);
//       } catch (fetchError) {
//         clearTimeout(timeoutId);
        
//         if (fetchError.name === 'AbortError') {
//           throw new Error('Request timeout - Please check your internet connection and try again');
//         } else if (fetchError.message.includes('fetch')) {
//           throw new Error('Cannot connect to server - Please check if the backend server is running on http://127.0.0.1:5000');
//         } else {
//           throw new Error(`Network error: ${fetchError.message}`);
//         }
//       }

//       console.log('📥 Response status:', response.status);
//       console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
//       const responseText = await response.text();
//       console.log('📥 Raw response:', responseText);

//       let data;
//       if (responseText.trim() === '') {
//         throw new Error('Server returned empty response');
//       }

//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         console.error('Failed to parse response as JSON:', parseError);
//         console.error('Response text:', responseText);
//         throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`);
//       }

//       console.log('📥 Parsed response data:', data);

//       if (response.status === 200 || response.status === 201) {
//         if (data.success) {
//           clearCart();
//           console.log('✅ Checkout successful, cart cleared');
          
//           return {
//             success: true,
//             message: data.message || 'Order placed successfully!',
//             orderId: data.order_id || data.orderId
//           };
//         } else {
//           throw new Error(data.error || data.message || 'Checkout failed - Unknown error');
//         }
//       } else if (response.status === 401) {
//         throw new Error('Authentication failed - Please log in again');
//       } else if (response.status === 400) {
//         throw new Error(data.error || data.message || 'Invalid request data');
//       } else if (response.status === 404) {
//         throw new Error('Checkout endpoint not found - Please check if the server is running');
//       } else if (response.status === 500) {
//         throw new Error('Server error - Please try again later');
//       } else {
//         throw new Error(`Server returned status ${response.status}: ${data.error || data.message || 'Unknown error'}`);
//       }
      
//     } catch (error) {
//       console.error('💥 Checkout error:', error);
      
//       return {
//         success: false,
//         error: error.message || 'An unexpected error occurred during checkout'
//       };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const contextValue = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     isInCart,
//     getCartItem,
//     checkout,
//     isLoading,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>
//       {children}
//     </CartContext.Provider>
//   );
// };



//GUEST CHECKOUT

// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // In a real app, you would load cart from localStorage for guest users
//   useEffect(() => {
//     try {
//       const storedCart = JSON.parse(localStorage.getItem('guestCart')) || [];
//       setCart(storedCart);
//     } catch (e) {
//       console.error("Failed to parse cart from localStorage", e);
//       localStorage.removeItem('guestCart');
//     }
//   }, []);

//   // Sync cart state to localStorage for guest users
//   useEffect(() => {
//     localStorage.setItem('guestCart', JSON.stringify(cart));
//   }, [cart]);

//   // Add item to cart
//   const addToCart = (product, quantity = 1) => {
//     // This is a simplified function for a guest cart.
//     // For a registered user, you would make an API call here.
//     if (!product || !product.id || typeof quantity !== 'number' || quantity <= 0) {
//       console.error('Invalid product or quantity provided to addToCart');
//       return;
//     }

//     setCart(prevCart => {
//       const existingItem = prevCart.find(item => item.id === product.id);
      
//       let newCart;
//       if (existingItem) {
//         newCart = prevCart.map(item =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         newCart = [...prevCart, { ...product, quantity }];
//       }
//       return newCart;
//     });
//   };

//   const removeFromCart = (productId) => {
//     // For registered users, this would make a DELETE API call.
//     if (!productId) {
//       console.error('No product ID provided to removeFromCart');
//       return;
//     }
//     setCart(prevCart => prevCart.filter(item => item.id !== productId));
//   };

//   const updateQuantity = (productId, newQuantity) => {
//     // For registered users, this would make a PUT API call.
//     if (!productId || typeof newQuantity !== 'number') {
//       console.error('Invalid productId or newQuantity provided to updateQuantity');
//       return;
//     }

//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//     } else {
//       setCart(prevCart =>
//         prevCart.map(item =>
//           item.id === productId
//             ? { ...item, quantity: newQuantity }
//             : item
//         )
//       );
//     }
//   };

//   const clearCart = () => {
//     // For registered users, this would make an API call.
//     setCart([]);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => {
//       const price = parseFloat(item.price) || 0;
//       const quantity = parseInt(item.quantity) || 0;
//       return total + (price * quantity);
//     }, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
//   };

//   const isInCart = (productId) => {
//     if (!productId) return false;
//     return cart.some(item => item.id === productId);
//   };

//   const getCartItem = (productId) => {
//     if (!productId) return null;
//     return cart.find(item => item.id === productId);
//   };

//   // ✅ IMPROVED: The checkout function now handles both guest and registered users
//   const checkout = async (formData) => {
//     setIsLoading(true);
    
//     try {
//       const token = sessionStorage.getItem('token');
//       const isLoggedIn = !!token;

//       let checkoutUrl;
//       const requestOptions = {
//         method: 'POST',
//         body: formData // Your formData already contains customerInfo and paymentProof
//       };

//       if (isLoggedIn) {
//         // Registered User Checkout
//         // The backend expects JSON for registered users and pulls cart from DB.
//         checkoutUrl = 'http://127.0.0.1:5000/api/v1/cart/checkout';
        
//         // Convert FormData to a regular object and set as JSON body
//         const customerInfo = JSON.parse(formData.get('customerInfo'));
        
//         requestOptions.body = JSON.stringify({
//           customerInfo: customerInfo,
//           // The backend will get cart items from the database.
//           // We can optionally send payment proof as a separate field or handle it differently.
//           // For simplicity and to match your current form, let's keep it in FormData.
//         });
        
//         // This is a crucial step! We need the 'Content-Type' header for JSON
//         requestOptions.headers = {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         };

//       } else {
//         // Guest User Checkout
//         // The backend expects the complete form data for guests.
//         checkoutUrl = 'http://127.0.0.1:5000/api/v1/cart/guest/checkout';
//         // The body is already the FormData object from your Cart.js file.
//         // The browser will automatically set 'Content-Type': 'multipart/form-data'
//       }

//       const response = await fetch(checkoutUrl, requestOptions);
//       const result = await response.json();
      
//       if (response.ok) {
//         setCart([]); // Clear the cart on success
//       }

//       return result;
//     } catch (error) {
//       console.error('Checkout error:', error);
//       return { success: false, error: 'Checkout failed. Please try again.' };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const value = {
//     cart,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     getCartTotal,
//     getCartItemsCount,
//     isInCart,
//     getCartItem,
//     checkout,
//     isLoading
//   };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };



// //GUEST CHECKOUT
// import React, { createContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem('guestCart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   // Check if a user is logged in (used to determine checkout endpoint)
//   const isAuthenticated = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) {
//       return false;
//     }
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp > Date.now() / 1000;
//     } catch (e) {
//       return false;
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       localStorage.setItem('guestCart', JSON.stringify(cart));
//     }
//   }, [cart]);

//   // Create axios instance with base URL
//   const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
//     timeout: 10000,
//   });

//   const addToCart = async (product, quantity = 1) => {
//     setIsLoading(true);
//     const existingProduct = cart.find(item => item.id === product.id);

//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         console.log('🔄 Adding to authenticated user cart:', { product_id: product.id, quantity });
//         const response = await api.post(
//           '/api/v1/cart/add',
//           { product_id: product.id, quantity },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success('Item added to cart!');
//         // Fetch updated cart from the backend
//         await fetchUserCart();
//       } catch (error) {
//         console.error('❌ Add to cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to add to cart.');
//       }
//     } else {
//       // Guest user - manage cart locally
//       if (existingProduct) {
//         setCart(
//           cart.map(item =>
//             item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
//           )
//         );
//       } else {
//         setCart([...cart, { ...product, quantity }]);
//       }
//       toast.success('Item added to cart!');
//     }
//     setIsLoading(false);
//   };

//   const removeFromCart = (productId) => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       console.log('🗑️ Removing from authenticated user cart:', productId);
//       api.delete(`/api/v1/cart/remove`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { product_id: productId }
//       }).then(() => {
//         toast.info('Item removed from cart!');
//         fetchUserCart();
//       }).catch(error => {
//         console.error('❌ Remove from cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to remove from cart.');
//         setIsLoading(false);
//       });
//     } else {
//       // Guest user - manage cart locally
//       setCart(cart.filter(item => item.id !== productId));
//       toast.info('Item removed from cart!');
//       setIsLoading(false);
//     }
//   };

//   const updateQuantity = (productId, newQuantity) => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       console.log('🔄 Updating authenticated user cart:', { product_id: productId, quantity: newQuantity });
//       api.put(`/api/v1/cart/update`, {
//         product_id: productId, quantity: newQuantity
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       }).then(() => {
//         fetchUserCart();
//       }).catch(error => {
//         console.error('❌ Update cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to update quantity.');
//         setIsLoading(false);
//       });
//     } else {
//       // Guest user - manage cart locally
//       if (newQuantity <= 0) {
//         removeFromCart(productId);
//       } else {
//         setCart(
//           cart.map(item =>
//             item.id === productId ? { ...item, quantity: newQuantity } : item
//           )
//         );
//       }
//       setIsLoading(false);
//     }
//   };

//   const clearCart = () => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       // For authenticated users, we'd need a clear cart endpoint
//       // Since it's not implemented, we'll just clear locally
//       setCart([]);
//       toast.success('Cart cleared!');
//     } else {
//       // Guest user - clear local storage
//       setCart([]);
//       localStorage.removeItem('guestCart');
//       toast.success('Cart cleared!');
//     }
//     setIsLoading(false);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const fetchUserCart = async () => {
//     if (isAuthenticated()) {
//       setIsLoading(true);
//       const token = sessionStorage.getItem('token');
//       try {
//         console.log('🔄 Fetching authenticated user cart...');
//         const response = await api.get('/api/v1/cart/', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         console.log('📦 Backend cart response:', response.data);
        
//         // Transform backend cart format to frontend format
//         // FIXED: Access response.data directly, not response.data.cart
//         const backendCart = response.data;
//         if (backendCart && backendCart.items && backendCart.items.length > 0) {
//           const transformedCart = backendCart.items.map(item => ({
//             id: item.product_id,
//             name: item.product_name,
//             price: parseFloat(item.product_price),
//             quantity: item.quantity,
//             // Add any other fields your frontend expects
//             image_url: '', // You might need to fetch this separately or include in backend response
//             description: '' // Same here
//           }));
//           console.log('✅ Transformed cart for frontend:', transformedCart);
//           setCart(transformedCart);
//         } else {
//           console.log('📭 No items in cart or cart is empty');
//           setCart([]);
//         }
//       } catch (error) {
//         console.error('❌ Failed to fetch cart:', error.response || error);
//         setCart([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const checkout = async (formData) => {
//     setIsLoading(true);
//     const token = sessionStorage.getItem('token');
    
//     console.log('💳 Starting checkout process...');
//     console.log('🔐 Is authenticated:', !!token);
    
//     try {
//       let response;
      
//       if (token) {
//         // ✅ AUTHENTICATED USER CHECKOUT
//         console.log('👤 Processing authenticated user checkout');
        
//         // For authenticated users, backend expects customer info in JSON format
//         // The cart items are fetched from the database, not sent in request
//         const customerInfo = JSON.parse(formData.get('customerInfo'));
        
//         // Transform frontend customer info to backend expected format
//         const backendCustomerInfo = {
//           first_name: customerInfo.name?.split(' ')[0] || customerInfo.name || '',
//           last_name: customerInfo.name?.split(' ').slice(1).join(' ') || '',
//           email: customerInfo.email,
//           contact: customerInfo.phone,
//           shipping_address: customerInfo.address || '',
//           payment_method: customerInfo.paymentMethod,
//           momo_number: customerInfo.momoNumber || '',
//           momo_network: customerInfo.momoNetwork || ''
//         };

//         console.log('📤 Sending authenticated checkout data:', backendCustomerInfo);
        
//         response = await api.post('/api/v1/cart/checkout', backendCustomerInfo, {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//       } else {
//         // ✅ GUEST USER CHECKOUT
//         console.log('👥 Processing guest user checkout');
        
//         const customerInfo = JSON.parse(formData.get('customerInfo'));
//         const cartItems = JSON.parse(formData.get('cart'));
        
//         // Transform cart items to backend expected format
//         const backendCartItems = cartItems.map(item => ({
//           product_id: item.id,
//           quantity: item.quantity
//         }));
        
//         // Transform customer info to backend expected format
//         const backendCustomerInfo = {
//           name: customerInfo.name,
//           email: customerInfo.email,
//           phone: customerInfo.phone,
//           address: customerInfo.address || '',
//           city: customerInfo.city || '',
//           notes: customerInfo.notes || '',
//           paymentMethod: customerInfo.paymentMethod,
//           momoNumber: customerInfo.momoNumber || '',
//           momoNetwork: customerInfo.momoNetwork || ''
//         };
        
//         const requestData = {
//           customerInfo: backendCustomerInfo,
//           cart: backendCartItems
//         };
        
//         console.log('📤 Sending guest checkout data:', requestData);
        
//         response = await api.post('/api/v1/cart/guest/checkout', requestData, {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
//       }
      
//       console.log('✅ Checkout response:', response.data);
      
//       // Clear the cart after successful checkout
//       if (response.data.success) {
//         clearCart();
//         return { success: true, data: response.data };
//       } else {
//         return { success: false, error: response.data.error || 'Checkout failed' };
//       }
      
//     } catch (error) {
//       console.error("❌ Checkout error:", error.response?.data || error.message || error);
      
//       // Provide more specific error messages
//       let errorMessage = 'An unexpected error occurred.';
      
//       if (error.response?.status === 404) {
//         errorMessage = 'Checkout service not found. Please contact support.';
//       } else if (error.response?.data?.error) {
//         errorMessage = error.response.data.error;
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       return { success: false, error: errorMessage };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize authenticated user's cart on mount
//   useEffect(() => {
//     if (isAuthenticated()) {
//       fetchUserCart();
//     }
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getCartTotal,
//         getCartItemsCount,
//         checkout,
//         fetchUserCart,
//         isLoading,
//         isAuthenticated: isAuthenticated()
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };




// //userdashboard
// import React, { createContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem('guestCart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   // Check if a user is logged in
//   const isAuthenticated = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) return false;
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp > Date.now() / 1000;
//     } catch (e) {
//       console.error('Invalid token:', e);
//       return false;
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       localStorage.setItem('guestCart', JSON.stringify(cart));
//     }
//   }, [cart]);

//   // Create axios instance
//   const api = axios.create({
//     baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
//     timeout: 10000,
//   });

//   const addToCart = async (product, quantity = 1) => {
//     setIsLoading(true);
//     const existingProduct = cart.find(item => item.id === product.id);

//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         const response = await api.post(
//           '/api/v1/cart/add',
//           { product_id: product.id, quantity },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success('Item added to cart!');
//         await fetchUserCart();
//       } catch (error) {
//         console.error('Add to cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to add to cart.');
//       }
//     } else {
//       if (existingProduct) {
//         setCart(
//           cart.map(item =>
//             item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
//           )
//         );
//       } else {
//         setCart([...cart, { ...product, quantity }]);
//       }
//       toast.success('Item added to cart!');
//     }
//     setIsLoading(false);
//   };

//   const removeFromCart = async (productId) => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         await api.delete('/api/v1/cart/remove', {
//           headers: { Authorization: `Bearer ${token}` },
//           data: { product_id: productId }
//         });
//         toast.info('Item removed from cart!');
//         await fetchUserCart();
//       } catch (error) {
//         console.error('Remove from cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to remove from cart.');
//       }
//     } else {
//       setCart(cart.filter(item => item.id !== productId));
//       toast.info('Item removed from cart!');
//     }
//     setIsLoading(false);
//   };

//   const updateQuantity = async (productId, newQuantity) => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         await api.put(
//           '/api/v1/cart/update',
//           { product_id: productId, quantity: newQuantity },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         await fetchUserCart();
//       } catch (error) {
//         console.error('Update cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to update quantity.');
//       }
//     } else {
//       if (newQuantity <= 0) {
//         removeFromCart(productId);
//       } else {
//         setCart(
//           cart.map(item =>
//             item.id === productId ? { ...item, quantity: newQuantity } : item
//           )
//         );
//       }
//     }
//     setIsLoading(false);
//   };

//   const clearCart = () => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       setCart([]);
//       toast.success('Cart cleared!');
//     } else {
//       setCart([]);
//       localStorage.removeItem('guestCart');
//       toast.success('Cart cleared!');
//     }
//     setIsLoading(false);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const fetchUserCart = async () => {
//     if (isAuthenticated()) {
//       setIsLoading(true);
//       const token = sessionStorage.getItem('token');
//       try {
//         const response = await api.get('/api/v1/cart/', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const backendCart = response.data;
//         if (backendCart && backendCart.items && backendCart.items.length > 0) {
//           const transformedCart = backendCart.items.map(item => ({
//             id: item.product_id,
//             name: item.product_name,
//             price: parseFloat(item.product_price),
//             quantity: item.quantity,
//             image_url: item.image_url || '',
//             description: item.description || ''
//           }));
//           setCart(transformedCart);
//         } else {
//           setCart([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch cart:', error.response || error);
//         setCart([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const checkout = async (formData) => {
//     setIsLoading(true);
//     const token = sessionStorage.getItem('token');

//     try {
//       let response;
//       if (token) {
//         // Authenticated user checkout
//         const customerInfo = JSON.parse(formData.get('customerInfo'));
//         const backendCustomerInfo = {
//           first_name: customerInfo.name?.split(' ')[0] || customerInfo.name || '',
//           last_name: customerInfo.name?.split(' ').slice(1).join(' ') || '',
//           email: customerInfo.email,
//           contact: customerInfo.phone,
//           shipping_address: customerInfo.address || '',
//           payment_method: customerInfo.paymentMethod,
//           momo_number: customerInfo.momoNumber || '',
//           momo_network: customerInfo.momoNetwork || ''
//         };
//         response = await api.post('/api/v1/orders/checkout', formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         // Guest user checkout
//         response = await api.post('/api/v1/orders/guest', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }

//       if (response.data.success) {
//         clearCart();
//         return { success: true, data: response.data };
//       } else {
//         return { success: false, error: response.data.error || 'Checkout failed' };
//       }
//     } catch (error) {
//       console.error('Checkout error:', error.response?.data || error.message);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         'Checkout failed. Please try again.';
//       return { success: false, error: errorMessage };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated()) {
//       fetchUserCart();
//     }
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getCartTotal,
//         getCartItemsCount,
//         checkout,
//         fetchUserCart,
//         isLoading,
//         isAuthenticated
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };




// import React, { createContext, useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import API_BASE_URL from "../config";


// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     const savedCart = localStorage.getItem('guestCart');
//     return savedCart ? JSON.parse(savedCart) : [];
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const isAuthenticated = () => {
//     const token = sessionStorage.getItem('token');
//     if (!token) return false;
//     try {
//       const decoded = jwtDecode(token);
//       if (decoded.exp < Date.now() / 1000) {
//         sessionStorage.removeItem('token');
//         setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
//         return false;
//       }
//       return true;
//     } catch (e) {
//       console.error('Invalid token:', e);
//       sessionStorage.removeItem('token');
//       setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
//       return false;
//     }
//   };

//   // const api = axios.create({
//   //   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
//   //   timeout: 10000,
//   // });
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
// });

//   const checkout = async (formData) => {
//     setIsLoading(true);
//     try {
//       // Double-check authentication status to avoid stale tokens
//       if (!isAuthenticated()) {
//         sessionStorage.removeItem('token'); // Clear any invalid token
//       }
//       const token = sessionStorage.getItem('token');

//       let response;
//       if (isAuthenticated() && token) {
//         response = await api.post('/api/v1/orders/checkout', formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       } else {
//         // Ensure cart is included for guest checkout
//         formData.append('cart', JSON.stringify(cart));
//         response = await api.post('/api/v1/orders/guest', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }

//       if (response.data.success) {
//         clearCart();
//         toast.success('Order placed successfully!');
//         return { success: true, data: response.data };
//       } else {
//         return { success: false, error: response.data.error || 'Checkout failed' };
//       }
//     } catch (error) {
//       console.error('Checkout error:', error.response?.data || error.message);
//       const errorMessage =
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         'Checkout failed. Please try again.';
//       toast.error(errorMessage);
//       return { success: false, error: errorMessage };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addToCart = async (product, quantity = 1) => {
//     setIsLoading(true);
//     const existingProduct = cart.find(item => item.id === product.id);

//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         await api.post(
//           '/api/v1/cart/add',
//           { product_id: product.id, quantity },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         toast.success('Item added to cart!');
//         await fetchUserCart();
//       } catch (error) {
//         console.error('Add to cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to add to cart.');
//       }
//     } else {
//       if (existingProduct) {
//         setCart(
//           cart.map(item =>
//             item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
//           )
//         );
//       } else {
//         setCart([...cart, { ...product, quantity }]);
//       }
//       localStorage.setItem('guestCart', JSON.stringify(cart));
//       toast.success('Item added to cart!');
//     }
//     setIsLoading(false);
//   };

//   const removeFromCart = async (productId) => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         await api.delete('/api/v1/cart/remove', {
//           headers: { Authorization: `Bearer ${token}` },
//           data: { product_id: productId }
//         });
//         toast.info('Item removed from cart!');
//         await fetchUserCart();
//       } catch (error) {
//         console.error('Remove from cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to remove from cart.');
//       }
//     } else {
//       setCart(cart.filter(item => item.id !== productId));
//       localStorage.setItem('guestCart', JSON.stringify(cart));
//       toast.info('Item removed from cart!');
//     }
//     setIsLoading(false);
//   };

//   const updateQuantity = async (productId, newQuantity) => {
//     setIsLoading(true);
//     if (isAuthenticated()) {
//       const token = sessionStorage.getItem('token');
//       try {
//         await api.put(
//           '/api/v1/cart/update',
//           { product_id: productId, quantity: newQuantity },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         await fetchUserCart();
//       } catch (error) {
//         console.error('Update cart error:', error.response || error);
//         toast.error(error.response?.data?.error || 'Failed to update quantity.');
//       }
//     } else {
//       if (newQuantity <= 0) {
//         removeFromCart(productId);
//       } else {
//         setCart(
//           cart.map(item =>
//             item.id === productId ? { ...item, quantity: newQuantity } : item
//           )
//         );
//         localStorage.setItem('guestCart', JSON.stringify(cart));
//       }
//     }
//     setIsLoading(false);
//   };

//   const clearCart = () => {
//     setIsLoading(true);
//     setCart([]);
//     localStorage.removeItem('guestCart');
//     toast.success('Cart cleared!');
//     setIsLoading(false);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const getCartItemsCount = () => {
//     return cart.reduce((count, item) => count + item.quantity, 0);
//   };

//   const fetchUserCart = async () => {
//     if (isAuthenticated()) {
//       setIsLoading(true);
//       const token = sessionStorage.getItem('token');
//       try {
//         const response = await api.get('/api/v1/cart/', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const backendCart = response.data;
//         if (backendCart && backendCart.items && backendCart.items.length > 0) {
//           const transformedCart = backendCart.items.map(item => ({
//             id: item.product_id,
//             name: item.product_name,
//             price: parseFloat(item.product_price),
//             quantity: item.quantity,
//             image_url: item.image_url || '',
//             description: item.description || ''
//           }));
//           setCart(transformedCart);
//         } else {
//           setCart([]);
//         }
//       } catch (error) {
//         console.error('Failed to fetch cart:', error.response || error);
//         setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     localStorage.setItem('guestCart', JSON.stringify(cart));
//   }, [cart]);

//   useEffect(() => {
//     if (isAuthenticated()) {
//       fetchUserCart();
//     } else {
//       setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
//     }
//   }, []);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         getCartTotal,
//         getCartItemsCount,
//         checkout,
//         fetchUserCart,
//         isLoading,
//         isAuthenticated
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };













import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from "../config";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('guestCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        sessionStorage.removeItem('token');
        setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
        return false;
      }
      return true;
    } catch (e) {
      console.error('Invalid token:', e);
      sessionStorage.removeItem('token');
      setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
      return false;
    }
  };

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  const checkout = async (formData) => {
    setIsLoading(true);
    try {
      // Double-check authentication status to avoid stale tokens
      if (!isAuthenticated()) {
        sessionStorage.removeItem('token');
      }
      const token = sessionStorage.getItem('token');

      // Validate cart is not empty
      if (!cart || cart.length === 0) {
        toast.error('Your cart is empty');
        setIsLoading(false);
        return { success: false, error: 'Cart is empty' };
      }

      // Debug logging
      console.log('Cart before checkout:', cart);
      console.log('Cart length:', cart.length);
      console.log('Is authenticated:', isAuthenticated());

      // Add cart data for ALL checkouts (both authenticated and guest)
      formData.append('cart', JSON.stringify(cart));

      let response;
      if (isAuthenticated() && token) {
        response = await api.post('/api/v1/orders/checkout', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/api/v1/orders/guest', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.data.error || 'Checkout failed' };
      }
    } catch (error) {
      console.error('Checkout error:', error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Checkout failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    setIsLoading(true);
    const existingProduct = cart.find(item => item.id === product.id);

    if (isAuthenticated()) {
      const token = sessionStorage.getItem('token');
      try {
        await api.post(
          '/api/v1/cart/add',
          { product_id: product.id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Item added to cart!');
        await fetchUserCart();
      } catch (error) {
        console.error('Add to cart error:', error.response || error);
        toast.error(error.response?.data?.error || 'Failed to add to cart.');
      }
    } else {
      let newCart;
      if (existingProduct) {
        newCart = cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newCart = [...cart, { ...product, quantity }];
      }
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      toast.success('Item added to cart!');
    }
    setIsLoading(false);
  };

  const removeFromCart = async (productId) => {
    setIsLoading(true);
    if (isAuthenticated()) {
      const token = sessionStorage.getItem('token');
      try {
        await api.delete('/api/v1/cart/remove', {
          headers: { Authorization: `Bearer ${token}` },
          data: { product_id: productId }
        });
        toast.info('Item removed from cart!');
        await fetchUserCart();
      } catch (error) {
        console.error('Remove from cart error:', error.response || error);
        toast.error(error.response?.data?.error || 'Failed to remove from cart.');
      }
    } else {
      const newCart = cart.filter(item => item.id !== productId);
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      toast.info('Item removed from cart!');
    }
    setIsLoading(false);
  };

  const updateQuantity = async (productId, newQuantity) => {
    setIsLoading(true);
    if (isAuthenticated()) {
      const token = sessionStorage.getItem('token');
      try {
        await api.put(
          '/api/v1/cart/update',
          { product_id: productId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await fetchUserCart();
      } catch (error) {
        console.error('Update cart error:', error.response || error);
        toast.error(error.response?.data?.error || 'Failed to update quantity.');
      }
    } else {
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        const newCart = cart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(newCart);
        localStorage.setItem('guestCart', JSON.stringify(newCart));
      }
    }
    setIsLoading(false);
  };

  const clearCart = () => {
    setIsLoading(true);
    setCart([]);
    localStorage.removeItem('guestCart');
    toast.success('Cart cleared!');
    setIsLoading(false);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const fetchUserCart = async () => {
    if (isAuthenticated()) {
      setIsLoading(true);
      const token = sessionStorage.getItem('token');
      try {
        const response = await api.get('/api/v1/cart/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const backendCart = response.data;
        if (backendCart && backendCart.items && backendCart.items.length > 0) {
          const transformedCart = backendCart.items.map(item => ({
            id: item.product_id,
            name: item.product_name,
            price: parseFloat(item.product_price),
            quantity: item.quantity,
            image_url: item.image_url || '',
            description: item.description || ''
          }));
          setCart(transformedCart);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error.response || error);
        setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserCart();
    } else {
      setCart(JSON.parse(localStorage.getItem('guestCart') || '[]'));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        checkout,
        fetchUserCart,
        isLoading,
        isAuthenticated
      }}
    >
      {children}
    </CartContext.Provider>
  );
};