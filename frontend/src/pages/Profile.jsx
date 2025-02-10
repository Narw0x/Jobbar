import {  useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { logout } from "../store/slices/authSlice";
import axios from "axios";
import { Toast } from 'primereact/toast';
import ReportModal from "../components/reportModal";
import { tailspin, bouncy } from 'ldrs'


import Button from "../components/button";
import ErrorPage from "./Error";
import DeleteAccountModal from "../components/deleteModal";


export default function ProfilePage() {
    const toast = useRef(null);
    const reportModal = useRef();
    const deleteModal = useRef();
    const { id } = useParams();
    const authState = useSelector((state) => state.auth);
    const [profileData, setProfileData] = useState(null); 
    const [jobOffers, setJobOffers] = useState([]);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [error, setError] = useState(null);
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
        if (authState.user._id !== id) {
            setIsCurrentUser(false); // Viewing someone else's profile
            axios.get(`https://jobbar-5m8u.onrender.com/api/profile/${id}`, {
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
            axios.get(`https://jobbar-5m8u.onrender.com/api/jobs/${profileData._id}`, {
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

    const handleReport = () => {
        reportModal.current.open();
    }

    const handleDeleteAccount = () => {
        deleteModal.current.open();
    }

    

    if(error) {
        return (
            <ErrorPage type="child"/>
        );
    }

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
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full min-h-[150px] max-h-[250px] rounded-t" src={`https://jobbar-5m8u.onrender.com/public/background/${profileData?.bgImage}`} alt="" />
                </div>
                <div className="flex md:flex-row flex-col">
                    <div className="w-60 h-60 rounded m-8 md:m-8 my-8 mx-auto flex justify-start">
                        <img className={`w-full h-full object-cover rounded-2xl p-2 ${profileData?.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`https://jobbar-5m8u.onrender.com/public/avatar/${profileData?.avatar}`} alt="" />
                    </div>
                    <div className="flex flex-grow sm:flex-row flex-col  justify-between p-8 md:p-0 pt-0 gap-2 md:gap-0">
                        <div className="sm:ml-4 flex-1 flex flex-col justify-center">
                            <h2 className="text-lg text-custom_gray font-semibold text-center sm:text-left" id="UserName">
                                {profileData?.firstName || profileData?.companyName}
                            </h2>
                            {profileData.address && <p className="text-sm text-gray-500 text-center sm:text-left">
                                {profileData.address}
                            </p>}
                            {!profileData.isVerified && (
                                <p className="text-sm text-custom_red text-center sm:text-left">
                                    Your account is not verified
                                </p>
                            )}
                            
                        </div>
                        <div className="flex flex-col justify-end md:justify-center md:mx-4">
                            {!isCurrentUser && (
                                <div className="flex flex-row justify-center">
                                    <Button style="red-hover" onClick={handleReport}>
                                        Report
                                    </Button>
                                    <ReportModal ref={reportModal} type={profileData.role} setMessage={setMessageState}></ReportModal>
                                </div>
                            )}
                            {isCurrentUser && (
                                <div className="flex flex-row justify-center sm:justify-none">
                                    <Button style="red-hover" onClick={handleDeleteAccount}>
                                        Delete Account
                                    </Button>
                                    <DeleteAccountModal ref={deleteModal}></DeleteAccountModal>
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>
            </div>
            <div>
                {profileData.about && (
                    <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg text-custom_gray font-semibold">About</h2>
                        <p className="text-sm text-gray-500">{profileData.about}</p>
                    </div>
                )}
                {profileData.experience && (
                    <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
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
                                            <div className="flex sm:flex-row flex-col justify-end text-end gap-4">
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
                    <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
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
                    <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
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
                                            <div className="flex flex-col items-center space-y-2">
                                                <div className="flex flex-row w-full lg:gap-16 justify-between">
                                                    <p className=" text-custom_gray font-semibold">Salary:</p>
                                                    <p className=" text-custom_red text-sm flex justify-center items-center">{job.salary.amount}{job.salary.currency}/<span className="text-sm">Year</span> </p>
                                                </div>
                                                <div className="flex flex-row  w-full items-center justify-between">
                                                    <p className=" text-custom_gray font-semibold">Location:</p>
                                                    <div className="max-w-24">
                                                        <p className=" text-custom_red truncate text-sm">{job.address}</p>
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
                {(profileData.phoneNumber || profileData.email || profileData.website || (profileData.socialMedia.twitter || profileData.socialMedia.github || profileData.socialMedia.instagram)) && (
                    <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
                        <h2 className="text-lg  text-custom_gray font-semibold">Contact</h2>
                        <div className="text-sm text-gray-500 flex gap-1 flex-col">
                            {profileData.phoneNumber && (
                                <p>Phone number: <span className="text-custom_red">{profileData.phoneNumber}</span></p>
                            )}
                            {profileData.email && (
                                <p>Email: <span className="text-custom_red">{profileData.email}</span></p>
                            )}
                            {profileData.website && (
                                <p>Website: <a href={profileData.website} className="text-custom_red">{profileData.website}</a></p>
                            )}
                            <div className="flex flex-row gap-2">
                                {profileData.socialMedia.twitter && (
                                    <a href={`https://x.com/${profileData.socialMedia.twitter}`} className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 30 30" fill="none">
                                            <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z" fill="currentColor"/>
                                        </svg>
                                    </a>
                                )}
                                {profileData.socialMedia.github && (
                                   <a href={`https://github.com/${profileData.socialMedia.github}`} className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                                            <path d="M9 18c-4.51 2-5-2-7-2"/>
                                        </svg>
                                    </a>
                                )}
                                {profileData.socialMedia.instagram && (
                                    <a href={`https://www.instagram.com/${profileData.socialMedia.instagram}`} className="hover:text-custom_red transition-colors duration-300 cursor-pointer">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" />
                                            <path d="M16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8716 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="currentColor" strokeWidth="2" />
                                            <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
