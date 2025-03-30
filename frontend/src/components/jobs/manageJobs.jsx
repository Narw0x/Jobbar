import JobItem from "./jobItem";
import Loading from "../loading";

export default function ManageJobsComponent({ jobs }) {

    return (
        <>
            {!jobs && <Loading />}
            {jobs  &&  (
                <>
                    <h2 className="text-xl text-custom_gray font-semibold">Job Offers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                        {jobs.map((job) => (
                            <JobItem
                                key={job._id}
                                job={job}
                                manage={true}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
)}