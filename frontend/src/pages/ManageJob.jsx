import axios from "axios";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/slices/authSlice";
import { Toast } from "primereact/toast";
import AcceptModal from "../components/acceptModal";
import { bouncy } from "ldrs";

export default function ManageJobPage() {
    const toast = useRef(null);
    const modal = useRef(null);
    const {jobId} = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [acceptedApplicant, setAcceptedApplicant] = useState(null);
    const [jobName, setJobName] = useState('');
    const dispatch = useDispatch();
    bouncy.register();


    const authState = useSelector(state => state.auth);
    const location = useLocation();
    const [messageState, setMessageState] = useState(location.state || null);

    const fetchApplicants = () => {
        setIsLoading(true);
        axios.get(`https://jobbar-5m8u.onrender.com/api/job/applicants/${jobId}`)
            .then(response => {
                setIsLoading(false);
                if(response.data.payload.applicants.length !== 0){
                    response.data.payload.applicants.map(applicant => {
                        if(applicant.status === 'Accepted'){
                            setAcceptedApplicant(applicant);
                        }
                    });
                }
                setApplicants(response.data.payload.applicants);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    };

    useEffect(() => {
        fetchApplicants();
    }, [jobId]);


    const handleAddFavorite = (userId) => {
        axios.put(`https://jobbar-5m8u.onrender.com/api/profile/favorite/${userId}`, userId,
            {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                    id: `${authState.user._id}`
                },
            }
        ).then(response => {
            response.data.payload.state === 'added' ? toast.current?.show({severity: 'success', summary: 'Success', detail: 'User added to favorites', life: 2000}) : toast.current?.show({severity: 'success', summary: 'Success', detail: 'User removed from favorites', life: 2000});
            dispatch(updateUser(response.data.payload.user));

        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        axios.get(`https://jobbar-5m8u.onrender.com/api/job/name/${jobId}`, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            }
        }).then( response => {
            setJobName(response.data.payload.jobName);
        }).catch(err => {
            console.log(err);
        });
    }, [jobId])

    

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

    const handleOpenModal = (userName, userEmail, applicantId, jobId) => {
        
        setSelectedApplicant({userName, userEmail, applicantId, jobId});
        modal.current.open();
    };


    return(
        <section className="bg-custom_bg_gray py-8 ">
            <Toast ref={toast} />
            <AcceptModal
                ref={modal}
                userId={selectedApplicant?.applicantId}
                jobId={selectedApplicant?.jobId}
                userName={selectedApplicant?.userName}
                userEmail={selectedApplicant?.userEmail}
                setMessage={setMessageState}
                fetchApplicants={fetchApplicants}
            />
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white">
                <form className="p-8">
                    {isLoading && (
                        <div className="flex justify-center">
                            <l-bouncy
                            size="45"
                            speed="1.75" 
                            color="gray" 
                            ></l-bouncy>
                        </div>
                    )}
                    {applicants.length !== 0  && (<div className="flex flex-col gap-4">
                        <h1 className="text-custom_gray font-bold md:text-4xl text-2xl">Job: {jobName.jobTitle}</h1>
                        {acceptedApplicant && (
                            <div>
                                <h2 className="text-xl font-bold text-custom_gray my-4">Accepted Applicant</h2>
                                
                                <div className="flex flex-row gap-4 border-b py-2 justify-between">
                                    <div className="flex flex-row justify-between basis-1/2 items-center">
                                        <div className="flex basis-1/2 text-left">
                                            {acceptedApplicant.applicant.firstName} {acceptedApplicant.applicant.lastName}
                                        </div>
                                        <div className="flex basis-1/2 text-left">
                                            {acceptedApplicant.applicant.email}
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 justify-end basis-1/2">
                                        <Button
                                            style='red-default'
                                            onClick={() => navigate(`/profile/${acceptedApplicant.applicant._id}`)}
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                        }
                        <div>
                            <div className="flex flex-row gap-4 justify-between">
                                <div  className="flex flex-row justify-between w-full lg:basis-1/2">
                                    <div className="flex lg:basis-1/2 text-left  font-bold lg:text-xl text-custom_gray">
                                        Name
                                    </div>
                                    <div className="flex lg:basis-1/2 text-left font-bold lg:text-xl text-custom_gray">
                                        Email
                                    </div>
                                </div>
                                <div className="hidden lg:flex flex-row justify-end lg:basis-1/2">
                                    <div className="  font-bold md:text-xl text-custom_gray">
                                        Actions
                                    </div>
                                </div>
                            </div>
                        </div>
                        {applicants && applicants.map(applicant => (
                            <div key={applicant.applicant._id} className="flex lg:flex-row flex-col gap-4 border-b py-2 justify-between">
                                <div className="flex flex-row justify-between basis-1/2 items-center">
                                    <div className="flex basis-1/2 text-left">
                                        {applicant.applicant.firstName}
                                    </div>
                                    <div className="flex basis-1/2 text-left justify-end lg:justify-start">
                                        {applicant.applicant.email}
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 justify-end basis-1/2">
                                    <Button
                                        style='red-default'
                                        onClick={() => navigate(`/profile/${applicant.applicant._id}`)}
                                    >
                                        View Profile
                                    </Button>
                                    {!acceptedApplicant && (
                                        <Button
                                            style='red-hover'
                                            type="button"
                                            onClick={() =>
                                                handleOpenModal(applicant.applicant.firstName, applicant.applicant.email, applicant.applicant._id, jobId)
                                            }
                                        >
                                            Accept
                                        </Button>
                                    )}
                                    <div className="flex items-center">
                                        <button className="flex items-center justify-center text-custom_red h-6 w-6" type="button" onClick={() => handleAddFavorite(applicant.applicant._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={authState.user.favoriteApplicants?.includes(applicant.applicant._id) ? 'currentColor': 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)}
                    {applicants.length === 0 && !isLoading && (
                        <div className="flex justify-center">
                            <h1 className="text-xl text-custom_gray">No applicants for this job</h1>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}