import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "../store/slices/authSlice"


import Button from "../components/button";
import { isValidText } from "../util/validation";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useLocation } from "react-router";

const pathExperienceImage = "../../../experienceImage.svg";


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
            navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Experience not found' } });
        }
        
    }, [experienceId, navigate, authState.user._id]);

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

    return (
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast} />
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl text-custom_gray font-bold ">Edit Experience</h1>
                <div>
                    <form className="flex md:flex-row flex-col mt-4 gap-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col flex-1 mt-2">
                            <div className="flex flex-col">
                                <label htmlFor="jobTitle" className="text-lg text-custom_gray">Job Title</label>
                                <input type="text" name="jobTitle" id="jobTitle" value={experience.jobTitle} onChange={handleExprerienceChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" />
                            </div>
                            <div className="mt-2 flex flex-col">
                                <label htmlFor="company" className="text-lg text-custom_gray">Company</label>
                                <input type="text" name="company" id="company" value={experience.company} onChange={handleExprerienceChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" />
                            </div>
                            <div className="mt-2">
                                <label className="text-lg text-custom_gray">Employment Type</label>
                                <div className="flex flex-row gap-4">
                                    <div>
                                        <input type="radio" id="fullTime" name="employmentType" value="Full-time" checked={experience.employmentType === "Full-time"}  onChange={handleExprerienceChange} className="mx-1 accent-custom_gray  checked:accent-custom_red"/>
                                        <label htmlFor="employmentType" className="text-custom_gray">Full-time</label>
                                    </div>
                                    <div>
                                        <input type="radio" id="partTime" name="employmentType" value="Part-time" checked={experience.employmentType === "Part-time"}  onChange={handleExprerienceChange} className="mx-1 accent-custom_gray  checked:accent-custom_red"/>
                                        <label htmlFor="employmentType" className="text-custom_gray">Part-time</label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                    <label htmlFor="date" className="text-lg text-custom_gray">Date</label>
                                    <Calendar name="date" value={experience.date} onChange={handleExprerienceChange} maxDate={new Date()} view="month" dateFormat="mm/yy"  selectionMode="range" readOnlyInput hideOnRangeSelection />
                            </div>
                            <div className="mt-2">
                                <label htmlFor="description" className="text-lg text-custom_gray">Description</label>
                                <textarea id="description" name="description" value={experience.description} onChange={handleExprerienceChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray p-2 my-2 text-lg w-full resize-none rounded" />
                            </div>
                            <div>
                                <Button 
                                    style="red-hover"
                                    type="button"
                                    onClick={handleDelete}
                                >
                                    Delete Experience
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 mt-[-1rem]">
                            <div className="flex flex-col justify-end flex-wrap">
                                <img src={pathExperienceImage} alt="" /> 
                                <p className="text-right mt-[-2rem]">Designed by 
                                <a 
                                    href="https://www.freepik.com" 
                                    className="text-custom_red p-2" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Freepik
                                </a>
                                </p>
                            </div>
                            <div className="flex space-x-4 justify-end mt-4">
                                <Button 
                                    style="red-hover"
                                    type="button"
                                    onClick={() => {
                                        navigate(`/profile/${authState.user._id}`);
                                    }}
                                >
                                    Back
                                </Button>
                                <Button 
                                    style="red-default"
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}