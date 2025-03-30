import { formatDateBetter } from "../../util/formatDate"


export default function ShowJob({ job }) {
    return(
        <div className="lg:basis-2/3 w-full">
            <h1 className="text-3xl text-custom_gray font-bold">{job.jobTitle}</h1>
            <p className="text-custom_red text-sm">{job.address}</p>
            <div className="flex flex-col justify-between mt-4 lg:w-[80%] w-full"> 
                <h3 className="text-xl text-custom_gray font-bold ">About the job</h3>
                <p className="text-custom_gray text-justify">{job.description}</p>
            </div>
            <div className="flex flex-row  justify-between mt-4 lg:w-[50%] items-c">
                <h3 className="text-xl text-custom_gray">Salary:</h3>
                <p className="text-xl text-custom_gray align-middle mt-auto">{job.salary.currency}{job.salary.amount}/year</p>
            </div>
            <div className="flex flex-row justify-between mt-1 lg:w-[50%]">
                <h3 className="text-xl text-custom_gray">Start Date:</h3>
                <p className=" text-custom_gray my-auto">{formatDateBetter(job.date)}</p>
            </div>
            <div className="flex flex-row mt-4 lg:w-[50%] justify-between">
                <h3 className="text-xl text-custom_gray">Employment Type:</h3>
                <p className="text-custom_red my-auto">{job.employmentType}</p>
            </div>
            <div className="flex flex-row mt-4 lg:w-[50%] justify-between">
                <h3 className="text-xl text-custom_gray">Experience:</h3>
                <p className="text-custom_gray my-auto">{job.experience} years</p>
            </div>
            <div className="flex flex-col mt-4 lg:w-[50%]">
                <h3 className="text-xl text-custom_gray">Requirements:</h3>
                {job.requirements.map((requirement, index) => (
                    <p className="text-custom_gray my-auto" key={index}>{requirement.requirementName} - <span className="text-custom_red">{requirement.requirementType}</span></p>
                ))}
            </div>
            <div className="flex flex-col mt-4 lg:w-96">
                <h3 className="text-xl text-custom_gray">Desired skills:</h3>
                {job.skills.map((skill, index) => (
                    <p className="text-custom_gray" key={index}>{skill.skillName} - <span className="text-custom_red">{skill.skillLevel}</span></p>
                ))}
            </div>
        </div>
    )
}