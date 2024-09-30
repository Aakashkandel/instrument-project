import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Assets/css/Index.css';
import image1 from "./Assets/image1.png";
import image2 from "./Assets/image2.png";
import image3 from "./Assets/image3.png";
import { useDispatch, useSelector } from "react-redux";
import axios from './api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import aawaj from "./Assets/dataBaseImage/Aawaj.png";
import aawaj2 from "./Assets/dataBaseImage/Aawaj2.png";


const IndexLoggedin = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);
    const [products, setProducts] = useState([]);

    const reduxdata = useSelector(state => state.authenticate);

    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axios.get("allproductapi");
            setProducts(response.data.products);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        setSlides(document.querySelectorAll('.slide'));
    }, []);

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 3000);
        return () => clearInterval(slideInterval);
    }, [slides]);

    useEffect(() => {
        slides.forEach((slide, index) => {
            slide.style.opacity = index === currentSlide ? 1 : 0;
        });
    }, [currentSlide, slides]);

    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % slides.length);
    };





    return (
        <div className="flex w-auto">



            <div className="w-screen ">
                <div className="bg-blue-50 h-screen">
                    <div className="flex justify-between text-center mx-20 items-center">
                        <div className="text-green-600 text-2xl my-2 font-bold">

                            <img src={aawaj2} alt="Company Logo" className="h-20 mr-4" />


                        </div>
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                                Nepal Instrument
                            </h2>
                            <p className="text-lg text-gray-600">
                                Discover the finest collection of traditional and modern instruments.
                            </p>
                        </div>





                        <div class="flex space-x-5 ">
                            <Link to="/register"
                                class="text-white text-lg bg-purple-800 btn-hover scale-110 px-4 py-1 rounded-lg">Register</Link>

                            <Link to="/login" class="text-white text-lg bg-blue-800 btn-hover scale-110 px-4 py-1 rounded-lg">Login</Link>

                        </div>


                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-center mt-5 text-gray-600">Welcome to our music world!</h2>
                    </div>

                    <div className="flex h-3/6 justify-center">
                        <div className="slide-container w-4/12 h-76 my-10">
                            <div className="flex slider">
                                <div className="slide slide1"><img src={image1} alt="Slide 1" /></div>
                                <div className="slide slide2"><img src={image2} alt="Slide 2" /></div>
                                <div className="slide slide3"><img src={image3} alt="Slide 3" /></div>
                            </div>
                        </div>

                        <div className="textbox w-7/12 my-10">
                            <div>
                                <p className="px-20 py-10 text-xl">
                                    "Welcome to our instrument sanctuary, where passion and precision harmonize. Explore our curated collection, each instrument a testament to craftsmanship and musical expression. From classic melodies to modern tunes, discover the soulful resonance waiting to be unlocked in every finely crafted piece."
                                </p>
                            </div>
                            <div className="mx-20">
                                <a className="bg-green-700 px-2 py-1 rounded font-semibold text-white" href="/users/shop">Shop Now</a>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="border rounded-lg p-6 shadow-md bg-green-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a2 2 0 0 0-2 2v2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2v-2a2 2 0 0 0-2-2H6zm1 2h8v8H7V4zm8 10v2H5v-2h10zM8 8H6v6h2V8z" clipRule="evenodd" />
                                    </svg>
                                    Free Delivery
                                </h3>
                                <h1 className="text-gray-600 mt-2">Get free delivery on all orders above $50. We ensure timely and secure delivery of your instruments.</h1>
                            </div>

                            <div className="border rounded-lg p-6 shadow-md bg-yellow-200">
                                <h3 className="text-lg font-semibold text-gray-800">Genuine Products</h3>
                                <h1 className="text-gray-600 mt-2">We guarantee authentic and high-quality instruments sourced directly from trusted manufacturers.</h1>
                            </div>

                            <div className="border rounded-lg p-6 shadow-md bg-purple-200">
                                <h3 className="text-lg font-semibold text-gray-800">Huge Saving</h3>
                                <h1 className="text-gray-600 mt-2">Enjoy exclusive discounts and offers on a wide range of instruments. Save big on your purchases!</h1>
                            </div>

                            <div className="border rounded-lg p-6 shadow-md bg-blue-200">
                                <h3 className="text-lg font-semibold text-gray-800">Easy Return</h3>
                                <h1 className="text-gray-600 font-normal mt-2">Not satisfied with your purchase? No worries! We offer hassle-free returns and refunds within 30 days.</h1>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto ">
                        <div className="text-2xl text-center font-bold text-gray-800 mb-8">
                            <h2 class="bg-gray-900 text-gray-200 px-5 py-1 rounded ">Latest Products</h2>
                        </div>
                    </div>


                    <div className="container mx-auto mt-10 px-4 py-8">
                        <div className="latest-products grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                            {products?.slice(0, 5).map((product, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                                    <div className="relative">
                                        <img
                                            src={`http://localhost:5000/${product.image}`}
                                            alt={product.product_name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-br-lg">
                                            New
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.product_name}</h3>
                                        <h4 className="text-gray-700 text-sm mb-4">{product.title}</h4>
                                        <div className="flex flex-col space-y-2 mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-500 line-through text-sm">Rs {product.price.regular_price}</span>
                                                <span className="text-red-500 font-semibold text-lg">Rs {product.price.sales_price}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <Link to={`productview/${product._id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out">
                                                    View Product
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <footer className="py-8 bg-gray-900 text-white">
                        <div className="container mx-auto">
                            <div className="flex justify-around items-center mb-8">
                                <div className="flex items-center">
                                    <img src={aawaj} alt="Company Logo" className="h-40 mr-4" />
                                    <h1 className="text-lg">Instrument Nepal - Your Destination for Quality Instruments</h1 >
                                </div>

                                <ul className="grid grid-cols-3 gap-4">
                                    <li><a href="#" className="hover:text-gray-400">Home</a></li>
                                    <li><a href="#" className="hover:text-gray-400">Store</a></li>
                                    <li><a href="#" className="hover:text-gray-400">Order</a></li>
                                    <li><a href="#" className="hover:text-gray-400">Profile</a></li>
                                    <li><a href="#" className="hover:text-gray-400">About</a></li>
                                    <li><a href="#" className="hover:text-gray-400">Help</a></li>
                                </ul>
                            </div>

                            <div class="text-center">&copy; 2024 Instrument Nepal. All rights reserved.</div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default IndexLoggedin;
