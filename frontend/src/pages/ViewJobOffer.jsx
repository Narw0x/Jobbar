import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import Button from "../components/button";

export default function ViewJobOfferPage() {

    const { jobId } = useParams();

    const [job, setJob] = useState({
        jobTitle: '',
        companyId: {
            avatar: 'default_profile.svg',
            companyName: '',
            about: ''
        },
        employmentType: 'Full-time',
        date: new Date(),
        description: '',
        requirements: [
            {
                requirementName: '',
                requirementType: 'Beginner'
            }
        ],
        salary: {
                currency: '€',
                amount: '0',
                salaryType: 'year'
        },
        address: ''
    });

    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/job/${jobId}`, {
            headers: {
                Authorization: `Bearer ${authState.token}`
            }
        }).then((response) => {
            const date = new Date(response.data.payload.job.date);

            setJob((prev) => ({
                ...prev,
                ...response.data.payload.job,
                date
            }));
        
        }).catch((error) => {
            console.log(error);
        });
    }, [jobId]);

    const formatDateBetter = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    };


    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] flex flex-col mx-auto border rounded-lg shadow-md bg-white">
                <div className="flex flex-row px-8 py-8">
                    <div className="basis-2/3">
                        <h1 className="text-3xl text-custom_gray font-bold">{job.jobTitle}</h1>
                        <p className="text-custom_red text-sm">{job.address}</p>
                        <div className="flex flex-col justify-between mt-4 w-96"> 
                            <h3 className="text-xl text-custom_gray">About the job</h3>
                            <p className="text-custom_gray">{job.description}</p>
                        </div>
                        <div className="flex flex-row  justify-between mt-4 w-96">
                            <h3 className="text-xl text-custom_gray">Salary:</h3>
                            <p className="text-xl text-custom_gray align-middle mt-auto">{job.salary.currency}{job.salary.amount}/{job.salary.salaryType}</p>
                        </div>
                        <div className="flex flex-row justify-between mt-1 w-96">
                            <h3 className="text-xl text-custom_gray">Start Date:</h3>
                            <p className=" text-custom_gray">{formatDateBetter(job.date)}</p>
                        </div>
                        <p className="text-custom_red ">{job.employmentType}</p>
                        <div className="flex flex-col mt-4 w-96">
                            <h3 className="text-xl text-custom_gray">Desired skills</h3>
                            {job.requirements.map((requirement, index) => (
                                <p className="text-custom_gray" key={index}>{requirement.requirementName} - <span className="text-custom_red">{requirement.requirementType}</span></p>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/3 justify-center items-center">
                        <div className="w-full aspect-square object-cover rounded">
                            <img className={`w-full h-full object-cover rounded-2xl p-2 ${job.companyId.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`http://localhost:4000/public/avatar/${job.companyId.avatar}`} alt="" />
                        </div>
                        <div className="flex flex-col text-left mt-4 w-full p-2">
                            <h3 className="text-xl text-custom_gray font-semibold">{job.companyId.companyName}</h3>
                            <p className="text-custom_gray">{job.companyId.about}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row px-8 py-4 gap-4">
                        <Button
                            style="red-hover"

                        >
                            Apply
                        </Button>
                        <Button 
                            style="red-default"
                            redirectPath="/job/search"
                        >
                            Back
                        </Button>
                </div>
            </div>
        </section>

    );
}