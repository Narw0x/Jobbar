import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "../../../store/slices/authSlice";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";

import { isValidText } from "../../../util/validation";

import NavigationButtons from "../../../components/navigationButtons";
import ExperienceForm from "../../../components/experience/experienceForm";

const pathExperienceImage = "../../../experienceImage.svg";


export default function EditExperiencePage() {
    const toast = useRef(null);

    const [experience, setExperience] = useState({
        jobTitle: '',
        company: '',
        employmentType: '',
        date: [],
        description: ''
    });

    const handleExprerienceChange = (e) => {
        const { name, value } = e.target;
        setExperience((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        document.title = "Add Experience | Jobbar";
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...experience,
        }

        if(!isValidText(data.jobTitle)){
            setMessageState({type: 'error', message: 'Please provide a valid job title'});
            return;
        }

        if(!isValidText(data.company)){
            setMessageState({type: 'error', message: 'Please provide a valid company name'});
            return;
        }

        if(!isValidText(data.employmentType)){
            setMessageState({type: 'error', message: 'Please provide a valid employment type'});
            return;
        }

        if(data.date === null || data.date.length === 0){
            setMessageState({type: 'error', message: 'Please provide a valid date'});
            return;
        }

        if(!isValidText(data.description, 1, 500)){
            setMessageState({type: 'error', message: 'Please provide a valid description'});
            return;
        }

        axios.put(`https://jobbar-5m8u.onrender.com/api/profile/experience/add`, data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                Id: authState.user._id
            }
        }).then((response) => {
            if (response.status === 200) {
                dispatch(updateUser(response.data.payload.user));
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Experience added successfully' } });
            }
        }).catch((error) => {
            navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Failed to add experience' } });
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
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast} />
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl text-custom_gray font-bold ">Add Experience</h1>
                <div>
                    <form className="flex md:flex-row flex-col mt-4 gap-4" onSubmit={handleSubmit}>
                        <ExperienceForm experience={experience} handleExprerienceChange={handleExprerienceChange} state={authState} />
                    </form>
                </div>
            </div>
        </section>
    );
}