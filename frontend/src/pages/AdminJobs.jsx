import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router";

import Button from "../components/button";
import { bouncy } from "ldrs";
import { isValidEmail } from "../util/validation";

export default function AdminJobsPage() {
    const toast = useRef(null);

    const [email, setEmail] = useState('');
    const [jobOffers, setJobOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    bouncy.register();

    const adminState = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const formatDateBetter = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!isValidEmail(email)){
            setMessageState({severity: 'error', summary: 'Error', detail: 'Please provide a valid email', life: 3000});
            return;
        }

        setIsLoading(true);
        axios.get(`https://jobbar-5m8u.onrender.com/api/admin/jobOffer/${email}`,{
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                setJobOffers(res.data.payload.jobs);
                setIsLoading(false);

            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 404) {
                    toast.current.show({severity: 'error', summary: 'Error', detail: 'No jobs found for this company', life: 3000});
                }
                setIsLoading(false)
            });
        
    }

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
        document.title = "Admin Jobs | Jobbar";
    }, []);


    return (
        <section className=" bg-custom_bg_gray min-h-[61.5vh] pt-8">
            <Toast ref={toast} />
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8 mt-0 mx-auto">
                <h1  className="text-2xl text-custom_gray font-bold">Find Company Jobs</h1>
                <form className="flex flex-row gap-4 mt-8 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 basis-[90%]">
                        <h2 className="text-xl text-custom_gray font-bold">Search Company by Email</h2>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 text-lg" type="email" name="email" id="email" value={email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col text-xl basis-[10%] mt-auto "> 
                        <Button style={'red-hover'}>Search</Button>
                    </div>
                </form>
                {isLoading && (
                    <div className="flex justify-center p-8">
                        <l-bouncy
                        size="45"
                        speed="1.75" 
                        color="gray" 
                        ></l-bouncy>
                    </div>
                )}
                {jobOffers.length !== 0  && (
                    <div className="mt-8">
                        <h2 className="text-xl text-custom_gray font-bold ">Job Offers</h2>
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
                                                redirectPath={`/xyz/jobs/edit/${job._id}`}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                style="red-hover"
                                                redirectPath={`/xyz/jobs/${job._id}`}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}