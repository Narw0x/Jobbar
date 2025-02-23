import Button from "../button"
import { formatDate } from "../../util/formatDate"


export default function ProfileExperience({ experience, isCurrentUser }) {

    if(experience === undefined) {
        return null;
    }

    return(
        <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
            {(Array.isArray(experience) && experience.length === 0) ? (
                <>
                    <div className="flex justify-between align-middle">
                        <div>
                            <h2 className="text-lg text-custom_gray font-semibold">Experience</h2>
                            <p className="text-sm text-gray-500">
                                No experience
                            </p>
                        </div>
                        {isCurrentUser && (
                            <div className="flex justify-end mt-4 mb-0">
                                <Button btnStyle="red-hover" redirectPath="/profile/experience/add">
                                    Add new
                                </Button>
                            </div>
                        )} 
                    </div>
                </>
            ) : (
                <div>
                    <h2 className="text-lg text-custom_gray font-semibold">Experience</h2>
                    {experience.map((exp, idx) => (
                        <div key={exp.experienceId} className="border-b border-gray-200 py-4">
                            <h3 className="text-md text-custom_gray font-semibold">{exp.company}</h3>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-custom_red">{exp.jobTitle}</p>
                                    <p className="text-sm text-gray-500">{exp.description}</p>
                                </div>
                                <div className="flex sm:flex-row flex-col justify-end text-end gap-4">
                                    <div className="flex flex-col justify-end text-end">
                                        <p className="text-sm text-gray-500">{formatDate(exp.date[0])} - {formatDate(exp.date[1])}</p>
                                        <p className="text-sm text-gray-500">{exp.employmentType}</p>
                                    </div>
                                    {isCurrentUser && (
                                        <div>
                                            <Button
                                                btnStyle="red-default"
                                                redirectPath={`/profile/experience/edit/${exp.experienceId}`}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isCurrentUser && (
                        <div className="flex justify-end mt-4 mb-0">
                            <Button
                                btnStyle="red-hover"
                                redirectPath="/profile/experience/add"
                            >
                                Add new
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )}