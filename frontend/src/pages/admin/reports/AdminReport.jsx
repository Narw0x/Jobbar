import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../../../components/button";
import Image from "../../../components/image";


export default function AdminReportPage() {
    const { reportId } = useParams();
    const adminState = useSelector((state) => state.admin); 
    const navigate = useNavigate();
    const [report, setReport] = useState({
        reportedEntity: '',
        reportedEntityType: '',
        reportedBy: '',
        reportedByType: '',
        reason: ''
    });

    useEffect(() => {
        axios.get(`https://jobbar-5m8u.onrender.com/api/admin/reports/${reportId}`,
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
    }, [reportId, adminState.adminToken]);

    useEffect(() => {
        document.title = "Report | Jobbar";
    }, []);


    const handleResponse = (status) => {
        axios.put(`https://jobbar-5m8u.onrender.com/api/admin/reports/${reportId}`, {status},
            {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`
                }
            }
        )
            .then((res) => {
                navigate('/xyz/reports');
            })
            .catch((err) => {
                console.log(err);
            })
    }
    


    return(
        <section className="flex flex-col items-center justify-center bg-custom_bg_gray">
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8">
                <h1 className="font-bold text-custom_gray text-2xl">Reported {report.reportedEntityType}</h1>
                <div className="py-8 flex flex-col gap-4">
                    <div className="flex flex-col  lg:flex-row space-y-4 basis-1/2 justify-between">
                        <div className="flex flex-col space-y-4 basis-2/3">
                            <h2 className="text-lg font-bold text-custom_gray">Reported {report.reportedEntityType} name: <span className="text-custom_red font-normal">{report.reportedEntityType === 'user' ? report.reportedEntity.firstName : report.reportedEntity.companyName}</span></h2>
                            <h2 className="text-lg font-bold text-custom_gray">Reported by: <span className="text-custom_red font-normal">{report.reportedByType === 'user' ? report.reportedBy.firstName : report.reportedBy.companyName}</span></h2>
                            <div>
                                <p className="text-custom_gray font-bold text-lg">Reason:</p>
                                <div  className="border border-gray-300 p-4 rounded-lg">
                                    <p className="text-custom_gray">{report.reason}</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 justify-start">
                                <Button
                                    btnStyle={'gray-hover'}
                                    redirectPath={`/xyz/users/edit/${report.reportedEntity._id}`}
                                >
                                    Edit Reported Profile
                                </Button>
                                <Button
                                    btnStyle={'gray-default'}
                                    redirectPath={`/xyz/users/${report.reportedEntity._id}`}
                                >
                                    View Reported Profile
                                </Button>  
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 basis-1/3">
                            <div className="flex flex-col justify-end flex-wrap">
                                <Image />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 justify-start ">
                        <Button
                            btnStyle={'red-hover'}
                            onClick={() => handleResponse('Approved')}
                        >
                            Approve
                        </Button>
                        <Button
                            btnStyle={'red-default'}
                            onClick={() => handleResponse('Declined')}
                        >
                            Decline
                        </Button>  
                        <Button 
                            btnStyle="red-default"
                            type="button"
                            onClick={() => {
                                navigate(`/xyz/reports/`);
                            }}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}