import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/button";
import { bouncy } from "ldrs";

export default function ManageJobsPage() {

    const authState = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
            axios.get(`http://localhost:4000/api/jobs/${authState.user._id}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`, // Include the token in the Authorization header
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setJobOffers(response.data.payload.jobs); 
                }
            })
            .catch((error) => {
                console.error('Error fetching job offers:', error);
                if(error.response?.statusText === "Unauthorized"){
                    dispatch(logout());
                    navigate('/login', { state: { type: 'error', message: 'You are not authorized to view this page. Please log in.' } });
                }
            });
        } else {
            setJobOffers([]);
        }
    }, [authState.user, authState.token]);



    return (
         <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="p-8">
                    {!jobOffers && (
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
                                            <div className="flex flex-grow">
                                                <Button
                                                    style="red-default"
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
                </div>
            </div>
        </section>
    )
}