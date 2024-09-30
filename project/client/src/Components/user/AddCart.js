import React, { useEffect, useState } from 'react';
import axios from '../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, productFetch } from '../features/Addtocart';
import '../Assets/css/cartloader.css';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

export default function AddCart() {
    const [count, setCount] = useState(null);
    const [price, setPrice] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { success, cartItems, message } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(productFetch());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            dispatch(productFetch());
        }
    }, [message]);

    useEffect(() => {
        if (success === "completed") {
            let total = 0;
            let counter = 0;
            cartItems.allcart.forEach(cart => {
                total += cart.quantity * cart.product.price.sales_price;
                counter++;
            });
            setPrice(total);
            setCount(counter);
        }
    }, [success, cartItems]);

    const findCartId = (id) => {
        dispatch(deleteCart(id));
        toast.success("Item removed from cart");
    }

    const addQuantity = async (id) => {
        const q = cartItems.allcart.find(cart => cart._id === id);
        let increaseQuantity = q.quantity + 1;

        const response = await axios.put(`/increasequantity/${id}`, {
            cart_id: id,
            quantity: increaseQuantity,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem('token'),
            },
        });
        toast.success(response.data.message);
    }

    const decreaseQuantity = async (id) => {
        const q = cartItems.allcart.find(cart => cart._id === id);
        if (q.quantity > 1) {
            let decreaseQuantity = q.quantity - 1;

            await axios.put(`/decreasequantity/${id}`, {
                cart_id: id,
                quantity: decreaseQuantity,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token'),
                },
            });
        } else {
            toast.error("Quantity cannot be less than 1");
        }
    }

    const handleCheckout = () => {
        if (cartItems.length !== 0) {
            navigate('../checkout');
        } else {
            toast.error("Sorry! Cart is empty");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <ToastContainer />
            <section className="py-8 md:py-16">
                <div className="mx-auto max-w-screen-xl px-4">
                    <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">Shopping Cart</h2>

                    <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                        <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                            <div className="space-y-6">
                                {success === "completed" ? (
                                    <div className="max-h-80 overflow-y-auto">
                                        {cartItems.allcart.map((cart, index) => (
                                            <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                                <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                                                    <img className="h-20 w-20" src={`http://localhost:5000/${cart.product.image}`} alt={cart.product.title} />
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <button onClick={() => decreaseQuantity(cart._id)} className="h-8 w-8 bg-gray-200 hover:bg-gray-300 rounded-md">-</button>
                                                            <input type="text" className="w-10 text-center" value={cart.quantity} readOnly />
                                                            <button onClick={() => addQuantity(cart._id)} className="h-8 w-8 bg-gray-200 hover:bg-gray-300 rounded-md">+</button>
                                                        </div>
                                                        <div className="text-end w-32">
                                                            <p className="text-base font-bold text-gray-900">Rs {cart.product.price.sales_price}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <a className="text-base font-medium text-gray-900 hover:underline">{cart.product.title}</a>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-sm font-medium text-gray-500">Available Stock: <span className="text-green-500">{cart.product.stock}</span></div>
                                                            <button onClick={() => findCartId(cart._id)} className="text-sm font-medium text-red-600 hover:underline">Remove</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                                        <div className="FB-Loading-Card">
                                            <div><div></div><div></div><div></div></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                                <p className="text-xl font-semibold text-gray-900">Order Summary</p>
                                <div className="space-y-4">
                                    <dl className="flex items-center justify-between">
                                        <dt className="text-base font-normal text-gray-500">Total items</dt>
                                        <dd className="text-base font-medium text-green-600">{count} items</dd>
                                    </dl>
                                    <dl className="flex items-center justify-between border-t border-gray-200 pt-2">
                                        <dt className="text-base font-bold text-gray-900">Total</dt>
                                        <dd className="text-base font-bold text-gray-900">Rs {price}</dd>
                                    </dl>
                                </div>
                                <button onClick={handleCheckout} className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Proceed to Checkout</button>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-sm font-normal text-gray-500"> or </span>
                                    <Link to=".." className="text-sm font-medium text-blue-600 underline">Continue Shopping</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
