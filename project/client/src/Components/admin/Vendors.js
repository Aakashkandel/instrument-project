// src/components/VendorList.js
import React, { useEffect, useState } from 'react';
import axios from '../api/api'; // Adjust the path if needed
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';




export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  let count = (currentPage - 1) * itemsPerPage + 1;

  const getVendors = async () => {
    try {
      const response = await axios.get('/adminvendorapi', {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      console.log(response);
      setVendors(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getVendors();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(search.toLowerCase()) ||
    vendor.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const deleteVendor = async (id) => {
    try {
      const response = await axios.get(`/adminvendorapi/${id}`, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      setTimeout(() => {
        toast.success('Vendor deleted successfully');
      }, 100);
      console.log(response);
      getVendors();
    } catch (err) {
      console.log(err);
    }
  };

  if (vendors.length === 0) return (<div>Loading...</div>);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="text-3xl mb-8 font-bold ml-10 text-gray-800">
        <h2>Vendor Details</h2>
      </div>
      <div className="flex justify-between">
        <div className="mb-4 w-10/12 flex ml-12 justify-between items-center">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded w-full max-w-md"
          />
        </div>
       
      </div>
      <div className="overflow-x-auto">
        <table className="w-11/12 m-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-gray-700">S.N</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Name</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Phone</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Email</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">Address</th>

              <th className="py-3 px-4 border-b text-left text-gray-700">Profile Image</th>

              <th className="py-3 px-4 border-b text-left text-gray-700">Pan no.</th>
              <th className="py-3 px-4 border-b text-left text-gray-700">EsewaId</th>
              <th className="py-3 px-4 border-b text-center text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              paginatedVendors.map((vendor) => (
                <tr key={vendor._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-center">{count++}</td>
                  <td className="py-3 px-4 border-b">{vendor.name}</td>
                  <td className="py-3 px-4 border-b">{vendor.phone}</td>
                  <td className="py-3 px-4 border-b">{vendor.email}</td>
                  <td className="py-3 px-4 border-b">
                    {`${vendor.address.city_area}, ${vendor.address.district}, ${vendor.address.state}`}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {vendor.profileimage ? (
                      <img src={`http://localhost:5000/${vendor.profileimage}`} alt="vendor" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b">{vendor.panno}</td>
                  <td className="py-3 px-4 border-b">{vendor.esewaid}</td>
                  <td className="py-3 px-4 border-b text-center">
                    <div className="flex justify-center items-center space-x-4">
                    <Link to={`../vendoredit/${vendor._id}`}> <i className="fa-solid fa-edit text-blue-600 text-xl cursor-pointer"></i></Link>
                    
                        <i onClick={() => deleteVendor(vendor._id)} className="fa-solid fa-trash text-red-600 text-xl cursor-pointer"></i>
                  
                    </div>
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
            Array.from({ length: Math.ceil(filteredVendors.length / itemsPerPage) }, (_, i) => (
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
            className={`px-3 py-1 mx-1 ${currentPage === Math.ceil(filteredVendors.length / itemsPerPage) ? 'cursor-not-allowed text-gray-400' : 'text-blue-600'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredVendors.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
