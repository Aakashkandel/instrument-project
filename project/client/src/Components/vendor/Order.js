import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { Link } from 'react-router-dom';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  let count = (currentPage - 1) * itemsPerPage + 1;

  const getProducts = async () => {
    try {
      const response = await axios.get('/fetchorderbyvendor', {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      setProducts(response.data.orders);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredProducts = products.filter(product =>
    product._id.toLowerCase().includes(search.toLowerCase())
   
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (products.length === 0) return (<div>Loading...</div>);

  return (
    <div className="container mx-auto p-4">
      <div className="text-3xl  mb-8 font-bold text-gray-800">
        <h2>Order Detais</h2>
      </div>
     <div class="flex justify-between">
     <div className="mb-4 w-10/12 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by product name or category"
          value={search}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded w-full max-w-md"
        />
      </div>

     
     </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-gray-700">S.N</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Order Id</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Total Items</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Payment Method</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Payment Status</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Order Date</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Order Customer</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">view Product</th>
             
            </tr>
          </thead>
          <tbody>
            {
              paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-center">{count++}</td>
                  <td className="py-3 px-4 border-b">{product._id}</td>
                  <td className="py-3 px-4 border-b">{product.items.length}</td>
                  <td className="py-3 px-4 border-b">{product.paymentMethod}</td>
                  <td className="py-3 px-4 border-b">{product.paymentStatus}</td>
                  <td className="py-3 px-4 border-b">{product.createdAt}</td>
                  <td className="py-3 px-4 border-b">{product.shippingDetails.email}</td>
                  <td className="py-3 px-4 border-b">
                    <Link to={`/vendors/productview/${product._id}`} className="text-blue-600 hover:underline">View</Link>
                  </td>
                  
                </tr>
              ))
            }
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <button
            className={`px-3 py-1 mx-1 ${currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'text-blue-600'}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {
            Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 mx-1 ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-blue-600'}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))
          }
          <button
            className={`px-3 py-1 mx-1 ${currentPage === Math.ceil(filteredProducts.length / itemsPerPage) ? 'cursor-not-allowed text-gray-400' : 'text-blue-600'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
