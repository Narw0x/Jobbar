import {  useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../store/slices/authSlice";
import axios from "axios";
import { Toast } from 'primereact/toast';
import { tailspin, bouncy } from 'ldrs'

import Button from "../components/button";


export default function AdminProfilePage() {
    const toast = useRef(null);
    const modal = useRef();
    const { userId } = useParams();
    const adminState = useSelector((state) => state.admin);
    const [profileData, setProfileData] = useState(null); 
    const [jobOffers, setJobOffers] = useState([]);
    tailspin.register();
    bouncy.register();

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
            axios.get(`https://jobbar-5m8u.onrender.com/api/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`, // Include the token in the Authorization header
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setProfileData(response.data.payload.user); // Update state with fetched user data
                    }
                })
                .catch((error) => {
                    setMessageState({type: 'error', message: 'An error occurred while fetching the user data. Please try again.'});
                });
        }, [userId, adminState.adminToken]);

    useEffect(() => {
        if (profileData && profileData.jobOffers){
            axios.get(`https://jobbar-5m8u.onrender.com/api/jobs/${profileData._id}`, {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`, // Include the token in the Authorization header
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setJobOffers(response.data.payload.jobs); // Update state with fetched job offers
                }
            })
            .catch((error) => {
                setMessageState({type: 'error', message: 'An error occurred while fetching the job offers. Please try again.'});
                if(error.response?.statusText === "Unauthorized"){
                    dispatch(logout());
                    navigate('/login', { state: { type: 'error', message: 'You are not authorized to view this page. Please log in.' } });
                }
            });
        }   
    }, [profileData, adminState.adminToken]);



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

    useEffect(() => {
        document.title = "Profile | Jobbar";
    }, []);


    if (!profileData) {
        return (
            <section className="bg-custom_bg_gray py-8">
                <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white flex justify-center p-8">
                    <l-tailspin size="40"stroke="5"speed="0.9" color='gray' ></l-tailspin>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast}/>
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full max-h-[250px] rounded-t" src={`https://jobbar-5m8u.onrender.com/public/background/${profileData?.bgImage}`} alt="" />
                </div>
                <div className="flex items-center">
                    <div className="w-60 h-60 rounded m-8 ">
                        <img className={`w-full h-full object-cover rounded-2xl p-2 ${profileData?.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`https://jobbar-5m8u.onrender.com/public/avatar/${profileData?.avatar}`} alt="" />
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
                {profileData.jobOffers && (
                    <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        {!jobOffers && (
                            <div className="flex justify-center">
                                <l-bouncy
                                size="45"
                                speed="1.75" 
                                color="gray" 
                                ></l-bouncy>
                            </div>
                            
                        )}
                        {jobOffers.length !== 0  ? (
                            <>
                                <h2 className="text-lg text-custom_gray font-semibold">Job Offers</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
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
