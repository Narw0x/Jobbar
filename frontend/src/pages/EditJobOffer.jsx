import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateUser } from "../store/slices/authSlice";

import { Calendar } from "primereact/calendar";

import Autocomplete from "../components/autocomplete";
import axios from 'axios';



const pathExperienceImage = "../../../experienceImage.svg";

export default function EditJobOfferPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const authState = useSelector((state) => state.auth);

    const [jobOffer, setJobOffer] = useState({
        jobTitle: '',
        address: '',
        employmentType: 'Full-time',
        date: '',
        description: '',
        experience: '',
        skills: [
            {
                skillName: '',
                skillLevel: 'Beginner'
            }
        ],
        requirements: [
            { requirementName: '', requirementType: 'Beginner' }
        ],
        salary: {
            amount: '',
            currency: '€'
        }

    });

    useEffect(() => {
        if (params.jobId) {
            axios.get(`http://localhost:4000/api/job/edit/${params.jobId}`, {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                    id: authState.user._id
                }
            }).then((response) => {
                if (response.status === 200) {
                    const date = new Date(response.data.payload.job.date);
                    setJobOffer(prevState => ({
                        ...prevState,
                        ...response.data.payload.job,
                        date
                    }));
                }
            }).catch((error) => {
                console.log('neviem');
                
                console.log(error);
            });
        }
    }, [params.jobId, authState.token, authState.user._id, dispatch, navigate]);

        

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

    const addRequirement = () => {
        setJobOffer(prevState => ({
            ...prevState,
            requirements: [
                ...prevState.requirements,
                { requirementName: '', requirementType: 'Beginner' }
            ]
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

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setJobOffer((prevState) => ({
            ...prevState,
            salary: {
                ...prevState.salary,
                [name]: value
            }
        }));
    };

    const handleDelete = async () => {
        await axios.put(`http://localhost:4000/api/job/delete/${params.jobId}`, {}, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id,
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Job offer deleted successfully' } });
                dispatch(updateUser(response.data.payload.user));
            }
        }).catch((error) => {
            console.log(error);
            
        });
    };




    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...jobOffer,
        }

        axios.put(`http://localhost:4000/api/job/edit/${params.jobId}`, data, {
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

            if(error.response.statusText === 'Unauthorized'){
                dispatch(logout());
                navigate(`/login/user`, { state: { type: 'error', message: 'Session expired. Please login again.' } });
            }else{
                navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Failed to add job offer' } });
            }
        });
        

    };


  return (
    <section className="bg-custom_bg_gray py-8">
        <div className="max-w-[1440px] mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl text-custom_gray font-bold ">Create a Job Offer</h1>
            <div>
                <form className="flex flex-row mt-4" onSubmit={handleSubmit}>
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
                                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg"
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
                                    <div key={index}  className='flex flex-row justify-between gap-4' >
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
                            <div className="flex flex-row justify-end">
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
                                    <div key={index}  className='flex flex-row justify-between gap-4' >
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
                                            <option value="Begginer">Begginer</option>
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
                            <div className="flex flex-row justify-end">
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