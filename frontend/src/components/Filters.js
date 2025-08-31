// import React from 'react';

// const Filters = ({ setSearchTerm }) => {
//   return (
//     <div className="flex justify-center my-4">
//       <input
//         type="text"
//         placeholder="Search products..."
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
//   );
// };

// export default Filters;


// src/components/Filters.jsx
import React from 'react';

const Filters = ({ setSearchTerm }) => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="🔍 Search by Product Name or Brand."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Filters;















// import React from 'react';

// const Filters = ({ setSearchTerm }) => {
//   return (
//     <div className="flex flex-wrap gap-4 mb-4">
//       <input
//         type="text"
//         placeholder="Search"
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border px-4 py-2 rounded-md"
//       />
//       <select className="border px-4 py-2 rounded-md">
//         <option>By Product Type</option>
//         <option>Laptop</option>
//         <option>Desktop</option>
//         <option>Accessory</option>
//       </select>
//       <select className="border px-4 py-2 rounded-md">
//         <option>By Brand</option>
//         <option>HP</option>
//         <option>Dell</option>
//         <option>Lenovo</option>
//       </select>
//     </div>
//   );
// };

// export default Filters;
