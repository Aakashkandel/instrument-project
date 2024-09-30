import React from 'react';
import { useState } from 'react';
import { useFormik } from "formik";
import axios from "../api/api";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userLogin } from "../state/action/SessionData";

const initialValues = {
    email: "",
    password: ""
}

export default function Login() {
    const dispatchh = useDispatch();
    const navigate = useNavigate();
    const [formmessage, setformmessage] = useState('');

    const { values, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/loginapi', values);
                let usertype = response.data.usertype;
                let token = response.data.token;
                
                if (usertype === "vendor") {
                    localStorage.setItem("token", token);
                    let { email, _id: id, name } = response.data.vendorData;
                    dispatchh(userLogin(email, id, name, usertype));
                    toast.success("Successfully Logged in!");
                    navigate("/vendors/");
                } else if (usertype === "user") {
                    localStorage.setItem("token", token);
                    let { email, _id: id, name } = response.data.userData;
                    dispatchh(userLogin(email, id, name, usertype));
                    toast.success("Successfully Logged in!");
                    navigate("/users/");
                }
            } catch (error) {
                if (error.response) {
                    setformmessage(error.response.data.message);
                }
            }
        }
    });

    const formSubmitHandle = (event) => {
        event.preventDefault();
        handleSubmit(event);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="absolute top-4 left-4">
                <Link to="/" className="text-blue-600 font-medium hover:underline">Home</Link>
            </div>
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800">Instrument Marketplace</h2>
                <h1 className="mt-4 text-xl font-semibold text-gray-600 text-center">Sign in to your account</h1>
                <form className="space-y-6 mt-6" onSubmit={formSubmitHandle}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your email</label>
                        <input type="email" value={values.email} onChange={handleChange} name="email" id="email" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={values.password} onChange={handleChange} name="password" id="password" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" required />
                    </div>
                    <p className="text-red-600 text-sm">{formmessage}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
                        </div>
                        <Link to="/forgotpassword" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-500">Sign in</button>
                    <p className="text-sm text-center text-gray-600">
                        Don’t have an account yet? <Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
                    </p>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
