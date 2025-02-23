import Button from "../button"
import { formatDate, formatDateBetter } from "../../util/formatDate"

export default function ProfileEducation({ education, isCurrentUser }) {

    if(education === undefined) {
        return
    }

    return (
        <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white mt-4 p-8">
            {(education.school.length === 0 && education.certificate.length === 0 && education.skill.length === 0) ? (
                <div className="flex justify-between align-middle">
                    <div>
                        <h2 className="text-lg text-custom_gray font-semibold">Education</h2>
                        <p className="text-sm text-gray-500">
                            No education
                        </p>
                    </div>
                    {isCurrentUser && (
                        <div className="flex justify-end mt-4 mb-0">
                            <Button btnStyle="red-hover" redirectPath="/profile/education/add">
                                Add new
                            </Button>
                        </div>
                    )} 
                </div>
            ) : (
                <>
                    <h2 className="text-lg text-custom_gray font-semibold">Education</h2>
                    <div>
                        {education.school && education.school.length > 0 && (<p className="text-sm text-gray-500 mt-4">School</p>) }
                        {education.school.map((edu, idx) => (
                            <div key={edu.educationId} className="border-b border-gray-200">
                                <div className="flex justify-between my-2">
                                    <div>
                                        <h3 className="text-md text-custom_gray font-semibold">{edu.schoolName}</h3>
                                        <p className="text-sm text-custom_red">{formatDate(edu.date[0])} - {formatDate(edu.date[1])}</p>
                                    </div>
                                    {isCurrentUser && (
                                        <div>
                                            <Button
                                                btnStyle="red-default"
                                                redirectPath={`/profile/education/edit/${edu.educationId}`}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))} 
                    </div>
                    <div>
                        {education.certificate && education.certificate.length > 0 && (<p className="text-sm text-gray-500 mt-4">Certificate</p>) }
                        {education.certificate.map((edu, idx) => (
                            <div key={edu.educationId} className="border-b border-gray-200">
                                <div className="flex justify-between my-2">
                                    <div>
                                        <h3 className="text-md text-custom_gray font-semibold">{edu.certificateName}</h3>
                                        <p className="text-sm text-custom_gray">{edu.company}</p>
                                        <p className="text-sm text-custom_red">{formatDateBetter(edu.date)}</p>
                                    </div>
                                    {isCurrentUser && (
                                        <div className=" mt-auto">
                                            <Button
                                                btnStyle="red-default"
                                                redirectPath={`/profile/education/edit/${edu.educationId}`}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))} 
                    </div>
                    <div>
                        {education.skill && education.skill.length > 0 && (<p className="text-sm text-gray-500 mt-4">Skill</p>) }
                        {education.skill.map((edu, idx) => (
                            <div key={edu.educationId} className="border-b border-gray-200">
                                <div className="flex justify-between my-2">
                                    <div>
                                        <h3 className="text-md text-custom_gray font-semibold">{edu.skillName}</h3>
                                        <p className="text-sm text-custom_red">{edu.level}</p>
                                    </div>
                                    {isCurrentUser && (
                                        <div>
                                            <Button
                                                btnStyle="red-default"
                                                redirectPath={`/profile/education/edit/${edu.educationId}`}
                                            >
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isCurrentUser && (
                            <div className="flex justify-end mt-4 mb-0">
                                <Button
                                    btnStyle="red-hover"
                                    redirectPath="/profile/education/add"
                                >
                                    Add new
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )}