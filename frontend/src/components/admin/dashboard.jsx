export default function Dashboard({dataLength}) {
    return(
        <div className="container border rounded-lg shadow-md bg-white p-8 mx-auto">
            <h1 className="text-2xl text-custom_gray font-bold">Admin Dashboard</h1>
            <p className="text-custom_gray text-lg ">Welcome, Admin!</p>

            <div className="flex flex-col gap-4 mt-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl text-custom_gray font-bold">Total Users</h2>
                    <p className="text-custom_gray text-lg">{dataLength.user}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl text-custom_gray font-bold">Total Job Offers</h2>
                    <p className="text-custom_gray text-lg">{dataLength.jobOffers}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl text-custom_gray font-bold">Total Reports</h2>
                    <p className="text-custom_gray text-lg">{dataLength.reports}</p>
                </div>
            </div>
        </div>
    )
}
