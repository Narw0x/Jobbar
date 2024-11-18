import { useState } from "react";
import axios from "axios";
import { useAuth } from "../store/AuthContext";

export default function CompanyProfile() {
    const [userItems, setUserItems] = useState('about');
    const {authState} = useAuth();

    axios.post(`http://localhost:4000/api/company/profile`, {
        id: authState.userId, 
    }, {
        headers: {
            authorization: `Bearer ${authState.token}`
        }
    })
    .then((response) => {
        const data = response.data;
        const ComapanyName = document.getElementById('ComapanyName');
        ComapanyName.innerHTML = data.company.companyName;
        console.log(data);
        
        
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
                        <h2 className="text-lg font-semibold" id="ComapanyName">User_name</h2>
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
                        onClick={() => setUserItems('jobs')}
                        className={`${userItems === 'jobs' ? 'border-custom_red text-custom_red' : 'text-custom_gray'} hover:text-custom_red hover:border-custom_red border-b-2 pb-1`}

                    >
                    Jobs
                    </button>
                    <button
                        onClick={() => setUserItems('contact')}
                        className={`${userItems === 'contact' ? 'border-custom_red text-custom_red' : 'text-custom_gray'} hover:text-custom_red hover:border-custom_red border-b-2 pb-1`}
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
                            A little bit about the company
                        </p>
                    </div>
                }
                {userItems === 'jobs' && 
                    <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg font-semibold">Jobs</h2>
                        <p className="text-sm text-gray-500">
                            The company's jobs
                        </p>
                    </div>
                }
                {userItems === 'contact' && 
                    <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg font-semibold">Contact</h2>
                        <p className="text-sm text-gray-500">
                            The company's contact information
                        </p>
                    </div>
                }

            </div>
        </section>
    )
}