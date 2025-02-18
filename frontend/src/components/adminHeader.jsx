import { NavLink } from "react-router-dom";

import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { adminLogout } from "../store/slices/adminSlice";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const path_logo = "/jobbar_logo.svg";




export default function AdminHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const adminState = useSelector((state) => state.admin);

    function handleClick() {
        axios.post('https://jobbar-5m8u.onrender.com/api/admin/logout', {}, {
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`,
            }
        })
        .then((response) => {
            if (response.data.message === 'Logged out successfully'){
                dispatch(adminLogout());
            }
        })
        .catch((error) => {
            console.error('Logout failed:', error.response || error.message); 
        });
        navigate('/');
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <header className="flex flex-col bg-white w-[100%]">
            <div className="flex md:flex-row flex-col container mx-auto justify-between items-center p-4 gap-4 md:gap-0">
                <div className="flex items-center justify-between w-full">
                    <NavLink 
                        to={'/xyz/dashboard'}
                        >
                        <img className="max-w-40 max-h-40 object-contain cursor-pointer" src={path_logo} alt="" />
                    </NavLink>
                    <button 
                        className="md:hidden text-custom_gray hover:text-custom_red transition-all duration-300 ease-in-out border border-custom_gray rounded p-2"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:flex-row md:items-center  w-full justify-end`}>
                    <ul className="flex space-x-4 lg:space-x-8 items-center my-auto justify-between md:justify-end">
                        <li className="items-center">
                            <NavLink 
                                to="/xyz/dashboard" 
                                className={({ isActive }) =>
                                    `flex items-center gap-1 cursor-pointer ${
                                    isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/xyz/users" 
                                className={({ isActive }) =>
                                    `flex items-center gap-1 cursor-pointer ${
                                    isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'
                                    }`
                                }
                            >
                                Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/xyz/jobs" 
                                className={({ isActive }) =>
                                    `flex items-center gap-1 cursor-pointer ${
                                    isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'
                                    }`
                                }
                            >
                                Jobs
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/xyz/reports" 
                                className={({ isActive }) =>
                                    `flex items-center gap-1 cursor-pointer ${
                                    isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'
                                    }`
                                }
                            >
                                Reports
                            </NavLink>
                        </li>
                        <li>
                            <Button
                                style="red-hover"
                                onClick={handleClick}
                            >
                                Log out
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>

            
            <hr className=" border-custom_gray"/>
        </header>
    )
}
