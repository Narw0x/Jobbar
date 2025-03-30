import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router";

import { bouncy } from "ldrs";
import { isValidEmail } from "../../../util/validation";
import Loading from "../../../components/loading";
import { Helmet } from "react-helmet";
import SearchUser from "../../../components/admin/search";
import AdminJobLayout from "../../../components/admin/jobs/jobLayout";

export default function AdminJobsPage() {
    const toast = useRef(null);

    const [email, setEmail] = useState('');
    const [jobOffers, setJobOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    bouncy.register();

    const adminState = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!isValidEmail(email)){
            setMessageState({severity: 'error', summary: 'Error', detail: 'Please provide a valid email', life: 3000});
            return;
        }

        setIsLoading(true);
        axios.get(`https://jobbar-5m8u.onrender.com/api/admin/jobOffer/${email}`,{
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                setJobOffers(res.data.payload.jobs);
                setIsLoading(false);

            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 404) {
                    toast.current.show({severity: 'error', summary: 'Error', detail: 'No jobs found for this company', life: 3000});
                }
                setIsLoading(false)
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

    


    return (
        <section className=" bg-custom_bg_gray min-h-[61.5vh] pt-8">
            <Toast ref={toast} />
            <Helmet>
                <title>Admin Jobs | Jobbar</title>
                <meta name="description" content="Admin Jobs | Jobbar" />
            </Helmet>
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8 mt-0 mx-auto">
                <SearchUser handleChange={handleChange} handleSubmit={handleSubmit} email={email} searching={'Jobs'}/>
                {isLoading && <Loading />}
                {jobOffers.length !== 0  && <AdminJobLayout  jobOffers={jobOffers}/>}
            </div>
        </section>
    )
}