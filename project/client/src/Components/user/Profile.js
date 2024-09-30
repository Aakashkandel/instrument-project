import React, { useEffect, useState } from 'react';
import axios from '../api/api'; 
import { toast, ToastContainer } from 'react-toastify';

export default function Profile() {
    const [profile, setProfile] = useState([]);
    const [isClick, setIsClick] = useState(false);
    
    const ClickHandler = () => {
        setIsClick(!isClick);
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get('/userprofileapi', {
                    headers: {
                        'x-access-token': localStorage.getItem('token')
                    }
                });
                setProfile(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        getProfile();
    }, [isClick]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const profileimage = document.getElementsByName('profileimage')[0].files[0];

        if (!profileimage) {
            console.error('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('profileimage', profileimage);

        try {
            const response = await axios.post('/userprofileapiimage', formData, {
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsClick(!isClick);
            toast.success(response.data.message);
        } catch (err) {
            console.error(err);
        }
    }

    const passwordChangeHandler = async (e) => {
        e.preventDefault();

        const oldpassword = e.target.oldpassword.value;
        const newpassword = e.target.newpassword.value;
        const confirmpassword = e.target.confirmpassword.value;

        if (newpassword !== confirmpassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (newpassword.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        try {
            const response = await axios.post('/profilepasswordchangeapi', {
                oldpassword,
                newpassword
            }, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            });
            toast.success(response.data.message);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="bg-gray-300 min-h-screen flex flex-col items-center">
            <ToastContainer />
            <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 border-4 border-gray-700 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={`http://localhost:5000/${profile.profileimage}`} alt="" />
                </div>
                <h2 className="font-bold text-2xl text-gray-700 text-center my-2">{profile.name}</h2>

                {isClick ? (
                    <div className="w-9/12 my-5 text-center">
                        <form onSubmit={submitHandler} encType="multipart/form-data">
                            <input type="file" name="profileimage" className="text-white bg-purple-700 mx-4 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2" />
                            <button type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5">
                                Upload Photo
                            </button>
                        </form>
                        <button type="button" onClick={ClickHandler} className="text-gray-700 bg-gray-200 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mx-4 mb-2">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="w-9/12 my-5 text-center">
                        <button type="button" onClick={ClickHandler} className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5">
                            {profile.profileimage ? 'Change Photo' : 'Add Photo'}
                        </button>
                    </div>
                )}
            </div>

            <div className="font-bold text-white text-gray-800 bg-gray-800 w-9/12 my-7 py-1 px-2 rounded">
                User Info
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-9/12 m-auto mb-5">
                <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                    <div className="font-bold text-gray-800">Email:</div>
                    <input type="text" className="font-semibold text-gray-700 w-full text-end bg-transparent outline-none" value={profile.email} readOnly />
                </div>
                <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                    <div className="font-bold text-gray-800">Phone:</div>
                    <input type="text" className="font-semibold text-gray-700 w-full text-end bg-transparent outline-none" value={profile.phone} readOnly />
                </div>
                <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                    <div className="font-bold text-gray-800">Address:</div>
                    <h2 className="font-semibold text-gray-700 w-full text-end bg-transparent outline-none">{`${profile.address?.city_area}, ${profile.address?.district}, ${profile.address?.state}`}</h2>
                </div>
                <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                    <div className="font-bold text-gray-800">Gender:</div>
                    <input type="text" className="font-semibold text-gray-700 w-full text-end bg-transparent outline-none" value={profile.gender} readOnly />
                </div>
                <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                    <div className="font-bold text-gray-800">Registration:</div>
                    <input type="text" className="font-semibold text-gray-700 w-full text-end bg-transparent outline-none" value={profile.date} readOnly />
                </div>
            </div>

            <div className="font-bold text-gray-800 bg-gray-800 w-9/12 my-7 py-1 px-2 rounded">Change Password</div>
            <form onSubmit={passwordChangeHandler}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4  m-auto">
                    <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                        <div className="font-bold text-gray-800 w-9/12 ">Old Password:</div>
                        <input type="text" name="oldpassword" className="font-semibold text-gray-700 w-full text-end outline-none" />
                    </div>
                    <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                        <div className="font-bold text-gray-800 w-9/12 ">New Password:</div>
                        <input type="text" name="newpassword" className="font-semibold text-gray-700 w-full text-end outline-none" />
                    </div>
                    <div className="flex justify-between bg-gray-200 rounded-xl p-2">
                        <div className="font-bold text-gray-800 w-9/12">Confirm Password:</div>
                        <input type="text" name="confirmpassword" className="font-semibold text-gray-700 w-full text-end outline-none" />
                    </div>
                    <div>
                        <button type="submit" className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5">
                            Change Password
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
