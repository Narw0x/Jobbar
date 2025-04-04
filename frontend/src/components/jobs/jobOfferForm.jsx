import { Calendar } from "primereact/calendar";

import Button from "../button";
import Autocomplete from "../autocomplete";
import JobOfferSkills from "./jobOfferSkills";
import JobOfferRequirements from "./jobOfferRequirements";


export default function JobOfferForm({jobOffer, handleChange, setJobOffer, handleSkillChange, addSkill, handleRequirementChange, addRequirement, handleSalaryChange, edit=false, handleDelete = () => {}}) { 
    return(
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
                <label htmlFor="field" className="text-lg text-custom_gray">Field</label>
                <select 
                    name="field" 
                    id="field" 
                    className="bg-white text-custom_gray focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg"
                    onChange={handleChange}
                    value={jobOffer.field}
                >
                    <option value="All">All</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
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
                    {jobOffer.skills.map((skill, index) => <JobOfferSkills key={index} skill={skill} index={index} setJobOffer={setJobOffer} handleSkillChange={handleSkillChange} />)}
                </div>
                <div className="flex flex-row justify-end mt-4">
                    <Button
                        btnStyle="red-hover"
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
                    {jobOffer.requirements.map((requirement, index) => <JobOfferRequirements key={index} requirement={requirement} setJobOffer={setJobOffer} index={index} handleRequirementChange={handleRequirementChange} />)}
                </div>
                <div className="flex flex-row justify-end mt-4">
                    <Button 
                        btnStyle="red-hover" 
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
            {edit && (
                <div className='mt-4'>
                    <Button 
                        btnStyle="red-hover"
                        type="button"
                        onClick={handleDelete}
                    >
                        Delete Job Offer
                    </Button>
                </div>
            )}
        </div>
    )
}