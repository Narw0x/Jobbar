import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "./../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "./../../components/button";
import { bouncy } from "ldrs";

export default function ManageJobsPage() {

    const authState = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    bouncy.register();

    const [jobOffers, setJobOffers] = useState([]);

    const formatDateBetter = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    };

    useEffect(() => {
        if (authState.user.jobOffers.length !== 0) {
            setIsLoading(true);
            axios.get(`https://jobbar-5m8u.onrender.com/api/jobs/${authState.user._id}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`, // Include the token in the Authorization header
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsLoading(false);
                    setJobOffers(response.data.payload.jobs); 
                }
            })
            .catch((error) => {
                console.error('Error fetching job offers:', error);
                setIsLoading(false);
                if(error.response?.statusText === "Unauthorized"){
                    dispatch(logout());
                    navigate('/login', { state: { type: 'error', message: 'You are not authorized to view this page. Please log in.' } });
                }
            });
        } else {
            
            setJobOffers([]);
        }
    }, [authState.user, authState.token, dispatch, navigate]);

    useEffect(() => {
        document.title = "Manage Jobs | Jobbar";
    }, []);



    return (
         <section className="bg-custom_bg_gray py-8  min-h-[61.5vh]">
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="p-8">
                    {isLoading && (
                            <div className="flex justify-center">
                                <l-bouncy
                                size="45"
                                speed="1.75" 
                                color="gray" 
                                ></l-bouncy>
                            </div>
                            
                        )}
                    {jobOffers.length !== 0 && (
                        <>
                            <h2 className="text-2xl text-custom_gray font-semibold">Your Job Offers</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
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
                                            <div className="flex flex-grow">
                                                <Button
                                                    btnStyle="red-default"
                                                    redirectPath={`/job/manage/${job._id}`}
                                                >
                                                    Manage
                                                </Button>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))}
                            </div>
                        </>
                    )}
                    {jobOffers.length === 0 && !isLoading && (
                        <div className="flex justify-center p-8">
                            <p className="text-custom_gray">No job offers found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}