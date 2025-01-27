import { useState } from "react";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/slices/authSlice"

import Button from "../components/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { isValidText } from "../util/validation";



const pathExperienceImage = "../../../experienceImage.svg";


export default function EducationPage(){

    const toast = useRef(null);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);

    const [type, setType] = useState('');
    const [education, setEducation] = useState({});

    const handleTypeChange = (e) => {
        e.target.value === 'school' && setEducation({
            educationType: 'school',
            date: [],
            schoolName: ''
        });
        e.target.value === 'certificate' && setEducation({
            educationType: 'certificate',
            date: [],
            certificateName: '',
            company: ''
        });
        e.target.value === 'skill' && setEducation({
            educationType: 'skill',
            skillName: '',
            level: ''
        });
        setType(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(type === '') {
            setMessageState({type: 'error', message: 'Please select education type'});
            return;
        }

        const data = {
            ...education
        };

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


        axios.post(`http://localhost:4000/api/profile/education/add`, data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then((response) => {
            if (response.status === 200) {
                dispatch(updateUser(response.data.payload.user));
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Education added successfully' } });
            }
        }).catch((error) => {
            console.log(error);
            
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
            <div className="max-w-[1440px] mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl text-custom_gray font-bold ">Add your Education </h1>
                <div>
                    <form className="flex flex-row mt-4" onSubmit={handleSubmit}>
                        <div className="flex flex-col flex-1 mt-2">
                            <div className="mt-2 flex flex-col">
                                <label 
                                    htmlFor="educationType" 
                                    className="text-lg text-gray-700 mb-2"
                                >
                                    Type of your education
                                </label>
                                <select
                                    id="educationType"
                                    name="educationType"
                                    value={type}
                                    onChange={handleTypeChange}
                                    className={`border border-black p-2 bg-white rounded  text-xl my-2 text-custom_gray`}
                                >
                                    <option value="" disabled>Select education type</option>
                                    <option value="school">School</option>
                                    <option value="certificate">Certificate</option>
                                    <option value="skill">Skill</option>
                                </select>
                            </div>

                            {type === "school" && (
                                <>
                                     <div className="flex flex-col">
                                        <label htmlFor="schoolName" className="text-lg text-custom_gray">School Name</label>
                                        <input type="text" name="schoolName" id="schoolName"  value={education.schoolName} onChange={handleChange}  className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
                                    </div>
                                    <div className="mt-2 flex flex-col">
                                        <label htmlFor="date" className="text-lg text-custom_gray">Years</label>
                                        <Calendar name="date" value={education.date} onChange={handleChange} maxDate={new Date()} view="year" dateFormat="yy"  selectionMode="range" readOnlyInput hideOnRangeSelection showButtonBar/>
                                    </div>
                                </>
                            )}


                            {type === "certificate" && (
                                <>
                                    <div className="flex flex-col">
                                        <label htmlFor="certificateName" className="text-lg text-custom_gray">Name of Certificate</label>
                                        <input type="text" name="certificateName" id="certificateName" value={education.certificateName} onChange={handleChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
                                    </div>
                                    <div className="mt-2 flex flex-col">
                                        <label htmlFor="company" className="text-lg text-custom_gray">Issuing Company</label>
                                        <input type="text" name="company" id="company" value={education.company} onChange={handleChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray"/>
                                    </div>
                                    <div className="mt-2 flex flex-col">
                                        <label htmlFor="date" className="text-lg text-custom_gray">Issuing Date</label>
                                        <Calendar name="date" value={education.date} onChange={handleChange} maxDate={new Date()} dateFormat="mm/dd/yy"  readOnlyInput hideOnRangeSelection showButtonBar/>
                                    </div>

                                </>
                            )}
                            {type === "skill" && (
                            <>
                                <div className="flex flex-col">
                                    <label htmlFor="skillName" className="text-lg text-custom_gray">Name</label>
                                    <input type="text" name="skillName" id="skillName" value={education.skillName} onChange={handleChange} className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 mt-2 text-lg text-custom_gray" />
                                </div>
                                <div className="mt-2 flex flex-col">
                                    <label htmlFor="level" className="text-lg text-custom_gray">Level</label>
                                    <select name="level" id="level" value={education.level} onChange={handleChange} className="border border-black p-2 bg-white rounded mb-4 text-xl my-2 text-custom_gray">
                                        <option value="" disabled>Select skill level</option>
                                        <option value="Begginer">Begginer</option>
                                        <option value="Intermidient">Intermidient</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </>
                        )}
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
    )
}