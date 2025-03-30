import Button from "../button"
import { formatDateBetter } from "../../util/formatDate"


export default function JobItem({ job, isCurrentUser = false, manage = false }) {
    return(
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 ">
            <h3 className="text-md text-custom_gray font-semibold text-xl">{job.jobTitle}</h3>
            <div className="flex flex-col justify-between">
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex flex-row w-full lg:gap-16 justify-between">
                        <p className=" text-custom_gray font-semibold">Salary:</p>
                        <p className=" text-custom_red text-sm flex justify-center items-center">{job.salary.amount}{job.salary.currency}/<span className="text-sm">Year</span> </p>
                    </div>
                    <div className="flex flex-row  w-full items-center justify-between">
                        <p className=" text-custom_gray font-semibold">Location:</p>
                        <div className="max-w-24">
                            <p className=" text-custom_red truncate text-sm">{job.address}</p>
                        </div>
                    </div>
                    <div className="flex flex-row  w-full justify-end">
                        <p className="text-sm text-custom_gray">{formatDateBetter(job.date)}</p>
                    </div>
                </div>
                <div className="flex flex-row gap-4 mt-2 justify-end">
                    {isCurrentUser && (
                        <div className="flex flex-grow">
                            <Button
                                btnStyle={"red-default"}
                                redirectPath={`/profile/job/edit/${job._id}`}
                            >
                                Edit
                            </Button>
                        </div>
                    )}
                    {manage ? (
                        <div className="flex flex-grow">
                            <Button
                                btnStyle="red-default"
                                redirectPath={`/job/manage/${job._id}`}
                            >
                                Manage
                            </Button>
                        </div>
                    ) :(
                        <div>
                            <Button
                                btnStyle="red-hover"
                                redirectPath={`/job/${job._id}`}
                            >
                                View
                            </Button>
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    )
}