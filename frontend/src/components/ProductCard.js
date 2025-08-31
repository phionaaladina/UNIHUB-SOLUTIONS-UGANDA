// components/ProductCard.js
import React, { useState } from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddToCart = async () => {
    console.log('🛒 ProductCard: Add to cart button clicked for:', product?.name);
    console.log('🔍 ProductCard: Product data:', product);
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Additional validation at component level
      if (!product) throw new Error('No product data provided');
      if (!onAddToCart || typeof onAddToCart !== 'function') throw new Error('onAddToCart function not provided or invalid');
      if (product.stock === 0) throw new Error('Product is out of stock');

      console.log('✅ ProductCard: Validation passed, calling onAddToCart...');
      
      await onAddToCart(product);
      
      console.log('✅ ProductCard: Successfully added to cart');
      setSuccess('Added to cart!');
      
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('❌ ProductCard: Failed to add product to cart:', error);
      setError(`Failed to add to cart: ${error.message}`);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="card h-100 text-center shadow-sm border-0 custom-product-card">
        <div className="card-body d-flex flex-column justify-content-center">
          <p className="text-muted">Product data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 text-center shadow-sm border-0 custom-product-card">
      <img
        src={product.image_url || '/api/placeholder/300/200'}
        alt={product.name || 'Product image'}
        className="card-img-top product-image"
        style={{ height: '180px', objectFit: 'cover' }}
        onError={(e) => { e.target.src = '/api/placeholder/300/200'; }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-semibold">{product.name || 'Unknown Product'}</h5>
        <p className="card-text text-muted small flex-grow-1">
          {product.description || 'No description available'}
        </p>
        
        {product.stock === 0 ? (
          <div className="alert alert-danger p-2 mb-2" role="alert">
            <small style={{ color: 'rgb(220, 53, 69)' }}>Out of Stock</small>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger alert-sm p-2 mb-2" role="alert">
                <small>{error}</small>
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="alert alert-success alert-sm p-2 mb-2" role="alert">
                <small>{success}</small>
              </div>
            )}
            
            <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
              <span className="text-orange fw-bold">
                UGX {product.price ? product.price.toLocaleString() : '0'}
              </span>
              <button
                className="btn btn-warning btn-sm fw-semibold d-flex align-items-center gap-2"
                onClick={handleAddToCart}
                disabled={loading || product.stock === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-fill text-white"></i> Add to Cart
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;



// // components/ProductCard.js
// import React, { useState } from 'react';

// const ProductCard = ({ product, onAddToCart }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleAddToCart = async () => {
//     console.log('🛒 ProductCard: Add to cart button clicked for:', product?.name);
//     console.log('🔍 ProductCard: Product data:', product);
    
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       // Additional validation at component level
//       if (!product) {
//         throw new Error('No product data provided');
//       }

//       if (!onAddToCart || typeof onAddToCart !== 'function') {
//         throw new Error('onAddToCart function not provided or invalid');
//       }

//       console.log('✅ ProductCard: Validation passed, calling onAddToCart...');
      
//       // Call the onAddToCart function passed from Products component
//       await onAddToCart(product);
      
//       console.log('✅ ProductCard: Successfully added to cart');
//       setSuccess('Added to cart!');
      
//       // Clear success message after 2 seconds
//       setTimeout(() => setSuccess(''), 2000);
      
//     } catch (error) {
//       console.error('❌ ProductCard: Failed to add product to cart:', error);
//       setError(`Failed to add to cart: ${error.message}`);
      
//       // Clear error message after 3 seconds
//       setTimeout(() => setError(''), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle missing or invalid product data
//   if (!product) {
//     return (
//       <div className="card h-100 text-center shadow-sm border-0 custom-product-card">
//         <div className="card-body d-flex flex-column justify-content-center">
//           <p className="text-muted">Product data not available</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card h-100 text-center shadow-sm border-0 custom-product-card">
//       <img
//         src={product.image_url || '/api/placeholder/300/200'}
//         alt={product.name || 'Product image'}
//         className="card-img-top product-image"
//         style={{ height: '180px', objectFit: 'cover' }}
//         onError={(e) => {
//           e.target.src = '/api/placeholder/300/200'; // Fallback image
//         }}
//       />
//       <div className="card-body d-flex flex-column">
//         <h5 className="card-title fw-semibold">{product.name || 'Unknown Product'}</h5>
//         <p className="card-text text-muted small flex-grow-1">
//           {product.description || 'No description available'}
//         </p>
        
//         {/* Error Message */}
//         {error && (
//           <div className="alert alert-danger alert-sm p-2 mb-2" role="alert">
//             <small>{error}</small>
//           </div>
//         )}
        
//         {/* Success Message */}
//         {success && (
//           <div className="alert alert-success alert-sm p-2 mb-2" role="alert">
//             <small>{success}</small>
//           </div>
//         )}
        
//         <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
//           <span className="text-orange fw-bold">
//             UGX {product.price ? product.price.toLocaleString() : '0'}
//           </span>
//           <button
//             className="btn btn-warning btn-sm fw-semibold d-flex align-items-center gap-2"
//             onClick={handleAddToCart}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <span
//                   className="spinner-border spinner-border-sm"
//                   role="status"
//                   aria-hidden="true"
//                 ></span>
//                 Adding...
//               </>
//             ) : (
//               <>
//                 <i className="bi bi-cart-fill text-white"></i> Add to Cart
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCard;