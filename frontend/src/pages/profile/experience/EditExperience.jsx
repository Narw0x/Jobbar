import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "../../../store/slices/authSlice"


import { isValidText } from "../../../util/validation";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useLocation } from "react-router";
import ExperienceForm from "../../../components/experience/experienceForm";



export default function EditExperiencePage() {

    const {experienceId } = useParams();
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [experience, setExperience] = useState({
        experienceId: '',
        jobTitle: '',
        company: '',
        employmentType: '',
        date: [],
        description: ''
    });

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        const experience = authState.user.experience.find(exp => exp.experienceId === experienceId);
        if(experience) {
            const date = [new Date(experience.date[0]), new Date(new Date(experience.date[1]))];
            setExperience({
                experienceId: experience.experienceId,
                jobTitle: experience.jobTitle,
                company: experience.company,
                employmentType: experience.employmentType,
                date,
                description: experience.description
            }
            )
        }else{
            // navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Experience not found' } });
        }
        
    }, [experienceId, navigate, authState.user._id, authState.user.experience]);

    const handleExprerienceChange = (e) => {
        const { name, value } = e.target;
        setExperience((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDelete = async () => {
        await axios.put(`https://jobbar-5m8u.onrender.com/api/profile/experience/delete/${experienceId}`, {}, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id,
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Experience deleted successfully' } });
                dispatch(updateUser(response.data.payload.user));
            }
        }).catch((error) => {
            navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Failed to delete experience' } });
        });
    }

    useEffect(() => {
        document.title = "Edit Experience | Jobbar";
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        const experienceData = {
            ...experience,
        }

        if(!isValidText(experienceData.jobTitle)){
            setMessageState({type: 'error', message: 'Please provide a valid job title'});
            return;
        }

        if(!isValidText(experienceData.company)){
            setMessageState({type: 'error', message: 'Please provide a valid company name'});
            return;
        }

        if(!isValidText(experienceData.employmentType)){
            setMessageState({type: 'error', message: 'Please provide a valid employment type'});
            return;
        }

        if(!experienceData.date){
            setMessageState({type: 'error', message: 'Please provide a valid date'});
            return;
        }

        if(!isValidText(experienceData.description, 1, 500)){
            setMessageState({type: 'error', message: 'Please provide a valid description'});
            return;
        }




        axios.put(`https://jobbar-5m8u.onrender.com/api/profile/experience/edit/${experienceId}`, experienceData, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                Id: authState.user._id
            }
        }).then((response) => {
            if (response.status === 200) {
                dispatch(updateUser(response.data.payload.user));
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Experience updated successfully' } });
            }
        }).catch((error) => {
            navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Failed to update experience' } });
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

    console.log(experience);

    return (
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast} />
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl text-custom_gray font-bold ">Edit Experience</h1>
                <div>
                    <form className="flex md:flex-row flex-col mt-4 gap-8" onSubmit={handleSubmit}>
                        <ExperienceForm experience={experience} handleExprerienceChange={handleExprerienceChange} state={authState} deleteExperience={true} handleDelete={handleDelete} />
                    </form>
                </div>
            </div>
        </section>
    );
}