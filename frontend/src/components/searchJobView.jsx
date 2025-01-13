import { useEffect, useState } from 'react';

import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from './button';




export default function SearchJobView() {

    const [jobs, setJobs] = useState([]);

    const authState = useSelector(state => state.auth);

    useEffect(() => {
        if(authState.user.role === 'user') {
        axios.get('http://localhost:4000/api/jobs', {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                searchConfig: JSON.stringify(authState.user.searchConfig)
            }
        })
        .then(response => {
            setJobs(response.data.payload.jobs);
        }).catch(err => {
            console.log(err);
        });
    }}, [authState.token, authState.user.searchConfig]);

    console.log(jobs);
    
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
            <h1 className="text-custom_gray text-4xl font-bold">Search</h1>
            <p className="text-custom_gray">Find your dream job</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-2">
                    {jobs.map((job, idx) => (
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
                                <div className="flex flex-row gap-4 mt-2 justify-start">
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
        </div>
    )
}