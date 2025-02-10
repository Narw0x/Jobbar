import { useEffect, useState } from 'react';

import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from './button';
import { bouncy } from 'ldrs';



export default function SearchBookmarksView() {

    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const authState = useSelector(state => state.auth);
    bouncy.register();

    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://jobbar-5m8u.onrender.com/api/job/user/${authState.user._id}`, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            }
        })
        .then(response => {
            setIsLoading(false);
            setJobs(response.data.payload.jobs);
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    }, [authState.token, authState.user.searchConfig]);

    const formatDateBetter = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    };

    return (
        <div>
            <h1 className="text-custom_gray text-4xl font-bold">Your applies</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-2">
                    {isLoading && (
                        <div className="flex justify-center">
                            <l-bouncy
                            size="45"
                            speed="1.75" 
                            color="gray" 
                            ></l-bouncy>
                        </div>
                    )}
                    {jobs.map((job, idx) => (
                        <div key={job._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 ">
                            <h3 className="text-md text-custom_gray font-semibold text-xl">{job.jobOffer.jobTitle}</h3>
                            <div className="flex flex-col justify-between">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex flex-row w-full lg:gap-16 justify-between">
                                        <p className=" text-custom_gray font-semibold">Salary:</p>
                                        <p className=" text-custom_red text-sm flex justify-center items-center">{job.jobOffer.salary.amount}{job.jobOffer.salary.currency}/<span className="text-sm">Year</span> </p>
                                    </div>
                                    <div className="flex flex-row  w-full items-center justify-between">
                                        <p className=" text-custom_gray font-semibold">Location:</p>
                                        <div className="max-w-24">
                                            <p className=" text-custom_red truncate text-sm">{job.jobOffer.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row  w-full justify-end">
                                        <p className="text-sm text-custom_gray">{formatDateBetter(job.jobOffer.date)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4 mt-2 justify-between">
                                    <div>
                                        <Button
                                            style="red-hover"
                                            redirectPath={`/job/${job.jobOffer._id}`} 
                                        >
                                            View
                                        </Button>
                                    </div>
                                    <div className='flex flex-row md:gap-4 items-center' >
                                        <p className="text-custom_gray text-xs">
                                            <span className='font-bold '>Status: </span>
                                            {job.status}
                                        </p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && !isLoading && (
                        <div className="flex justify-center p-8">
                            <p className="text-custom_gray">No applies found</p>
                        </div>
                    )}
                </div> 
        </div>
    )
}