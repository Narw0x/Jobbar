import { useState } from "react";
import axios from "axios";
import { useAuth } from "../store/AuthContext";

export default function UserProfile() {
    const [userItems, setUserItems] = useState('about');
    const {authState} = useAuth();

    axios.post(`http://localhost:4000/api/user/profile`, {
        id: authState.userId, 
    }, {
        headers: {
            authorization: `Bearer ${authState.token}`
        }
    })
    .then((response) => {
        const data = response.data;
        const UserName = document.getElementById('UserName');
        UserName.innerHTML = data.user.firstName + " " + data.user.lastName;
        
    })
    .catch((error) => {
        console.error('Error fetching profile:', error);
    });

    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full max-h-[250px]" src="/default_bg.png" alt="" />
                </div>
                <div className="flex items-center">
                    <div className="w-40 h-40 border border-custom_gray rounded-lg mx-8">
                        <img className="object-cover" src="/fabko.jpg" alt="" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h2 className="text-lg font-semibold" id="UserName">User_name</h2>
                        <p className="text-sm text-gray-500">
                            Field in which the user is situated in
                        </p>
                    </div>
                </div>

                <div className="flex mt-6 space-x-4 text-sm m-4">
                    <button
                        onClick={() => setUserItems('about')}
                        className={`${userItems === 'about' ? 'border-custom_red text-custom_red' : 'text-custom_gray'} hover:text-custom_red hover:border-custom_red border-b-2 pb-1`}
                    >
                    About
                    </button>
                    <button
                        onClick={() => setUserItems('experience')}
                        className={`${userItems === 'experience' ? 'border-custom_red text-custom_red' : 'text-custom_gray'} hover:text-custom_red hover:border-custom_red border-b-2 pb-1`}

                    >
                    Experience
                    </button>
                    <button
                        onClick={() => setUserItems('education')}
                        className={`${userItems === 'education' ? 'border-custom_red text-custom_red' : 'text-custom_gray'} hover:text-custom_red hover:border-custom_red border-b-2 pb-1`}
                    >
                    Contact
                    </button>
                </div>
            </div>
            <div>
                {userItems === 'about' && 
                    <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg font-semibold">About</h2>
                        <p className="text-sm text-gray-500">
                            A little bit about the user
                        </p>
                    </div>
                }
                {userItems === 'experience' && 
                    <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg font-semibold">Experience</h2>
                        <p className="text-sm text-gray-500">
                            The user's experience
                        </p>
                    </div>
                }
                {userItems === 'education' && 
                    <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg font-semibold">Contact</h2>
                        <p className="text-sm text-gray-500">
                            The user's contact information
                        </p>
                    </div>
                }

            </div>
        </section>
    )
}