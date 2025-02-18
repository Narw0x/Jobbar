import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


import Button from "../components/button";
import { Toast } from "primereact/toast";

export default function ViewJobOfferPage() {
    const toast = useRef(null);
    const { jobId } = useParams();
    const [applied, setApplied] = useState(false);

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

    const authState = useSelector((state) => state.auth);


    useEffect(() => {
        axios.get(`https://jobbar-5m8u.onrender.com/api/job/${jobId}`, {
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
            setApplied(response.data.payload.job.applicants.includes(authState.user._id));
        
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
        document.title = "Job Offer | Jobbar";
    }, []);

    const handleApply = () => {
        axios.post(`https://jobbar-5m8u.onrender.com/api/job/apply/${jobId}`, {}, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
            }).then((response) => {
                setApplied(true);
                setMessageState({type: 'success', message: response.data.message});
            }).catch((error) => {
                setMessageState({type: 'error', message: error.response.data.message});
            }
        );
    }
 

    return (
        <section className="bg-custom_bg_gray py-8  min-h-[61.5vh]">
            <Toast ref={toast} />
            <div className="max-w-[1440px] md:w-[70%] w-[90%] flex flex-col mx-auto border rounded-lg shadow-md bg-white">
                <div className="flex lg:flex-row flex-col px-8 py-8">
                    <div className="lg:basis-2/3 w-full">
                        <h1 className="text-3xl text-custom_gray font-bold">{job.jobTitle}</h1>
                        <p className="text-custom_red text-sm">{job.address}</p>
                        <div className="flex flex-col justify-between mt-4 w-[80%]"> 
                            <h3 className="text-xl text-custom_gray font-bold ">About the job</h3>
                            <p className="text-custom_gray text-justify">{job.description}</p>
                        </div>
                        <div className="flex flex-row  justify-between mt-4 lg:w-[50%] items-c">
                            <h3 className="text-xl text-custom_gray">Salary:</h3>
                            <p className="text-xl text-custom_gray align-middle mt-auto">{job.salary.currency}{job.salary.amount}/year</p>
                        </div>
                        <div className="flex flex-row justify-between mt-1 lg:w-[50%]">
                            <h3 className="text-xl text-custom_gray">Start Date:</h3>
                            <p className=" text-custom_gray my-auto">{formatDateBetter(job.date)}</p>
                        </div>
                        <div className="flex flex-row mt-4 lg:w-[50%] justify-between">
                            <h3 className="text-xl text-custom_gray">Employment Type:</h3>
                            <p className="text-custom_red my-auto">{job.employmentType}</p>
                        </div>
                        <div className="flex flex-row mt-4 lg:w-[50%] justify-between">
                            <h3 className="text-xl text-custom_gray">Experience:</h3>
                            <p className="text-custom_gray my-auto">{job.experience} years</p>
                        </div>
                        <div className="flex flex-col mt-4 lg:w-[50%]">
                            <h3 className="text-xl text-custom_gray">Requirements:</h3>
                            {job.requirements.map((requirement, index) => (
                                <p className="text-custom_gray my-auto" key={index}>{requirement.requirementName} - <span className="text-custom_red">{requirement.requirementType}</span></p>
                            ))}
                        </div>
                        <div className="flex flex-col mt-4 lg:w-96">
                            <h3 className="text-xl text-custom_gray">Desired skills:</h3>
                            {job.skills.map((skill, index) => (
                                <p className="text-custom_gray" key={index}>{skill.skillName} - <span className="text-custom_red">{skill.skillLevel}</span></p>
                            ))}
                        </div>
                    </div>
                        <div className="flex flex-col lg:basis-1/3 justify-center lg:items-center items-start">
                                <div className="w-60 aspect-square object-cover rounded">
                                    <Link to={`/profile/${job.companyId._id}`}>
                                        <img className={`w-full aspect-square object-cover rounded-2xl p-2 ml-[-0.5rem] ${job.companyId.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`https://jobbar-5m8u.onrender.com/public/avatar/${job.companyId.avatar}`} alt="" />
                                    </Link>
                                </div>
                                <div className="flex flex-col text-left mt-4 w-full p-2">
                                    <h3 className="text-xl text-custom_gray font-semibold">{job.companyId.companyName}</h3>
                                    <p className="text-custom_gray text-justify">{job.companyId.about}</p>
                                </div>
                        </div>
                </div>
                <div className="flex flex-row px-8 py-8 gap-4">
                    {(authState.user.role === 'user' && job.status === 'Open') ? (
                        <Button
                            style="red-hover"
                            onClick={handleApply}
                            disabled={applied}
                        >
                            {applied ? 'Applied' : 'Apply'}
                        </Button>
                    ) : null}
                        
                        <Button 
                            style="red-default"
                            redirectPath={`${authState.user.role === 'user' ? '/job/search' : (`/profile/${authState.user._id}`)}`}
                        >
                            Back
                        </Button>
                        <Button
                            style="red-default"
                            redirectPath={`/profile/${job.companyId._id}`}
                        >
                            To company profile
                        </Button>
                </div>
            </div>
        </section>

    );
}