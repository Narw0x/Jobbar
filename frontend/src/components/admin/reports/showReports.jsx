import Button from "../../button"

export default function ShowReports({ reports }) {
    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {reports.map((rep, idx) => (
                <div key={rep._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 ">
                    <h3 className="text-md text-custom_gray font-semibold text-xl">Reported {rep.reportedEntityType}</h3>
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col gap-2 mt-2">
                            <p>Reported by: <span className="text-custom_red">{rep.reportedBy.email}</span></p>
                            {rep.reportedEntityType === 'user' && (
                                <p>User: <span className="text-custom_red">{rep.reportedEntity.firstName} {rep.reportedEntity.lastName}</span></p>
                            )}
                            {rep.reportedEntityType === 'company' && (
                                <p>Company: <span className="text-custom_red">{rep.reportedEntity.companyName}</span></p>
                            )}

                        </div>
                        <div className="flex flex-row gap-2 mt-2 justify-end">
                            {rep.reportStatus === 'Pending' && (<Button
                                btnStyle="red-hover"
                                redirectPath={`/xyz/reports/${rep._id}`}
                            >
                                View
                            </Button>)}
                            {rep.reportStatus !== 'Pending' && (
                                <p className="text-custom_gray">Status: {rep.reportStatus}</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}