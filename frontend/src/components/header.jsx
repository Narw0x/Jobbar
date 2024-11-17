import Button from "./button";
import { NavLink } from 'react-router-dom';

const path_logo = "/jobbar_logo.svg";



export default function Header() {
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
                        <NavLink
                            to="/login/user"
                            >
                            <Button type="gray-hover">Login</Button>
                        </NavLink>
                        <NavLink 
                            to="/register/user"
                            >
                            <Button type="gray-default">Register</Button>
                        </NavLink>
                        
                    </div>
                </div>
            </div>
            <hr className="h-1 bg-custom_gray"/>
        </header>
    )

}