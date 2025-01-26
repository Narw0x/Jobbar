import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from "../components/button";
import { bouncy } from "ldrs";


export default function AdminReportsPage() {

    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    bouncy.register();

    const adminState = useSelector((state) => state.admin);

    useEffect(() => {
        setIsLoading(true);
        axios.get('http://localhost:4000/api/admin/reports', {
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                setReports(res.data.payload.reports);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [adminState.adminToken]);


    return (
        <section className="flex flex-col items-center justify-center bg-custom_bg_gray">
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8">
                <h1 className="text-2xl font-bold text-custom_gray">Reports</h1>
                <div>
                    {isLoading && (
                        <div className="flex justify-center p-8">
                            <l-bouncy
                            size="45"
                            speed="1.75" 
                            color="gray" 
                            ></l-bouncy>
                        </div>
                    )}
                    {reports.length !== 0  && (
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
                                                style="red-hover"
                                                redirectPath={`/admin/reports/${rep._id}`}
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
                    )}
                    {reports.length === 0 && (
                        <div className="flex justify-center p-8">
                            <p className="text-custom_gray">No reports found</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}