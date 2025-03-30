import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { bouncy } from "ldrs";
import Loading from "../../../components/loading";
import { Helmet } from "react-helmet";
import ShowReports from "../../../components/admin/reports/showReports";


export default function AdminReportsPage() {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    bouncy.register();

    const adminState = useSelector((state) => state.admin);

    useEffect(() => {
        setIsLoading(true);
        axios.get('https://jobbar-5m8u.onrender.com/api/admin/reports', {
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
            <Helmet>
                <title>Admin Reports</title>
                <meta name="description" content="Admin Reports" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8">
                <h1 className="text-2xl font-bold text-custom_gray">Reports</h1>
                <div>
                    {isLoading && <Loading />}
                    {reports.length !== 0  && <ShowReports reports={reports} />}
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