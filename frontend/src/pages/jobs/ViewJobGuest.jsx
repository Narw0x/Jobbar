import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


import Button from "../../components/button";
import ShowJob from "../../components/jobs/showJob";
import { Helmet } from "react-helmet";

export default function ViewJobGuestPage() {
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
        experience: '0-1',
        skills: [
            {
                skillName: '',
                skillLevel: 'Beginner'
            }
        ],
        requirements: [
            {
                requirementName: '',
                requirementType: 'required'
            }
        ],
        salary: {
                currency: '€',
                amount: '0',
                salaryType: 'year'
        },
        address: '',
        applicants: []
    });



    useEffect(() => {
        axios.get(`https://jobbar-5m8u.onrender.com/api/job/${jobId}`)
        .then((response) => {
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

    return (
        <section className="bg-custom_bg_gray py-8  min-h-[61.5vh]">
            <Helmet>
                <title>Job Offer | Jobbar</title>
            </Helmet>
            <div className="max-w-[1440px] md:w-[70%] w-[90%] flex flex-col mx-auto border rounded-lg shadow-md bg-white">
                <div className="flex lg:flex-row flex-col px-8 py-8">
                    <ShowJob job={job} />
                    <div className="flex flex-col lg:basis-1/3 justify-center lg:items-center items-start">
                        <div className="w-full aspect-square object-cover rounded">
                            <img className={`w-full aspect-square object-cover rounded-2xl p-2 ${job.companyId.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`https://jobbar-5m8u.onrender.com/public/avatar/${job.companyId.avatar}`} alt="" />
                        </div>
                        <div className="flex flex-col text-left mt-4 w-full p-2">
                            <h3 className="text-xl text-custom_gray font-semibold">{job.companyId.companyName}</h3>
                            <p className="text-custom_gray text-justify">{job.companyId.about}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row px-8 lg:py-8 pb-8 gap-4 m-2">
                    <Button 
                        btnStyle="red-default"
                        redirectPath={`/search`}
                    >
                        Back
                    </Button>
                </div>
            </div>
        </section>

    );
}