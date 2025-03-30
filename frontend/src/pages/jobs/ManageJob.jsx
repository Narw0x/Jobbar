import axios from "axios";
import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "./../../components/button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./../../store/slices/authSlice";
import { Toast } from "primereact/toast";
import AcceptModal from "./../../components/acceptModal";
import { bouncy } from "ldrs";
import { Helmet } from "react-helmet";
import Loading from "../../components/loading";
import JobAccepted from "../../components/jobs/jobAccepted";
import JobFormHeader from "../../components/jobs/jobFormHeader";
import JobFormBody from "../../components/jobs/jobFormBody";

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

    const fetchApplicants = useCallback(() => {
        setIsLoading(true);
        axios.get(`https://jobbar-5m8u.onrender.com/api/job/applicants/${jobId}`)
            .then(response => {
                setIsLoading(false);
                if(response.data.payload.applicants.length !== 0){
                    response.data.payload.applicants.map(applicant => {
                        if(applicant.status === 'Accepted'){
                            setAcceptedApplicant(applicant);
                        }
                        return null;
                    });
                }
                setApplicants(response.data.payload.applicants);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    }, [jobId]);

    useEffect(() => {
        fetchApplicants();
    }, [jobId, fetchApplicants]);


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
    }, [jobId, authState.token]);

    

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
        <section className="bg-custom_bg_gray py-8  min-h-[61.5vh]">
            <Helmet>
                <title>Manage Job | Jobbar</title>
            </Helmet>
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
                    {isLoading && <Loading />}
                    {applicants.length !== 0  && (
                        <div className="flex flex-col gap-4">
                        <h1 className="text-custom_gray font-bold md:text-4xl text-2xl">Job: {jobName.jobTitle}</h1>
                        {acceptedApplicant && <JobAccepted acceptedApplicant={acceptedApplicant} />}
                        <JobFormHeader />
                        {applicants && applicants.map(applicant => <JobFormBody key={applicant.applicant._id} applicant={applicant} handleAddFavorite={handleAddFavorite} handleOpenModal={handleOpenModal} acceptedApplicant={acceptedApplicant} jobId={jobId} state={authState} />)}
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