import React, { useState, useEffect } from 'react';
import axios from '../api/api'; 
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function UserEdit() {
  const { id } = useParams();  // get user id from the route parameter
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    phone: '',
    email: '',
    address: { city_area: '', district: '', state: '' },
    profileimage: ''
  });
  const [previewImage, setPreviewImage] = useState(null);

  
  const getUserDetails = async () => {
    try {
      const response = await axios.get(`/adminusers/${id}`, {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      });
      setUser(response.data);
      setPreviewImage(response.data.profileimage ? `http://localhost:5000/${response.data.profileimage}` : null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      address: { ...prevUser.address, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    setUser({ ...user, profileimage: e.target.files[0] });
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('phone', user.phone);
    formData.append('email', user.email);
    formData.append('city_area', user.address.city_area);
    formData.append('district', user.address.district);
    formData.append('state', user.address.state);
    if (user.profileimage) {
      formData.append('profileimage', user.profileimage);
    }

    try {
      await axios.post(`/adminusersupdate/${id}`, formData, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
      setTimeout(() => {
        toast.success('User updated successfully!');
      }, 100);
      navigate('/admin/users');  // navigate back to users page
    } catch (err) {
      console.log(err);
      toast.error('Failed to update user!');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="text-3xl mb-8 font-bold ml-10 text-gray-800">
        <h2>Edit User</h2>
      </div>
      <form onSubmit={handleSubmit} className="w-11/12 m-auto bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">City Area</label>
            <input
              type="text"
              name="city_area"
              value={user.address.city_area}
              onChange={handleAddressChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">District</label>
            <input
              type="text"
              name="district"
              value={user.address.district}
              onChange={handleAddressChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={user.address.state}
              onChange={handleAddressChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Profile Image</label>
            <input
              type="file"
              name="profileimage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Profile Image Preview</label>
            {previewImage ? (
              <img src={previewImage} alt="preview" className="w-32 h-32 object-cover rounded-lg" />
            ) : (
              <span>No Image</span>
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Update User
          </button>
        </div>
      </form>
    </div>
  );
}
