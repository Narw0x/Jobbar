import { NavLink } from "react-router-dom";

import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router";
import axios from "axios";


const path_logo = "/jobbar_logo.svg";




export default function AdminHeader() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authState = useSelector((state) => state.auth);

    function handleClick() {
        axios.post('http://localhost:4000/api/profile/logout', {}, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            }
        })
        .then((response) => {
            dispatch(logout());
        })
        .catch((error) => {
            console.error('Logout failed:', error.response || error.message); 
        });
        navigate('/');
    }

    return (
        <header className="flex flex-col bg-white w-[100%]">
            <div className="flex container mx-auto justify-between items-center p-4">
                <div>
                    <img className="max-w-40 max-h-40 object-contain cursor-pointer" src={path_logo} alt="" />
                </div>
                <div className="flex items-center">
                    <ul className="flex space-x-8 items-center my-auto">
                        <li className="items-center">
                            <NavLink 
                                to="/admin/dashboard" 
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
                                to="/admin/users" 
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
                                to="/admin/jobs" 
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
                                to="/admin/reports" 
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
