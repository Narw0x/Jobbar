import AdminJobItem from "./jobItem";

export default function AdminJobLayout({jobOffers}) {
    return (
        <div className="mt-8">
            <h2 className="text-xl text-custom_gray font-bold ">Job Offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {jobOffers.map((job, idx) => <AdminJobItem key={idx} job={job} />)}
            </div>
        </div>
    )
}