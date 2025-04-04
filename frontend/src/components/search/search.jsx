import Loading from "../loading"
import Button from "../button";
import { formatDateBetter } from "../../util/formatDate";

export default function SearchJobSearch({isLoading, jobs, setPage, page}) {
    return(
        <div>
            <h1 className="text-custom_gray text-4xl font-bold">Search</h1>
            <p className="text-custom_gray">Find your dream job</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-2">
                    {isLoading && <Loading />}
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 ">
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
                                <div className="flex flex-row gap-4 mt-2 justify-start">
                                    <div>
                                        <Button
                                            btnStyle="red-hover"
                                            redirectPath={`/search/job/${job._id}`}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                    {jobs.length === 0 && !isLoading && (
                        <div className="flex justify-center p-8">
                            {page === 1 && (<p className="text-custom_gray">No jobs found</p>)}
                            {page !== 1 && (<p className="text-custom_gray">No more jobs found</p>)}
                        </div>
                    )}
                    {jobs && (
                        <div className="flex justify-between pt-4">
                            <div>
                                {page === 1 ? null : <Button
                                    btnStyle="gray-default"
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>}
                            </div>
                            
                            {jobs.length === 10 && <Button
                                btnStyle="red-hover"
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </Button>}
                        </div>
                    )}
                </div>
        </div>
    )
}