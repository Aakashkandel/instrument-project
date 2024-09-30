// src/components/VendorEdit.js
import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditVendor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState({
        name: '',
        phone: '',
        email: '',
        address: {
            city_area: '',
            district: '',
            state: '',
        },
        panno: '',
        esewaid: '',
        profileimage: '',
    });

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await axios.get(`/adminvendorapi/${id}`, {
                    headers: {
                        'x-access-token': localStorage.getItem('token'),
                    },
                });
                setVendor(response.data);
                console.log(response);
            } catch (err) {
                console.error('Error fetching vendor:', err);
                toast.error('Failed to fetch vendor data.');
            }
        };
        fetchVendor();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVendor((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setVendor((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/adminvendorapi/${id}`, vendor, {
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                },
            });
            setTimeout(() => {
                toast.success('Vendor updated successfully!');
                
            }, 100);
            navigate('../allvendor'); 
        } catch (err) {
            console.error('Error updating vendor:', err);
            toast.error('Failed to update vendor.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <h2 className="text-3xl mb-8 font-bold text-gray-800">Edit Vendor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={vendor.name}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={vendor.phone}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={vendor.email}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
                <input
                    type="text"
                    name="city_area"
                    placeholder="City Area"
                    value={vendor.address.city_area}
                    onChange={handleAddressChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
                <input
                    type="text"
                    name="district"
                    placeholder="District"
                    value={vendor.address.district}
                    onChange={handleAddressChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={vendor.address.state}
                    onChange={handleAddressChange}
                    className="p-2 border border-gray-300 rounded w-full"
                    required
                />
                <input
                    type="text"
                    name="panno"
                    placeholder="PAN No."
                    value={vendor.panno}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="text"
                    name="esewaid"
                    placeholder="Esewa ID"
                    value={vendor.esewaid}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-600 text-white rounded"
                >
                    Update Vendor
                </button>
            </form>
        </div>
    );
}
