// src/components/CategoryTabs.jsx
import React from 'react';

const tabs = [
  'Laptops',
  'Desktops',
  'Storage & Memory',
  'Power Components',
  'Accessories',
  'Smart Tech Devices',
];

const CategoryTabs = ({ setCategory, selectedCategory }) => {
  return (
    <div className="nav nav-tabs justify-content-center mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`nav-link ${selectedCategory === tab ? 'active' : ''}`}
          onClick={() => setCategory(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;











// import React from 'react';

// const categories = [
//   'Laptops',
//   'Desktops',
//   'Storage & Memory',
//   'Power Components',
//   'Accessories',
//   'Smart Tech Devices',
// ];

// const CategoryTabs = ({ setCategory, selectedCategory }) => {
//   return (
//     <div className="flex flex-wrap justify-center gap-3 my-4">
//       {categories.map((cat) => (
//         <button
//           key={cat}
//           onClick={() => setCategory(cat)}
//           className={`px-4 py-2 rounded-full border ${
//             selectedCategory === cat
//               ? 'bg-blue-700 text-white border-blue-700'
//               : 'bg-white text-gray-700 border-gray-300'
//           } hover:bg-blue-100 transition`}
//         >
//           {cat}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default CategoryTabs;






