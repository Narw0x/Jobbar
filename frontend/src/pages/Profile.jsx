import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../store/slices/authSlice";
import axios from "axios";
import { Toast } from 'primereact/toast';

import Button from "../components/button";
import ErrorPage from "./Error";


export default function ProfilePage() {
    const toast = useRef(null);
    const { id } = useParams();
    const authState = useSelector((state) => state.auth);
    const [profileData, setProfileData] = useState(null); 
    const [jobOffers, setJobOffers] = useState([]);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();



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

    useEffect(() => {
        if (profileData && profileData.jobOffers){
            axios.get(`http://localhost:4000/api/jobs/${profileData._id}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`, // Include the token in the Authorization header
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setJobOffers(response.data.payload.jobs); // Update state with fetched job offers
                }
            })
            .catch((error) => {
                console.error('Error fetching job offers:', error);
                setError('An error occurred while fetching the job offers. Please try again.');
                if(error.response?.statusText === "Unauthorized"){
                    dispatch(logout());
                    navigate('/login', { state: { type: 'error', message: 'You are not authorized to view this page. Please log in.' } });
                }
            });
        }   
    }, [profileData, authState.token]);



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short'
        }).format(date);
    };

    const formatDateBetter = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    };

    

    if(error) {
        return (
            <ErrorPage type="child"/>
        );
    }

    if (!profileData) {
        return <p>Loading...</p>;
    }

    return (
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast}/>
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full max-h-[250px]" src={`http://localhost:4000/public/background/${profileData?.bgImage}`} alt="" />
                </div>
                <div className="flex items-center">
                    <div className="w-60 h-60 rounded  m-8 ">
                        <img className={`w-full h-full object-cover rounded-2xl p-2 ${profileData?.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`http://localhost:4000/public/avatar/${profileData?.avatar}`} alt="" />
                    </div>
                    <div className="flex flex-grow  justify-between">
                        <div className="ml-4 flex-1">
                            <h2 className="text-lg text-custom_gray font-semibold" id="UserName">
                                {profileData?.firstName || profileData?.companyName}
                            </h2>
                            {profileData.address && <p className="text-sm text-gray-500">
                                {profileData.address}
                            </p>}
                            
                        </div>
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
                        {Array.isArray(profileData.experience) && profileData.experience.length === 0 ? (
                            <>
                                <div className="flex justify-between align-middle">
                                    <div>
                                        <h2 className="text-lg text-custom_gray font-semibold">Experience</h2>
                                        <p className="text-sm text-gray-500">
                                            No experience
                                        </p>
                                    </div>
                                    {isCurrentUser && (
                                        <div className="flex justify-end mt-4 mb-0">
                                            <Button style="red-hover" redirectPath="/profile/experience/add">
                                                Add new
                                            </Button>
                                        </div>
                                    )} 
                                </div>
                            </>
                        ) : (
                            <div>
                                <h2 className="text-lg text-custom_gray font-semibold">Experience</h2>
                                {profileData.experience.map((exp, idx) => (
                                    <div key={exp.experienceId} className="border-b border-gray-200 py-4">
                                        <h3 className="text-md text-custom_gray font-semibold">{exp.company}</h3>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-sm text-custom_red">{exp.jobTitle}</p>
                                                <p className="text-sm text-gray-500">{exp.description}</p>
                                            </div>
                                            <div className="flex flex-row justify-end text-end gap-4">
                                                <div className="flex flex-col justify-end text-end">
                                                    <p className="text-sm text-gray-500">{formatDate(exp.date[0])} - {formatDate(exp.date[1])}</p>
                                                    <p className="text-sm text-gray-500">{exp.employmentType}</p>
                                                </div>
                                                {isCurrentUser && (
                                                    <div>
                                                        <Button
                                                            style="red-default"
                                                            redirectPath={`/profile/experience/edit/${exp.experienceId}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isCurrentUser && (
                                    <div className="flex justify-end mt-4 mb-0">
                                        <Button
                                            style="red-hover"
                                            redirectPath="/profile/experience/add"
                                        >
                                            Add new
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {profileData.education && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        {(profileData.education.school.length === 0 && profileData.education.certificate.length === 0 && profileData.education.skill.length === 0) ? (
                            <div className="flex justify-between align-middle">
                                <div>
                                    <h2 className="text-lg text-custom_gray font-semibold">Education</h2>
                                    <p className="text-sm text-gray-500">
                                        No education
                                    </p>
                                </div>
                                {isCurrentUser && (
                                    <div className="flex justify-end mt-4 mb-0">
                                        <Button style="red-hover" redirectPath="/profile/education/add">
                                            Add new
                                        </Button>
                                    </div>
                                )} 
                            </div>
                        ) : (
                            <>
                                
                                <h2 className="text-lg text-custom_gray font-semibold">Education</h2>
                                <div>
                                   {profileData.education.school && profileData.education.school.length > 0 && (<p className="text-sm text-gray-500 mt-4">School</p>) }
                                    {profileData.education.school.map((edu, idx) => (
                                        <div key={edu.educationId} className="border-b border-gray-200">
                                            <div className="flex justify-between my-2">
                                                <div>
                                                    <h3 className="text-md text-custom_gray font-semibold">{edu.schoolName}</h3>
                                                    <p className="text-sm text-custom_red">{formatDate(edu.date[0])} - {formatDate(edu.date[1])}</p>
                                                </div>
                                                {isCurrentUser && (
                                                    <div>
                                                        <Button
                                                            style="red-default"
                                                            redirectPath={`/profile/education/edit/${edu.educationId}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))} 
                                </div>
                                <div>
                                    {profileData.education.certificate && profileData.education.certificate.length > 0 && (<p className="text-sm text-gray-500 mt-4">Certificate</p>) }
                                    {profileData.education.certificate.map((edu, idx) => (
                                        <div key={edu.educationId} className="border-b border-gray-200">
                                            <div className="flex justify-between my-2">
                                                <div>
                                                    <h3 className="text-md text-custom_gray font-semibold">{edu.certificateName}</h3>
                                                    <p className="text-sm text-custom_gray">{edu.company}</p>
                                                    <p className="text-sm text-custom_red">{formatDateBetter(edu.date)}</p>
                                                </div>
                                                {isCurrentUser && (
                                                    <div className=" mt-auto">
                                                        <Button
                                                            style="red-default"
                                                            redirectPath={`/profile/education/edit/${edu.educationId}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))} 
                                </div>
                                <div>
                                    {profileData.education.skill && profileData.education.skill.length > 0 && (<p className="text-sm text-gray-500 mt-4">Skill</p>) }
                                    {profileData.education.skill.map((edu, idx) => (
                                        <div key={edu.educationId} className="border-b border-gray-200">
                                            <div className="flex justify-between my-2">
                                                <div>
                                                    <h3 className="text-md text-custom_gray font-semibold">{edu.skillName}</h3>
                                                    <p className="text-sm text-custom_red">{edu.level}</p>
                                                </div>
                                                {isCurrentUser && (
                                                    <div>
                                                        <Button
                                                            style="red-default"
                                                            redirectPath={`/profile/education/edit/${edu.educationId}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isCurrentUser && (
                                        <div className="flex justify-end mt-4 mb-0">
                                            <Button
                                                style="red-hover"
                                                redirectPath="/profile/education/add"
                                            >
                                                Add new
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                
                                
                            </>
                        )}
                        
                    </div>
                )}
                {profileData.jobOffers && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        {jobOffers.length !== 0  ? (
                            <>
                                <h2 className="text-lg text-custom_gray font-semibold">Job Offers</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                                {jobOffers.map((job, idx) => (
                                    <div key={job._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 ">
                                        <h3 className="text-md text-custom_gray font-semibold text-xl">{job.jobTitle}</h3>
                                        <div className="flex flex-col justify-between">
                                            <div className="flex flex-col items-start space-y-2">
                                                <div className="flex flex-row w-full gap-16 justify-between">
                                                    <p className=" text-custom_gray font-semibold">Salary:</p>
                                                    <p className=" text-custom_red">{job.salary.amount}{job.salary.currency}/<span className="text-sm">Year</span> </p>
                                                </div>
                                                <div className="flex flex-row  w-full justify-between">
                                                    <p className=" text-custom_gray font-semibold">Location:</p>
                                                    <div className="max-w-32">
                                                        <p className=" text-custom_red truncate">{job.address}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row  w-full justify-end">
                                                    <p className="text-sm text-custom_gray">{formatDateBetter(job.date)}</p>
                                                </div>
                                                
                                            </div>
                                            <div className="flex flex-row gap-4 mt-2 justify-end">
                                                
                                                {isCurrentUser && (
                                                    <div className="flex flex-grow">
                                                        <Button
                                                            style="red-default"
                                                            redirectPath={`/profile/job/edit/${job._id}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                )}
                                                <div>
                                                    <Button
                                                        style="red-hover"
                                                        redirectPath={`/job/${job._id}`}
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                ))}
                                
                                </div>
                                {isCurrentUser && (
                                    <div className="flex justify-end mt-4">
                                    <Button
                                        style="red-hover"
                                        redirectPath="/profile/job/add"
                                    >
                                        Add new
                                    </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between align-middle">
                                    <div>
                                        <h2 className="text-lg text-custom_gray font-semibold">Job Offers</h2>
                                        <p className="text-sm text-gray-500">
                                            No job offers
                                        </p>
                                    </div>
                                    {isCurrentUser && (
                                        <div className="flex justify-end mt-4 mb-0">
                                            <Button style="red-hover" redirectPath="/profile/job/add">
                                                Add new
                                            </Button>
                                        </div>
                                    )} 
                                </div>
                            </>
                        )}
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
