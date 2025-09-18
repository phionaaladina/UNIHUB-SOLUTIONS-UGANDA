


// // pages/Products.js
// import React, { useEffect, useState, useContext } from 'react';
// import ProductCard from '../components/ProductCard';
// import Filters from '../components/Filters';
// import CategoryTabs from '../components/CategoryTabs';
// import { CartContext } from '../context/CartContext'; // Import CartContext
// import '../styles/Products.css';

// const Products = ({ initialCategory = 'Laptops' }) => {
//   // Remove local cart state - we'll use CartContext instead
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState(initialCategory);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBrand, setSelectedBrand] = useState('');
//   const [selectedType, setSelectedType] = useState('');

//   // Use CartContext instead of props
//   const { cart, addToCart, getCartItemsCount, getCartTotal } = useContext(CartContext);

//   const categoryMap = {
//     Laptops: 1,
//     Desktops: 2,
//     'Storage & Memory': 3,
//     'Power Components': 4,
//     Accessories: 5,
//     'Smart Tech Devices': 6,
//   };

//   const categoryId = categoryMap[category];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const params = new URLSearchParams({
//           search: searchTerm,
//           page: 1,
//           per_page: 100,
//         });

//         if (!searchTerm && categoryId) {
//           params.append('category_id', categoryId);
//         }

//         if (selectedType) params.append('type', selectedType);
//         if (selectedBrand) params.append('brand', selectedBrand);

//         console.log('🔍 Fetching products with params:', params.toString());
//         const res = await fetch(`http://localhost:5000/api/v1/products/?${params.toString()}`);
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
        
//         const data = await res.json();
//         console.log('📦 API Response:', data);

//         if (data.products && Array.isArray(data.products)) {
//           setProducts(data.products);
//           console.log('✅ Products loaded successfully:', data.products.length);
//         } else {
//           setProducts([]);
//           console.warn("⚠️ API returned invalid products data:", data);
//         }
//       } catch (err) {
//         console.error('❌ Error fetching products:', err);
//         setProducts([]);
//         alert('Failed to load products. Please refresh the page.');
//       }
//     };

//     fetchProducts();
//   }, [searchTerm, categoryId, selectedType, selectedBrand]);

//   // Handle add to cart - this function will be passed to ProductCard
//   const handleAddToCart = async (product) => {
//     console.log('🎯 Products handleAddToCart called with:', product);
    
//     try {
//       // Validate product data before adding to cart
//       if (!product) {
//         throw new Error('Product is null or undefined');
//       }
      
//       if (!product.id) {
//         throw new Error('Product missing required ID');
//       }
      
//       if (!product.name) {
//         throw new Error('Product missing name');
//       }
      
//       if (!product.price || isNaN(product.price)) {
//         throw new Error('Product missing valid price');
//       }

//       console.log('✅ Product validation passed, calling CartContext addToCart...');
      
//       // Call the CartContext addToCart function
//       await addToCart(product, 1);
      
//       console.log('✅ Product successfully added to cart via CartContext');
      
//       // Optional: Show success message
//       // You could add a toast notification here
      
//     } catch (error) {
//       console.error('❌ Error in Products handleAddToCart:', error);
//       throw error; // Re-throw so ProductCard can handle it
//     }
//   };

//   return (
//     <div>
//       {/* Cart Count Display (Fixed top-right) */}
//       <div
//         style={{
//           position: 'fixed',
//           top: 10,
//           right: 10,
//           backgroundColor: 'orange',
//           padding: '6px 12px',
//           borderRadius: '50%',
//           color: 'white',
//           fontWeight: 'bold',
//           zIndex: 1000,
//           minWidth: '40px',
//           textAlign: 'center',
//         }}
//         title="Items in Cart"
//       >
//         🛒 {getCartItemsCount()}
//       </div>

//       <div className="py-5 text-white text-center bg-primary-gradient">
//         <h2 className="fw-bold">Our Products</h2>
//         <p className="lead">Discover Quality Hardware & Accessories That Power Your World</p>
//       </div>

//       <div className="container mt-4">
//         <div className="row g-3 justify-content-center mb-4">
//           <div className="col-md-6">
//             <Filters setSearchTerm={setSearchTerm} />
//           </div>
//         </div>

//         <CategoryTabs setCategory={setCategory} selectedCategory={category} />

//         <h4 className="text-center mb-3 fw-semibold">Explore Our Top Products</h4>

//         <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mb-5">
//           {products.length === 0 ? (
//             <div className="col-12 text-center text-muted">
//               Loading products or no products found for this selection.
//             </div>
//           ) : (
//             products.map((product) => {
//               console.log('🏷️ Rendering product:', product.id, product.name);
//               return (
//                 <div className="col" key={product.id}>
//                   <ProductCard product={product} onAddToCart={handleAddToCart} />
//                 </div>
//               );
//             })
//           )}
//         </div>

//         <hr className="my-5" />
//         <h2 className="mb-3 text-center">Your Shopping Cart</h2>
//         {cart.length === 0 ? (
//           <p className="text-center text-muted">Your cart is currently empty. Start adding some awesome products!</p>
//         ) : (
//           <div className="card shadow-sm p-3 mb-5">
//             <ul className="list-group list-group-flush">
//               {cart.map((item) => (
//                 <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
//                   <div>
//                     {item.name}
//                     <span className="badge bg-primary ms-2">x{item.quantity}</span>
//                   </div>
//                   <span className="fw-bold">UGX {(item.price * item.quantity).toLocaleString()}</span>
//                 </li>
//               ))}
//             </ul>
//             <div className="d-flex justify-content-end mt-3">
//               <h4 className="fw-bold">
//                 Total: UGX {getCartTotal().toLocaleString()}
//               </h4>
//             </div>
//             <div className="d-grid gap-2 mt-3">
//               <button className="btn btn-success btn-lg">Proceed to Checkout</button>
//             </div>
//           </div>
//         )}

//         <div className="text-center mt-5">
//           <h5 className="mb-3">Looking to order multiple items?</h5>
//           <button className="btn btn-primary px-5 py-2">Request a custom quote</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;



// // pages/Products.js
// import React, { useEffect, useState, useContext } from 'react';
// import ProductCard from '../components/ProductCard';
// import Filters from '../components/Filters';
// import CategoryTabs from '../components/CategoryTabs';
// import { CartContext } from '../context/CartContext'; // Import CartContext
// import '../styles/Products.css';

// const Products = ({ initialCategory = 'Laptops' }) => {
//   // Remove local cart state - we'll use CartContext instead
//   const [products, setProducts] = useState([]);
//   const [category, setCategory] = useState(initialCategory);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBrand, setSelectedBrand] = useState('');
//   const [selectedType, setSelectedType] = useState('');

//   // Use CartContext instead of props
//   const { cart, addToCart, getCartItemsCount, getCartTotal } = useContext(CartContext);

//   const categoryMap = {
//     Laptops: 1,
//     Desktops: 2,
//     'Storage & Memory': 3,
//     'Power Components': 4,
//     Accessories: 5,
//     'Smart Tech Devices': 6,
//   };

//   const categoryId = categoryMap[category];

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const params = new URLSearchParams({
//           search: searchTerm,
//           page: 1,
//           per_page: 100,
//         });

//         if (!searchTerm && categoryId) {
//           params.append('category_id', categoryId);
//         }

//         if (selectedType) params.append('type', selectedType);
//         if (selectedBrand) params.append('brand', selectedBrand);

//         console.log('🔍 Fetching products with params:', params.toString());
//         const res = await fetch(`http://localhost:5000/api/v1/products/?${params.toString()}`);
        
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
        
//         const data = await res.json();
//         console.log('📦 API Response:', data);

//         if (data.products && Array.isArray(data.products)) {
//           setProducts(data.products);
//           console.log('✅ Products loaded successfully:', data.products.length);
//         } else {
//           setProducts([]);
//           console.warn("⚠️ API returned invalid products data:", data);
//         }
//       } catch (err) {
//         console.error('❌ Error fetching products:', err);
//         setProducts([]);
//         alert('Failed to load products. Please refresh the page.');
//       }
//     };

//     fetchProducts();
//   }, [searchTerm, categoryId, selectedType, selectedBrand]);

//   // Handle add to cart - this function will be passed to ProductCard
//   const handleAddToCart = async (product) => {
//     console.log('🎯 Products handleAddToCart called with:', product);
    
//     try {
//       // Validate product data before adding to cart
//       if (!product) {
//         throw new Error('Product is null or undefined');
//       }
      
//       if (!product.id) {
//         throw new Error('Product missing required ID');
//       }
      
//       if (!product.name) {
//         throw new Error('Product missing name');
//       }
      
//       if (!product.price || isNaN(product.price)) {
//         throw new Error('Product missing valid price');
//       }

//       console.log('✅ Product validation passed, calling CartContext addToCart...');
      
//       // Call the CartContext addToCart function
//       await addToCart(product, 1);
      
//       console.log('✅ Product successfully added to cart via CartContext');
      
//       // Optional: Show success message
//       // You could add a toast notification here
      
//     } catch (error) {
//       console.error('❌ Error in Products handleAddToCart:', error);
//       throw error; // Re-throw so ProductCard can handle it
//     }
//   };

//   return (
//     <div>
//       {/* Cart Count Display (Fixed top-right) */}
//       <div
//         style={{
//           position: 'fixed',
//           top: 10,
//           right: 10,
//           backgroundColor: 'orange',
//           padding: '6px 12px',
//           borderRadius: '50%',
//           color: 'white',
//           fontWeight: 'bold',
//           zIndex: 1000,
//           minWidth: '40px',
//           textAlign: 'center',
//         }}
//         title="Items in Cart"
//       >
//         🛒 {getCartItemsCount()}
//       </div>

//       <div className="py-5 text-white text-center bg-primary-gradient">
//         <h2 className="fw-bold">Our Products</h2>
//         <p className="lead">Discover Quality Hardware & Accessories That Power Your World</p>
//       </div>

//       <div className="container mt-4">
//         <div className="row g-3 justify-content-center mb-4">
//           <div className="col-md-6">
//             <Filters setSearchTerm={setSearchTerm} />
//           </div>
//         </div>

//         <CategoryTabs setCategory={setCategory} selectedCategory={category} />

//         <h4 className="text-center mb-3 fw-semibold">Explore Our Top Products</h4>

//         <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mb-5">
//           {products.length === 0 ? (
//             <div className="col-12 text-center text-muted">
//               Loading products or no products found for this selection.
//             </div>
//           ) : (
//             products.map((product) => {
//               console.log('🏷️ Rendering product:', product.id, product.name);
//               return (
//                 <div className="col" key={product.id}>
//                   <ProductCard product={product} onAddToCart={handleAddToCart} />
//                 </div>
//               );
//             })
//           )}
//         </div>



//         <div className="text-center mt-5">
//           <h5 className="mb-3">Looking to order multiple items?</h5>
//           <button className="btn btn-primary px-5 py-2">Request a custom quote</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;




// pages/Products.js
import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import CategoryTabs from '../components/CategoryTabs';
import { CartContext } from '../context/CartContext'; // Import CartContext
import API_BASE_URL from "../config";
import '../styles/Products.css';

const Products = ({ initialCategory = 'Laptops' }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const { cart, addToCart, getCartItemsCount, getCartTotal } = useContext(CartContext);

  const categoryMap = {
    Laptops: 1,
    Desktops: 2,
    'Storage & Memory': 3,
    'Power Components': 4,
    Accessories: 5,
    'Smart Tech Devices': 6,
  };

  const categoryId = categoryMap[category];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          page: 1,
          per_page: 100,
        });

        if (!searchTerm && categoryId) {
          params.append('category_id', categoryId);
        }

        if (selectedType) params.append('type', selectedType);
        if (selectedBrand) params.append('brand', selectedBrand);

        console.log('🔍 Fetching products with params:', params.toString());
        const res = await fetch(`${API_BASE_URL}/api/v1/products/?${params.toString()}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📦 API Response:', data);

        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          console.log('✅ Products loaded successfully:', data.products.length);
        } else {
          setProducts([]);
          console.warn("⚠️ API returned invalid products data:", data);
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setProducts([]);
        alert('Failed to load products. Please refresh the page.');
      }
    };

    fetchProducts();
  }, [searchTerm, categoryId, selectedType, selectedBrand]);

  const handleAddToCart = async (product) => {
    console.log('🎯 Products handleAddToCart called with:', product);
    
    try {
      if (!product) throw new Error('Product is null or undefined');
      if (!product.id) throw new Error('Product missing required ID');
      if (!product.name) throw new Error('Product missing name');
      if (!product.price || isNaN(product.price)) throw new Error('Product missing valid price');

      console.log('✅ Product validation passed, calling CartContext addToCart...');
      await addToCart(product, 1);
      console.log('✅ Product successfully added to cart via CartContext');
    } catch (error) {
      console.error('❌ Error in Products handleAddToCart:', error);
      throw error;
    }
  };

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          backgroundColor: 'orange',
          padding: '6px 12px',
          borderRadius: '50%',
          color: 'white',
          fontWeight: 'bold',
          zIndex: 1000,
          minWidth: '40px',
          textAlign: 'center',
        }}
        title="Items in Cart"
      >
        🛒 {getCartItemsCount()}
      </div>

      <div className="py-5 text-white text-center bg-primary-gradient">
        <h2 className="fw-bold">Our Products</h2>
        <p className="lead">Discover Quality Hardware & Accessories That Power Your World</p>
      </div>

      <div className="container mt-4">
        <div className="row g-3 justify-content-center mb-4">
          <div className="col-md-6">
            <Filters setSearchTerm={setSearchTerm} />
          </div>
        </div>

        <CategoryTabs setCategory={setCategory} selectedCategory={category} />

        <h4 className="text-center mb-3 fw-semibold">Explore Our Top Products</h4>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mb-5">
          {products.length === 0 ? (
            <div className="col-12 text-center text-muted">
              Loading products or no products found for this selection.
            </div>
          ) : (
            products.map((product) => {
              console.log('🏷️ Rendering product:', product.id, product.name);
              return (
                <div className="col" key={product.id}>
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              );
            })
          )}
        </div>

        <div className="text-center mt-5">
          <h5 className="mb-3">Looking to order multiple items?</h5>
          <button className="btn btn-primary px-5 py-2">Request a custom quote</button>
        </div>
      </div>
    </div>
  );
};

export default Products;