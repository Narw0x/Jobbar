import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";

import { Calendar } from "primereact/calendar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { updateUser } from "../store/slices/authSlice"
import { useDispatch } from "react-redux";

import Button  from "../components/button";
import { isValidText } from "../util/validation";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useLocation } from "react-router";

const pathEducationImage = "../../../experienceImage.svg";

export default function EditEducationPage() {

    const [education, setEducation] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useRef(null);

    const authState = useSelector((state) => state.auth);

    const params = useParams();
    const educationId = params.educationId;
    

    useEffect(() => {
        let education = authState.user.education.school.find(exp => exp.educationId === educationId);
        if(!education) education = authState.user.education.certificate.find(exp => exp.educationId === educationId);
        if(!education) education = authState.user.education.skill.find(exp => exp.educationId === educationId);
        
        if(education) {
            let formatedDate = [];
            education.educationType === "school" ? (
                formatedDate = [new Date(education.date[0]), new Date(education.date[1])]
            ) : (
                formatedDate = new Date(education.date)
            )
            setEducation(
                {
                    educationId: education.educationId,
                    educationType: education.educationType,
                    ...education,
                    date: formatedDate
                }
            );
        }
        
    }, [educationId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        

        const data = {
            ...education,
        }


        if(data.educationType === 'school') {
            if(!isValidText(data.schoolName)) {
                setMessageState({type: 'error', message: 'Please provide a valid school name'});
                return;
            }
            if(data.date === null || data.date.length === 0 || data.date[0] === null || data.date[1] === null) {
                setMessageState({type: 'error', message: 'Please provide a valid date'});
                return;
            }
        }


        if(data.educationType === 'certificate') {
            if(!isValidText(data.certificateName)) {
                setMessageState({type: 'error', message: 'Please provide a valid certificate name'});
                return;
            }
            if(!isValidText(data.company)) {
                setMessageState({type: 'error', message: 'Please provide a valid company name'});
                return;
            }
            if(data.date === null || data.date.length === 0 || data.date[0] === null) {
                setMessageState({type: 'error', message: 'Please provide a valid date'});
                return;
            }
        }


        if(data.educationType === 'skill') {
            if(!isValidText(data.skillName)) {
                setMessageState({type: 'error', message: 'Please provide a valid skill name'});
                return;
            }
            if(data.level === '') {
                setMessageState({type: 'error', message: 'Please provide a valid skill level'});
                return;
            }
        }
            


        
        axios.put(`https://jobbar-5m8u.onrender.com/api/profile/education/edit/${educationId}`, data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then((response) => {
            if (response.status === 200) {
                dispatch(updateUser(response.data.payload.user));
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Education edited successfully' } });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDelete = async () => {
        await axios.put(`https://jobbar-5m8u.onrender.com/api/profile/education/delete/${educationId}`, {}, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id,
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Education deleted successfully' } });
                dispatch(updateUser(response.data.payload.user));
            }
        }).catch((error) => {
            navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Failed to delete education' } });
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
                        <h1 className="text-4xl text-custom_gray font-bold ">Add your Education </h1>
                        <div>
                            <form className="flex md:flex-row flex-col mt-4 gap-8" onSubmit={handleSubmit}>
                                <div className="flex flex-col flex-1 mt-2">
                                    {education.educationType === "school" && (
                                        <>
                                             <div className="flex flex-col">
                                                <label htmlFor="schoolName" className="text-lg text-custom_gray">School Name</label>
                                                <input type="text" name="schoolName" id="schoolName" value={education.schoolName}  onChange={handleChange}  className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
                                            </div>
                                            <div className="mt-2 flex flex-col">
                                                <label htmlFor="date" className="text-lg text-custom_gray">Years</label>
                                                <Calendar name="date" value={education.date} onChange={handleChange} maxDate={new Date()} view="year" dateFormat="yy"  selectionMode="range" readOnlyInput hideOnRangeSelection showButtonBar/>
                                            </div>
                                        </>
                                    )}
                                    {education.educationType === "certificate" && (
                                        <>
                                            <div className="flex flex-col">
                                                <label htmlFor="certificateName" className="text-lg text-custom_gray">Name of Certificate</label>
                                                <input type="text" name="certificateName" id="certificateName" value={education.certificateName}  onChange={handleChange}   className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
                                            </div>
                                            <div className="mt-2 flex flex-col">
                                                <label htmlFor="company" className="text-lg text-custom_gray">Issuing Company</label>
                                                <input type="text" name="company" id="company" value={education.company}  onChange={handleChange}  className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray"/>
                                            </div>
                                            <div className="mt-2 flex flex-col">
                                                <label htmlFor="date" className="text-lg text-custom_gray">Issuing Date</label>
                                                <Calendar name="date" value={education.date}  onChange={handleChange}  maxDate={new Date()} dateFormat="mm/dd/yy"  readOnlyInput hideOnRangeSelection showButtonBar/>
                                                {console.log(education.date)}
                                            </div>
        
                                        </>
                                    )}
                                    {education.educationType === "skill" && (
                                    <>
                                        <div className="flex flex-col">
                                            <label htmlFor="skillName" className="text-lg text-custom_gray">Name</label>
                                            <input type="text" name="skillName" id="skillName" value={education.skillName}  onChange={handleChange}  className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
                                        </div>
                                        <div className="mt-2 flex flex-col">
                                            <label htmlFor="level" className="text-lg text-custom_gray">Level</label>
                                            <select name="level" id="level" value={education.level}  onChange={handleChange} className="border border-black p-2 bg-white rounded mb-4 text-xl my-2 text-custom_gray">
                                                <option value="" disabled>Select skill level</option>
                                                <option value="Begginer">Begginer</option>
                                                <option value="Intermidient">Intermidient</option>
                                                <option value="Expert">Expert</option>
                                            </select>
                                        </div>
                                    </>
                                )}
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
                                        <img src={pathEducationImage} alt="" /> 
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
                                                console.log(`/profile/${authState.user._id}`);
                                                // navigate(`/profile/${authState.user._id}`);
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