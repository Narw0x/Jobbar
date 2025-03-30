import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "./../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { bouncy } from "ldrs";
import Loading from "../../components/loading";
import { Helmet } from "react-helmet";
import ManageJobsComponent from "../../components/jobs/manageJobs";

export default function ManageJobsPage() {

    const authState = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    bouncy.register();

    const [jobOffers, setJobOffers] = useState([]);

    useEffect(() => {
        if (authState.user.jobOffers.length !== 0) {
            setIsLoading(true);
            axios.get(`https://jobbar-5m8u.onrender.com/api/jobs/${authState.user._id}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`, // Include the token in the Authorization header
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setIsLoading(false);
                    setJobOffers(response.data.payload.jobs); 
                }
            })
            .catch((error) => {
                console.error('Error fetching job offers:', error);
                setIsLoading(false);
                if(error.response?.statusText === "Unauthorized"){
                    dispatch(logout());
                    navigate('/login', { state: { type: 'error', message: 'You are not authorized to view this page. Please log in.' } });
                }
            });
        } else {
            
            setJobOffers([]);
        }
    }, [authState.user, authState.token, dispatch, navigate]);


    return (
         <section className="bg-custom_bg_gray py-8  min-h-[61.5vh]">
            <Helmet>
                <title>Manage Jobs | Jobbar</title>
            </Helmet>
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white">
                <div className="p-8">
                    {isLoading && <Loading />}
                    {jobOffers.length !== 0 && <ManageJobsComponent jobs={jobOffers} />}
                    {jobOffers.length === 0 && !isLoading && (
                        <div className="flex justify-center p-8">
                            <p className="text-custom_gray">No job offers found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}