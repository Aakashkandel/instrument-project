import React, { useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from '../state/action/SessionData';
import { useDispatch, useSelector } from 'react-redux';

const UserNavbar = () => {
    const dispatchh = useDispatch();
    const navigate = useNavigate();
    const element = useRef(null);

    const smoothTransition = (element, width, duration) => {
        const initialWidth = element.style.width || "auto";
        element.style.transition = `width ${duration}ms ease-in-out`;
        element.style.width = width;
        setTimeout(() => {

        }, duration);
    };

    const logouthandler = () => {
        sessionStorage.removeItem('reduxState');
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            sessionStorage.removeItem(key);
        }

        for (let i = 0; i < localStorage.length; i++) {
            const keyy = localStorage.key(i);
            localStorage.removeItem(keyy);
        }
        dispatchh(userLogout());
        navigate('/')
    }

    const sessiondata = useSelector(state => state.authenticate);
    let slug = ""; // Initialize slug variable outside the conditional
    const name = sessiondata.userInfo.name;

    if (name != null) {
        slug = name.replace(" ", "-");
    }

    return (
        <div
            className="bg-gray-900 w-14 h-screen py-10 overflow-hidden fixed z-10"
            onMouseOver={() => smoothTransition(element.current, '360px', 300)}
            onMouseOut={() => smoothTransition(element.current, '50px', 300)}
            onFocus={() => smoothTransition(element.current, '360px', 300)}
            onBlur={() => smoothTransition(element.current, '50px', 300)}
            ref={element}
        >
            <div>
                <ul className="list-none">
                    <li>
                        <Link to="/users/" className="text-xl font-bold flex-1 text-white hover:bg-white hover:text-black py-2 my-2 flex">
                            <div>
                                <i className="fas fa-home text-2xl px-4"></i>
                            </div>
                            <div className="cursor-pointer w-full">
                                Home
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="shop" className="text-xl font-bold flex-1 text-white hover:bg-white hover:text-black py-2 my-2 flex">
                            <div>
                                <i className="fas fa-store text-2xl px-4"></i>
                            </div>
                            <div className="cursor-pointer w-full">
                                Shop
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="addtocart" className="text-xl font-bold flex-1 text-white hover:bg-white hover:text-black py-2 my-2 flex">
                            <div>
                                <i className="fas fa-shopping-cart text-2xl px-4"></i>
                            </div>
                            <div className="cursor-pointer w-full">
                                Cart
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="order" className="text-xl font-bold flex-1 text-white hover:bg-white hover:text-black py-2 my-2 flex">
                            <div>
                                <i className="fas fa-box text-2xl px-4"></i>
                            </div>
                            <div className="cursor-pointer w-full">
                                Order
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="profile" className="text-xl font-bold flex-1 text-white hover:bg-white hover:text-black py-2 my-2 flex">
                            <div>
                                <i className="fas fa-user text-2xl px-4"></i>
                            </div>
                            <div className="cursor-pointer w-full">
                                Profile
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="" className="text-xl font-bold flex-1 text-white hover:bg-white hover:text-black py-2 my-2 flex">
                            <div>
                                <i className="fas fa-sign-out-alt text-2xl px-4"></i>
                            </div>
                            <div className="cursor-pointer w-full">
                                <button className="text-xl mx-3 font-bold" onClick={logouthandler}>Logout</button>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
export default UserNavbar;
