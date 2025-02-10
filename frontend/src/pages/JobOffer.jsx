import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import {  updateUser } from "../store/slices/authSlice";
import { isValidText, isValidAddress } from "../util/validation";
import { useEffect } from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { useLocation } from 'react-router-dom';


import { Calendar } from "primereact/calendar";

import Autocomplete from "../components/autocomplete";
import axios from 'axios';



const pathExperienceImage = "../../../experienceImage.svg";

export default function JobOfferPage() {

    const toast = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [jobOffer, setJobOffer] = useState({
        jobTitle: '',
        employmentType: 'Full-time',
        date: '',
        description: '',
        experience: '0-1',
        requirements: [
            {
                requirementName: '',
                requirementType: 'Required'
            }
        ],
        skills: [
            {
                skillName: '',
                skillLevel: 'Beginner'
            }
        ],
        salary: {
                currency: '€',
                amount: 0,
        },
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobOffer((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRequirementChange = (index, field, value) => {
        setJobOffer(prevState => ({
            ...prevState,
            requirements: prevState.requirements.map((req, i) => 
                i === index ? { ...req, [field]: value } : req
            )
        }));
    };

    const handleSkillChange = (index, field, value) => {
        setJobOffer(prevState => ({
            ...prevState,
            skills: prevState.skills.map((req, i) =>
                i === index ? { ...req, [field]: value } : req
            )
        }));

    };

    const addSkill = () => {
        setJobOffer(prevState => ({
            ...prevState,
            skills: [
                ...prevState.skills,
                { skillName: '', skillLevel: 'Beginner' }
            ]
        }));
    };

    const addRequirement = () => {
        setJobOffer(prevState => ({
            ...prevState,
            requirements: [
                ...prevState.requirements,
                { requirementName: '', requirementType: 'Beginner' }
            ]
        }));
    };

    const handleSalaryChange = (e) => {
        let { name, value } = e.target;

        if (name === 'amount') {
            value = Number(value);
        }

        setJobOffer((prevState) => ({
            ...prevState,
            salary: {
                ...prevState.salary,
                [name]: value
            }
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...jobOffer,
        }

        if(!isValidText(data.jobTitle)){
            setMessageState({type: 'error', message: 'Please provide a valid job title'});
            return;
        }

        if(!isValidAddress(data.address)){
            setMessageState({type: 'error', message: 'Please provide a valid address'});
            return;
        }
        
        if(!isValidText(data.description, 1, 500)){
            setMessageState({type: 'error', message: 'Please provide a valid description'});
            return;
        }

        if(!isValidText(data.experience)){
            setMessageState({type: 'error', message: 'Please provide a valid experience'});
            return;
        }

        if(+data.salary.amount < 1){
            setMessageState({type: 'error', message: 'Please provide a valid salary'});
            return;
        }

        if(data.date === null || data.date.length === 0){
            setMessageState({type: 'error', message: 'Please provide a valid date'});
            return;
        }

        if(data.skills.length < 1){
            for (const skill of data.skills) {
                if(!isValidText(skill.skillName)){
                    setMessageState({type: 'error', message: 'Please provide a valid skill name'});
                    return;
                }
            }
        }

        if(data.requirements.length < 1){
            for (const requirement of data.requirements) {
                if(!isValidText(requirement.requirementName)){
                    setMessageState({type: 'error', message: 'Please provide a valid requirement name'});
                    return;
                }
            }
        }



        axios.post(`https://jobbar-5m8u.onrender.com/api/job/create`, data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then((response) => {
            
            if (response.status === 201) {
                dispatch(updateUser(response.data.payload.user));
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Job offer added successfully' } });
            }
        }).catch((error) => {
            console.log(error);
        });
        

    };

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
    <section className="bg-custom_bg_gray py-8 ">
        <Toast ref={toast} />
        <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl text-custom_gray font-bold ">Create a Job Offer</h1>
            <div>
                <form className="flex md:flex-row flex-col mt-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col flex-1 mt-2">
                        <div className="flex flex-col">
                            <label htmlFor="jobTitle" className="text-lg text-custom_gray">Job Title</label>
                            <input 
                                type="text" 
                                name="jobTitle" 
                                id="jobTitle" 
                                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg"
                                onChange={handleChange}
                                value={jobOffer.jobTitle}
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="text-lg text-custom_gray">Location</label>
                            <Autocomplete
                                value={jobOffer.address}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="flex flex-col mt-4">
                            <label htmlFor="employmentType" className="text-lg text-custom_gray">Employment Type</label>
                            <select 
                                name="employmentType" 
                                id="employmentType" 
                                className="bg-white text-custom_gray focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg"
                                onChange={handleChange}
                                value={jobOffer.employmentType}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Temporary">Temporary</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="date" className="text-lg text-custom_gray">Starting date</label>
                            <Calendar name="date" value={jobOffer.date} onChange={handleChange} minDate={new Date()} dateFormat="mm/dd/yy"  readOnlyInput hideOnRangeSelection showButtonBar/>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="description" className="text-lg text-custom_gray">Description</label>
                            <textarea 
                                name="description" 
                                id="description" 
                                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray p-2 my-2 text-lg w-full resize-none rounded-lg"
                                onChange={handleChange}
                                value={jobOffer.description}
                            />
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="experience" className="text-lg text-custom_gray">Years of Experience</label>
                            <select
                                name="experience"
                                id="experience"
                                className="bg-white text-custom_gray focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-xl"
                                onChange={handleChange}
                                value={jobOffer.experience}
                            >
                                <option value="0-1">0-1</option>
                                <option value="1-3">1-3</option>
                                <option value="3-5">3-5</option>
                                <option value="5+">5+</option>
                            </select>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="skills"  className="text-lg text-custom_gray">Skills</label>
                            <div>
                                {jobOffer.skills.map((skill, index) => (
                                    <div key={index}  className='flex md:flex-row flex-col justify-between md:gap-4' >
                                        <input 
                                            type="text" 
                                            name="skillName" 
                                            id={`skillName-${index}`} 
                                            className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg flex-1"
                                            onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)}
                                            value={skill.skillName}
                                        />
                                        <select 
                                            name="skillLevel" 
                                            id={`skillLevel-${index}`} 
                                            className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-xl "
                                            onChange={(e) => handleSkillChange(index, 'skillLevel', e.target.value)}
                                            value={skill.skillLevel}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                        {index > 0 && (
                                            <div className="flex flex-col justify-center">   
                                                <Button 
                                                    style="red-hover" 
                                                    type="button" 
                                                    onClick={() => {
                                                        setJobOffer(prevState => ({
                                                            ...prevState,
                                                            skills: prevState.skills.filter((req, i) => i !== index)
                                                        }));
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-row justify-end mt-4">
                                <Button
                                    style="red-hover"
                                    type="button"
                                    onClick={addSkill}
                                >
                                    Add Skill
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="requirements" className="text-lg text-custom_gray">Requirements</label>
                            <div>
                                {jobOffer.requirements.map((requirement, index) => (
                                    <div key={index}  className='flex md:flex-row flex-col justify-between md:gap-4' >
                                        <input 
                                            type="text" 
                                            name="requirementName" 
                                            id={`requirementName-${index}`} 
                                            className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg flex-1"
                                            onChange={(e) => handleRequirementChange(index, 'requirementName', e.target.value)}
                                            value={requirement.requirementName}
                                        />
                                        <select 
                                            name="requirementType" 
                                            id={`requirementType-${index}`} 
                                            className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-xl "
                                            onChange={(e) => handleRequirementChange(index, 'requirementType', e.target.value)}
                                            value={requirement.requirementType}
                                        >
                                            <option value="required">Required</option>
                                            <option value="optional">Optional</option>
                                        </select>
                                        {index > 0 && (
                                            <div className="flex flex-col justify-center">   
                                                <Button 
                                                    style="red-hover" 
                                                    type="button" 
                                                    onClick={() => {
                                                        setJobOffer(prevState => ({
                                                            ...prevState,
                                                            requirements: prevState.requirements.filter((req, i) => i !== index)
                                                        }));
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}



                                
                            </div>
                            <div className="flex flex-row justify-end mt-4">
                                <Button 
                                    style="red-hover" 
                                    type="button" 
                                    onClick={addRequirement}
                                >
                                    Add Requirement
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col mt-4">
                            <label htmlFor="salary" className="text-lg text-custom_gray">Salary</label>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="relative flex items-center flex-1">
                                    <span className="absolute left-3 text-gray-500">{jobOffer.salary.currency}</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        id="amount"
                                        className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 pl-6 my-2 text-lg flex-1"
                                        onChange={handleSalaryChange}
                                        value={jobOffer.salary.amount}
                                    />
                                </div>
                                <p className='text-xl text-custom_gray'>Year</p>
                            </div>
                            
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