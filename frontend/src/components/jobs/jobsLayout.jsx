import { useState, useEffect } from "react";
import { bouncy } from "ldrs";
import axios from "axios";

import Button from "../button";
import JobItem from "./jobItem";

export default function JobsLayout({ jobs, isCurrentUser, token, id }) {

    const [jobOffers, setJobOffers] = useState([]);
    bouncy.register();


    useEffect(() => {
        if (jobs){
            axios.get(`https://jobbar-5m8u.onrender.com/api/jobs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setJobOffers(response.data.payload.jobs);
                }
            })
            .catch((error) => {
                console.log(error);
            });
        }   
    }, [id, token, jobs]);


    return (
        <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
            {!jobs && (
                <div className="flex justify-center">
                    <l-bouncy
                        size="45"
                        speed="1.75" 
                        color="gray" 
                    />
                </div>
            )}
            {jobOffers.length !== 0  ? (
                <>
                    <h2 className="text-lg text-custom_gray font-semibold">Job Offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                        {jobOffers.map((job) => (
                            <JobItem
                                key={job._id}
                                job={job}
                                isCurrentUser={isCurrentUser}
                            />
                        ))}
                    </div>
                    {isCurrentUser && (
                        <div className="flex justify-end mt-4">
                            <Button
                                btnStyle="red-hover"
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
                                <Button btnStyle="red-hover" redirectPath="/profile/job/add">
                                    Add new
                                </Button>
                            </div>
                        )} 
                    </div>
                </>
            )}
        </div>
)}