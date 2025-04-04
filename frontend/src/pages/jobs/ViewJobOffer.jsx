import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


import Button from "../../components/button";
import { Toast } from "primereact/toast";
import ShowJob from "../../components/jobs/showJob";
import { Helmet } from "react-helmet";

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
    }, [jobId, authState.token, authState.user._id]);

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
            <Helmet>
                <title>Job Offer | Jobbar</title>
            </Helmet>
            <div className="max-w-[1440px] md:w-[70%] w-[90%] flex flex-col mx-auto border rounded-lg shadow-md bg-white">
                <div className="flex lg:flex-row flex-col px-8 py-8">
                    <ShowJob job={job} />
                    <div className="flex flex-col lg:basis-1/3 justify-center lg:items-center items-start">
                        <div className="w-full aspect-square object-cover rounded">
                            <Link to={`/profile/${job.companyId._id}`}>
                                <img className={`w-full aspect-square object-cover rounded-2xl p-2 ${job.companyId.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`https://jobbar-5m8u.onrender.com/public/avatar/${job.companyId.avatar}`} alt="" />
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
                            btnStyle="red-hover"
                            onClick={handleApply}
                            disabled={applied}
                        >
                            {applied ? 'Applied' : 'Apply'}
                        </Button>
                    ) : null}
                        
                        <Button 
                            btnStyle="red-default"
                            redirectPath={`${authState.user.role === 'user' ? '/job/search' : (`/profile/${authState.user._id}`)}`}
                        >
                            Back
                        </Button>
                        <Button
                            btnStyle="red-default"
                            redirectPath={`/profile/${job.companyId._id}`}
                        >
                            To company profile
                        </Button>
                </div>
            </div>
        </section>

    );
}