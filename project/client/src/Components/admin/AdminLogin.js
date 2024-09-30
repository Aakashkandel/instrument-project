import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message
        
        try {
            const response = await axios.post('/adminloginapi', { email, password }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Login successful:', response.data);
            // Redirect or handle successful login here (e.g., save token to local storage and navigate)
            localStorage.setItem('token', response.data.token);
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'An error occurred during login.');
        }
    };

    // Function to handle Home button click
    const handleHomeClick = () => {
        navigate('/');  // Redirect to home page
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Admin Login</h2>
                <form id="adminLoginForm" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm" 
                            />
                        </div>
                        {error && <div id="error-message" className="text-red-500 text-sm">{error}</div>}
                        <div>
                            <button 
                                type="submit" 
                                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </form>
                <div className="flex justify-center mt-4">
                    {/* Home button */}
                    <button 
                        onClick={handleHomeClick} 
                        className="py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}
