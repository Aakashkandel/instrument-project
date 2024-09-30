import React, { useEffect, useState } from 'react';
import VendorNavbar from '../Navbar/VendorNavbar';

import esewaimg from '../Assets/esewa.png';
import axios from '../api/api';
import '../Assets/css/Inputfield.css';
import '../Assets/css/pageloader.css';

import { useFormik } from 'formik';
import ProductSchema from '../../schemas/ProductSchema';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function EditProduct() {
    const [btnhidden, setBtnhidden] = useState(false);
    const [error, seterror] = useState(null);
    const [Filess, setFile] = useState(null);
    const [esewa, setEsewa] = useState(false);
    const [data, setData] = useState([null]);
    const navigate = useNavigate();

    // Fetch ID from params
    const params = useParams();
    const id = params.id;

    // Fetch Product Data by ID
    const fetchData = async () => {
        try {
            const response = await axios.get(`/fetchproductbyidapi/${id}`, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            });
            setData(response.data.products);
            console.log(response.data.products);
            console.log("data..........")
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [id]);

    const btnHandler = (e) => {
        e.preventDefault();
        setBtnhidden(true);
    };

    // Initial form values
    const initialValues = {
        _id: data?._id || '',
        product_name: data?.product_name || '',
        title: data?.title || '',
        regular_price: data?.price?.regular_price || '',
        sales_price: data?.price?.sales_price || '',
        stock: data?.stock || '',
        category: data?.category || '',
        visibility: data?.visibility || '',
        description: data?.description || '',
        warrenty_year: data?.warrenty_year || '',
        warrenty_month: data?.warrenty_month || '',
        image: data?.image || '',
    };

    // Formik form handling
    const { values, errors, handleBlur, touched, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: ProductSchema,
        onSubmit: async (values) => {
            if (!btnhidden) {
                values.warrenty_month = "";
                values.warrenty_year = "";
            }
            values.token = localStorage.getItem('token');

            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            formData.append('image', Filess);
            formData.append('status', btnhidden);

            try {
                seterror(null);
                console.log(values);
              const response=  await axios.post(`/productupdate/${values._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': localStorage.getItem('token'),
                },
            });
            console.log(response);
                setTimeout(() => {
                    toast.success("Product Updated Successfully");
                    
                }, 100);
                navigate('../product');
            } catch (error) {
                console.error('Error:', error);
                const receiveerror = error.response.data.message;
                toast.error(receiveerror);
                seterror(receiveerror);
            }
        }
    });

    const cancelHandler = (e) => {
        e.preventDefault();
        setBtnhidden(false);
    };

    const filevalidate = (e) => {
        e.preventDefault();
        if (!e.target.files[0]) {
            return;
        }
        setFile(e.target.files[0]);
    };

   

    

    
   

    return (
        <div>
            <div className="flex overflow-hidden ">
                <ToastContainer />
              
                <div className='md:col-span-2 w-screen ml-12 px-4'>
                    <section className="max-w-4xl p-6 mx-auto bg-indigo-600 rounded-md shadow-md dark:bg-gray-800 mt-20">
                        <h1 className="text-xl font-bold text-white capitalize dark:text-white">Edit Product</h1>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                                {/* Product Name */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="productname">Product Name <span className='text-red-400 text-xl '>*</span></label>
                                    <input id="productname" value={values.product_name} onChange={handleChange} onBlur={handleBlur} name="product_name" type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    {errors.product_name && touched.product_name ? (<p className="text-red-500">{errors.product_name}</p>) : null}
                                </div>

                                {/* Short Title */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="shorttitle">Short Title</label>
                                    <input id="shorttitle" value={values.title} onChange={handleChange} onBlur={handleBlur} type="text" name="title" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    {errors.title && touched.title ? (<p className="text-red-500">{errors.title}</p>) : null}
                                </div>

                                {/* Regular Price */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="regularprice">Regular Price <span className='text-red-400 text-xl '>*</span></label>
                                    <input id="regularprice" value={values.regular_price} onChange={handleChange} onBlur={handleBlur} type="number" name="regular_price" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    {errors.regular_price && touched.regular_price ? (<p className="text-red-500">{errors.regular_price}</p>) : null}
                                </div>

                                {/* Sales Price */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="salesprice">Sales Price <span className='text-red-400 text-xl '>*</span></label>
                                    <input id="salesprice" value={values.sales_price} onChange={handleChange} onBlur={handleBlur} type="number" name="sales_price" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    {errors.sales_price && touched.sales_price ? (<p className="text-red-500">{errors.sales_price}</p>) : null}
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="stock">Stock <span className='text-red-400 text-xl '>*</span></label>
                                    <input id="stock" value={values.stock} onChange={handleChange} onBlur={handleBlur} type="number" name="stock" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    {errors.stock && touched.stock ? (<p className="text-red-500">{errors.stock}</p>) : null}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="category">Category <span className='text-red-400 text-xl '>*</span></label>
                                    <input id="category" value={values.category} onChange={handleChange} onBlur={handleBlur} type="text" name="category" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                    {errors.category && touched.category ? (<p className="text-red-500">{errors.category}</p>) : null}
                                </div>

                                {/* Visibility */}
                                <div>
                                    <label className="text-white dark:text-gray-200" htmlFor="visibility">Visibility</label>
                                    <select id="visibility" value={values.visibility} onChange={handleChange} name="visibility" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                                        <option value="hidden">Hidden</option>
                                        <option value="visible">Visible</option>
                                    </select>
                                    {errors.visibility && touched.visibility ? (<p className="text-red-500">{errors.visibility}</p>) : null}
                                </div>

                                {/* Warranty - Year */}
                                {btnhidden ? (
                                    <>
                                        <div>
                                            <label className="text-white dark:text-gray-200" htmlFor="warrentyyear">Warranty Year</label>
                                            <input id="warrentyyear" value={values.warrenty_year} onChange={handleChange} type="number" name="warrenty_year" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                            {errors.warrenty_year && touched.warrenty_year ? (<p className="text-red-500">{errors.warrenty_year}</p>) : null}
                                        </div>

                                        {/* Warranty - Month */}
                                        <div>
                                            <label className="text-white dark:text-gray-200" htmlFor="warrentymonth">Warranty Month</label>
                                            <input id="warrentymonth" value={values.warrenty_month} onChange={handleChange} type="number" name="warrenty_month" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" />
                                            {errors.warrenty_month && touched.warrenty_month ? (<p className="text-red-500">{errors.warrenty_month}</p>) : null}
                                        </div>
                                    </>
                                ) : null}

                                {/* Image */}
                                <div>
                                    <label className="block text-sm font-medium text-white">Image</label>
                                    <div className="relative w-full flex justify-center rounded-md mt-1 border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                                        <div className="space-y-1 text-center">
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                    <span className='px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300'>Upload a file</span>
                                                    <input id="file-upload" name="image" onChange={filevalidate} type="file" className="sr-only" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                  
                                    <div className="mt-3">
                                        <img src={`http://localhost:5000/${data.image}`} alt="product" className="w-20 h-20" />
                                    </div>
                                    {errors.image && touched.image ? (<p className="text-red-500">{errors.image}</p>) : null}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                {btnhidden ? (
                                    <button onClick={cancelHandler} className="relative px-5 py-2 font-medium text-white group mr-5">
                                        Cancel Warranty
                                    </button>
                                ) : (
                                    <button onClick={btnHandler} className="relative px-5 py-2 font-medium text-white group mr-5">
                                        Add Warranty
                                    </button>
                                )}

                                <button type="submit" className="px-5 py-2 font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Save Product</button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
