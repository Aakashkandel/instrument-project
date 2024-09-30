import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

export default function Product() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  let count = (currentPage - 1) * itemsPerPage + 1;
  const params = useParams();
  const id = params.id;
  console.log(id);

  const getProducts = async () => {
    try {
      const response = await axios.get(`/fetchorderbyvendor/${id}`, {

        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      setProducts(response.data.order.items);
      setOrder(response.data.order);
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
    product.productId.toLowerCase().includes(search.toLowerCase())

  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (products.length === 0) return (<div>Loading...</div>);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="text-3xl  mb-8 font-bold text-gray-800">
        <h2>Product Details</h2>
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

      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-md mb-6">
  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Shipping Details</h3>
  <div className="space-y-4">
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">Customer Name:</span>
      <span className="text-gray-600">{order.shippingDetails.name}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">Address:</span>
      <span className="text-gray-600">{order.shippingDetails.street}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">City:</span>
      <span className="text-gray-600">{order.shippingDetails.city}</span>
    </div>
   
    <div className="flex justify-between">
      <span className="font-medium text-gray-700">Postal Code:</span>
      <span className="text-gray-600">{order.shippingDetails.postal}</span>
    </div>
  
  
  
   
  </div>
</div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-gray-700">S.N</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Product ID</th>

              <th className="py-3 px-4 border-b text-left text-gray-700">Quantity</th>
              <th className="py-3 px-4 border-b text-left text-gray-700"> Price</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Total Amount</th>

            </tr>
          </thead>
          <tbody>
            {
              paginatedProducts.map((product) => (
                <tr key={product} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-center">{count++}</td>
                  <td className="py-3 px-4 border-b">{product.productId}</td>

                  <td className="py-3 px-4 border-b">{product.quantity}</td>
                  <td className="py-3 px-4 border-b">{product.price}</td>
                  <td className="py-3 px-4 border-b">{product.price * product.quantity}</td>

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
     
      <div className="flex justify-center mt-4">
       <a href="/vendors/order" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Back</a>
        </div>
    </div>
  );
}
