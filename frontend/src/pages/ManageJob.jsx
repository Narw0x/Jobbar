import axios from "axios";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/slices/authSlice";
import { Toast } from "primereact/toast";

export default function ManageJobPage() {
    const toast = useRef(null);
    const {jobId} = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const dispatch = useDispatch();

    const authState = useSelector(state => state.auth);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/job/applicants/${jobId}`)
        .then(response => {
            setApplicants(response.data.payload.applicants);
        }).catch(err => {
            console.log(err);
        });
            
    }, [jobId]);

    const handleAccept = (id) => {
        return () => {
            axios.post(`http://localhost:4000/api/job/accept/${jobId}`, {
                applicantId: id
            }).then(response => {
                setApplicants(applicants.filter(applicant => applicant.applicant._id !== id));
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const handleAddFavorite = (userId) => {
        axios.put(`http://localhost:4000/api/profile/favorite/${userId}`, userId,
            {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                    id: `${authState.user._id}`
                },
            }
        ).then(response => {
            dispatch(updateUser(response.data.payload.user));
        }).catch(err => {
            console.log(err);
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
    




    

    return(
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast} />
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white">
                <form className="p-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex flex-row gap-4 justify-between">
                                <div  className="flex flex-row justify-between basis-1/2">
                                    <div className="flex basis-1/2 text-left  font-bold text-xl text-custom_gray">
                                        Applicant Name
                                    </div>
                                    <div className="flex basis-1/2 text-left font-bold text-xl text-custom_gray">
                                        Email
                                    </div>
                                </div>
                                <div className="flex flex-row justify-end basis-1/2">
                                    <div className="  font-bold text-xl text-custom_gray">
                                        Save
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        {applicants && applicants.map(applicant => (
                            <div key={applicant.applicant._id} className="flex flex-row gap-4 border-b py-2 justify-between">
                                <div className="flex flex-row justify-between basis-1/2 items-center">
                                    <div className="flex basis-1/2 text-left">
                                        {applicant.applicant.firstName} {applicant.applicant.lastName}
                                    </div>
                                    <div className="flex basis-1/2 text-left">
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
                                    <Button
                                        style='red-hover'
                                        onClick={handleAccept(applicant.applicant._id)}
                                    >
                                        Accept
                                    </Button>
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
                    </div>
                </form>
            </div>
        </section>
    );
}