import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AdminReportPage() {
    const { reportId } = useParams();
    const adminState = useSelector((state) => state.admin); 
    const [report, setReport] = useState({
        reportedEntity: '',
        reportedEntityType: '',
        reportedBy: '',
        reportedByType: '',
        reason: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:4000/api/admin/reports/${reportId}`,
            {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`
                }
            }
        )
            .then((res) => {
                setReport(res.data.payload.report);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [reportId]);

    console.log(report);
    


    return(
        <section className="flex flex-col items-center justify-center bg-custom_bg_gray">
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8">

            </div>
        </section>
    )
}