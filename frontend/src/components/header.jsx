import axios from "axios";


import Button from "./button";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const path_logo = "/jobbar_logo.svg";

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);


    function handleClick() {

        axios.post('http://localhost:4000/api/profile/logout', {}, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            }
        })
        .then((response) => {
            console.log('Logout successful:', response.data);
            dispatch(logout());
        })
        .catch((error) => {
            console.error('Logout failed:', error.response || error.message); 
        });

        navigate('/');
    }

    return (
        <header className="flex flex-col bg-white w-[100%]">
            <div className="flex max-w-[1440px] w-[70%] m-auto mt-2 mb-2 gap-4 justify-between">
                <div className="">
                    <NavLink to="/" end>
                        <img className="max-w-40 max-h-40 object-contain cursor-pointer" src={path_logo} alt="" />
                    </NavLink>
                </div>
                <div className="flex justify-center gap-4 items-center">
                    <div className="flex gap-4 text-custom_gray">
                        <NavLink
                            to="/"
                            end
                            className={({isActive}) => isActive ? "flex items-center gap-1 cursor-pointer text-custom_red": "flex items-center gap-1 cursor-pointer hover:text-custom_red transition-colors duration-300"}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                            >
                                <path d="M14 14L16.5 16.5" stroke="currentColor"/>
                                <path d="M16.4333 18.5252C15.8556 17.9475 15.8556 17.0109 16.4333 16.4333C17.0109 15.8556 17.9475 15.8556 18.5252 16.4333L21.5667 19.4748C22.1444 20.0525 22.1444 20.9891 21.5667 21.5667C20.9891 22.1444 20.0525 22.1444 19.4748 21.5667L16.4333 18.5252Z" stroke="currentColor"/>
                                <path d="M16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9Z" stroke="currentColor"/>
                            </svg>
                            Search Jobs
                        </NavLink>

                        <NavLink
                            to="/about"
                            end
                            className={({isActive}) => isActive ? "cursor-pointer text-custom_red": "cursor-pointer hover:text-custom_red transition-colors duration-300"}
                            >
                            About us
                        </NavLink>
                    </div>
                    <div className="flex gap-4">
                        {authState.token ? (
                            <div className="flex gap-4">
                                <Button onClick={handleClick} style="gray-default">Logout</Button>
                                <NavLink
                                    to={`/profile/${authState.user._id}`}
                                    className={({isActive}) => isActive ? "flex items-center gap-1 cursor-pointer text-custom_red": "flex items-center gap-1 cursor-pointer hover:text-custom_red transition-colors duration-300"}
                                >
                                    <div className="flex ">
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="currentColor" />
                                            <path d="M15 34C19.6634 29.1156 28.2864 28.8856 33 34M28.9902 19C28.9902 21.7614 26.7484 24 23.983 24C21.2178 24 18.9759 21.7614 18.9759 19C18.9759 16.2386 21.2178 14 23.983 14C26.7484 14 28.9902 16.2386 28.9902 19Z" stroke="currentColor"/>
                                        </svg>
                                        <p id="profileName" className="items-center justify-center m-auto">
                                            {authState.user?.firstName || authState.user?.companyName}
                                        </p>
                                    </div>
                                    
                                </NavLink>
                            </div>
                        ) : (
                            <>
                                <NavLink
                                    to="/login/user"
                                    >
                                    <Button style="gray-hover">Login</Button>
                                </NavLink>
                                <NavLink 
                                    to="/register/user"
                                    >
                                    <Button style="gray-default">Register</Button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border border-custom_gray"/>
        </header>
    )

}