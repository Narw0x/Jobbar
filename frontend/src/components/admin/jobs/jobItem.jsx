import { formatDateBetter } from "../../../util/formatDate"
import Button from "../../../components/button";

export default function AdminJobItem({ job }) {
    return (
        <div key={job._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 ">
            <h3 className="text-md text-custom_gray font-semibold text-xl">{job.jobTitle}</h3>
            <div className="flex flex-col justify-between">
                <div className="flex flex-col items-start space-y-2">
                    <div className="flex flex-row w-full gap-16 justify-between">
                        <p className=" text-custom_gray font-semibold">Salary:</p>
                        <p className=" text-custom_red">{job.salary.amount}{job.salary.currency}/<span className="text-sm">Year</span> </p>
                    </div>
                    <div className="flex flex-row  w-full justify-between">
                        <p className=" text-custom_gray font-semibold">Location:</p>
                        <div className="max-w-32">
                            <p className=" text-custom_red truncate">{job.address}</p>
                        </div>
                    </div>
                    <div className="flex flex-row  w-full justify-end">
                        <p className="text-sm text-custom_gray">{formatDateBetter(job.date)}</p>
                    </div>
                    
                </div>
                <div className="flex flex-row gap-4 mt-2 justify-end">
                    <div className="flex flex-grow">
                        <Button
                            btnStyle="red-default"
                            redirectPath={`/xyz/jobs/edit/${job._id}`}
                        >
                            Edit
                        </Button>
                    </div>
                    <div>
                        <Button
                            btnStyle="red-hover"
                            redirectPath={`/xyz/jobs/${job._id}`}
                        >
                            View
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}