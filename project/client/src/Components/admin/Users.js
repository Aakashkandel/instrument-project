import React, { useEffect, useState } from 'react';
import axios from '../api/api'; 
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  let count = (currentPage - 1) * itemsPerPage + 1;

  const getUsers = async () => {
    try {
      const response = await axios.get('/fetchalluserapi', {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      console.log(response);
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const deleteUser = async (id) => {
    try {
      const response = await axios.get(`/adminusersdelete/${id}`, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      console.log(response);
      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  if (users.length === 0) return (<div>Loading...</div>);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="text-3xl mb-8 font-bold ml-10 text-gray-800">
        <h2>User Details</h2>
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
              <th className="py-3 px-4 border-b text-center text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              paginatedUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-center">{count++}</td>
                  <td className="py-3 px-4 border-b">{user.name}</td>
                  <td className="py-3 px-4 border-b">{user.phone}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">
                    {`${user.address.city_area}, ${user.address.district}, ${user.address.state}`}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {user.profileimage ? (
                      <img src={`http://localhost:5000/${user.profileimage}`} alt="user" className="w-20 h-20 object-cover rounded-lg" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <div className="flex justify-center items-center space-x-4">
                      <Link to={`../useredit/${user._id}`}>
                        <i className="fa-solid fa-pen text-blue-600 text-xl cursor-pointer"></i>
                      </Link>
                      <i onClick={() => deleteUser(user._id)} className="fa-solid fa-trash text-red-600 text-xl cursor-pointer"></i>
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
            Array.from({ length: Math.ceil(filteredUsers.length / itemsPerPage) }, (_, i) => (
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
            className={`px-3 py-1 mx-1 ${currentPage === Math.ceil(filteredUsers.length / itemsPerPage) ? 'cursor-not-allowed text-gray-400' : 'text-blue-600'}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUsers.length / itemsPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
