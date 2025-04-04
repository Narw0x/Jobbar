import axios from "axios";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from "./button";

const path_logo = "/jobbar_logo.svg";

export default function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
    const authState = useSelector((state) => state.auth);

    function handleClick() {
        axios.post('https://jobbar-5m8u.onrender.com/api/profile/logout', {}, {
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


    const memorizedState = useMemo(() => authState, [authState]);

    return (
      <header className="flex flex-col bg-white w-full">
        <div className="flex flex-col md:flex-row max-w-[1440px] w-[90%] md:w-[70%] m-auto mt-2 mb-2 gap-4 ">
          <div className="flex justify-between items-center">
            <NavLink to="/" end>
              <img className="max-w-40 max-h-40 object-contain cursor-pointer" src={path_logo} alt="" />
            </NavLink>
            <button 
              className="md:hidden text-custom_gray hover:text-custom_red transition-all duration-300 ease-in-out border border-custom_gray rounded p-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          <nav className={`${ isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row  md:justify-end justify-center md:items-center flex-grow gap-4 transition-all duration-300 ease-in-out`}>
            <div className="flex flex-col md:flex-row md:justify-end justify-center text-center gap-4 text-custom_gray transition-all duration-300 ease-in-out">
              {memorizedState.token && memorizedState.user.firstName && (
                <NavLink
                  to="/job/search"
                  end
                  className={({isActive}) => `flex items-center justify-center gap-1 cursor-pointer ${isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'}`}
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
              )}
              {memorizedState.token && memorizedState.user.companyName && (
                <NavLink
                  to="/job/manage"
                  end
                  className={({isActive}) => `flex items-center justify-center gap-1 cursor-pointer ${isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-settings my-auto"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Manage Jobs
                </NavLink>
              )}
              {!memorizedState.token && (
               <NavLink
               to="/search"
               end
               className={({isActive}) => `flex items-center justify-center gap-1 cursor-pointer ${isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'}`}
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
               Search
             </NavLink>
              )}
              <NavLink
                to="/about"
                end
                className={({isActive}) => 
                  `cursor-pointer ${
                    isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'
                  }`
                }
              >
                About us
              </NavLink>
            </div>
            <div className="flex flex-row justify-center gap-4 transition-all duration-300 ease-in-out" >
              {memorizedState.token ? (
                <div className="relative group mr-2 md:mr-0">
                  <NavLink
                    to={`/profile/${memorizedState.user._id}`}
                    className={({isActive}) => `flex items-center gap-1 cursor-pointer ${isActive ? 'text-custom_red' : 'hover:text-custom_red transition-colors duration-300'}`}
                  >
                    <div className="flex items-center justify-center flex-row-reverse max-w-48 min-w-32">
                      <p className="truncate ml-2">
                        {memorizedState.user?.firstName || memorizedState.user?.companyName}
                      </p>
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        strokeWidth="1.25"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                      >
                        <path
                          d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
                          stroke="currentColor"
                        />
                        <path
                          d="M15 34C19.6634 29.1156 28.2864 28.8856 33 34M28.9902 19C28.9902 21.7614 26.7484 24 23.983 24C21.2178 24 18.9759 21.7614 18.9759 19C18.9759 16.2386 21.2178 14 23.983 14C26.7484 14 28.9902 16.2386 28.9902 19Z"
                          stroke="currentColor"
                        />
                      </svg>
                    </div>
                  </NavLink>
                  {/* Dropdown menu */}
                  <ul className="absolute mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <li>
                      <NavLink
                        to={`/profile/${memorizedState.user._id}`}
                        className="flex gap-2 w-full text-left px-4 py-2 text-gray-800 rounded-t-md hover:bg-gray-100 hover:text-custom_red"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 180 180" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="15.75" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="my-auto"
                        >
                          <path d="M49.3318 116.112C38.721 122.43 10.9002 135.331 27.845 151.475C36.1223 159.36 45.3412 165 56.9315 165H123.068C134.659 165 143.878 159.36 152.155 151.475C169.1 135.331 141.279 122.43 130.668 116.112C105.786 101.296 74.2139 101.296 49.3318 116.112Z"/>
                          <path d="M123.75 48.75C123.75 67.3896 108.64 82.5 90 82.5C71.3604 82.5 56.25 67.3896 56.25 48.75C56.25 30.1104 71.3604 15 90 15C108.64 15 123.75 30.1104 123.75 48.75Z"/>
                        </svg>
                        Profile
                      </NavLink>
                    </li>
                    {memorizedState.user.companyName && (
                      <li>
                        <NavLink
                          to="/profile/favorite"
                          className="flex gap-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-custom_red"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="my-auto">
                            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                          </svg>
                          Favorite Users
                        </NavLink>
                      </li>
                    )}
                    <li>
                      <NavLink
                        to="/profile/edit"
                        className="flex gap-2 w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-custom_red"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="my-auto"
                        >
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Settings
                      </NavLink>
                    </li>
                    <li>
                        <button
                        onClick={handleClick}
                        className="flex gap-2 w-full text-left px-4 py-2 text-gray-800 rounded-b-md hover:bg-gray-100 hover:text-custom_red m-auto align-middle"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-log-out my-auto"
                                >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </li>
                  </ul>
                </div>
              ) : (
                  <>
                      <NavLink
                          to="/login"
                          >
                          <Button btnStyle={"gray-hover"}>Login</Button>
                      </NavLink>
                      <NavLink 
                          to="/register/user"
                          >
                          <Button btnStyle="gray-default">Register</Button>
                      </NavLink>
                  </>
              )}
            </div>
          </nav>
        </div>
        <hr className="border border-custom_gray"/>
      </header>
    )

}