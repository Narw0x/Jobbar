import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toast } from 'primereact/toast';

import Button from "../components/button";


export default function ProfilePage() {
    const toast = useRef(null);
    const { id } = useParams();
    const authState = useSelector((state) => state.auth);
    const [profileData, setProfileData] = useState(null); // State to store profile data
    const [isCurrentUser, setIsCurrentUser] = useState(false); // State to check if viewing own profile
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const location = useLocation();
    const [messageState, setMessageState] = useState(location.state || null);

    useEffect(() => {
        if (location.state) {
            setMessageState(location.state);
            // Clear the location state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        if (messageState) {
            const timer = setTimeout(() => {
                switch (messageState.type) {
                    case 'success':
                        toast.current?.show({severity: 'success', summary: 'Success', detail: messageState.message, life: 2000});
                        break;
                    case 'error':
                        toast.current?.show({severity: 'error', summary: 'Error', detail: messageState.message, life: 2000});
                        break;
                    default:
                        break;
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messageState]);

    useEffect(() => {
        if (authState.user._id !== id) {
            setIsCurrentUser(false); // Viewing someone else's profile
            axios.get(`http://localhost:4000/api/profile/${id}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`, // Include the token in the Authorization header
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setProfileData(response.data.payload.user); // Update state with fetched user data
                    }
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                    setError('An error occurred while fetching the profile. Please try again.');
                });
        } else {
            setIsCurrentUser(true); // Viewing own profile
            setProfileData(authState.user); // Use current user's data
        }
    }, [id, authState.user, authState.token]);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
    }

    if (!profileData) {
        return <p>Loading...</p>;
    }

    if(error) {
        return (
            <section className="bg-custom_bg_gray p-16">
                <div className="text-custom_red border border-custom_red max-w-[1000px] flex justify-center m-auto text-center bg-red-100 rounded-lg p-4">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast}/>
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full max-h-[250px]" src={`http://localhost:4000/public/background/${profileData?.bgImage}`} alt="" />
                </div>
                <div className="flex items-center">
                    <div className="w-60 h-60 rounded  m-8">
                        <img className={`object-cover rounded-2xl p-2 ${profileData?.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`http://localhost:4000/public/avatar/${profileData?.avatar}`} alt="" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h2 className="text-lg text-custom_gray font-semibold" id="UserName">
                            {profileData?.firstName || profileData?.companyName}
                        </h2>
                        {profileData.address && <p className="text-sm text-gray-500">
                            {profileData.address}
                        </p>}
                        
                    </div>

                    <div className="m-4 flex gap-4">
                        <div className="flex gap-4 text-custom_gray justify-center m-auto">
                            <p>Followers: <span>{profileData?.followers?.length || 0}</span></p>
                            
                        </div>
                        {!isCurrentUser && (
                            !isFollowing ? (<Button
                                style="red-hover"
                                onClick={handleFollow}
                            >
                                Follow
                            </Button>) : (<Button
                                style="red-default"
                                onClick={handleFollow}
                            >
                                Following
                            </Button>)

                        )}
                        {isCurrentUser && (
                            <div className="flex justify-center m-auto">
                                <Link to={`/profile/${authState.user._id}/edit`}>
                                    <img className="rotate-90" src="/settings.svg" alt="" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                {profileData.about && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg text-custom_gray font-semibold">About</h2>
                        <p className="text-sm text-gray-500">{profileData.about}</p>
                    </div>
                )}
                {profileData.experience && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg text-custom_gray font-semibold">Experience</h2>
                        {Array.isArray(profileData.experience) && profileData.experience.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No experience
                            </p>
                        )}
                        {Array.isArray(profileData.experience) && profileData.experience.map((exp) => (
                            <div key={exp._id} className="border-b border-gray-200 py-4">
                                <h3 className="text-md text-custom_gray font-semibold">{exp.position}</h3>
                                <p className="text-sm text-gray-500">{exp.company}</p>
                                <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                                <p className="text-sm text-gray-500">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                )}
                {profileData.education && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg text-custom_gray font-semibold">Education</h2>
                        <p className="text-sm text-gray-500">
                            {Array.isArray(profileData.education) && profileData.education.length === 0 && "No education"}
                        </p>
                    </div>
                )}
                {profileData.jobOffers && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg text-custom_gray font-semibold">Job Offers</h2>
                        <p className="text-sm text-gray-500">
                            {Array.isArray(profileData.jobOffers) && profileData.jobOffers.length === 0 && "No job offers"}
                        </p>
                    </div>
                )}
                {(profileData.phoneNumber || profileData.email || profileData.website) && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg  text-custom_gray font-semibold">Contact</h2>
                        <div className="text-sm text-gray-500">
                            {profileData.phoneNumber && (
                                <p>Phone number: <span className="text-custom_red">{profileData.phoneNumber}</span></p>
                            )}
                            {profileData.email && (
                                <p>Email: <span className="text-custom_red">{profileData.email}</span></p>
                            )}
                            {profileData.website && (
                                <p>Website: <span className="text-custom_red">{profileData.website}</span></p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
