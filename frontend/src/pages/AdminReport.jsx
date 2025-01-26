import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../components/button";

const pathExperienceImage = "../../../experienceImage.svg";

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
                <h1 className="font-bold text-custom_gray text-2xl">Reported {report.reportedEntityType}</h1>
                <div className="py-8 flex flex-row">
                    <div className="flex flex-col space-y-4 basis-1/2 justify-between">
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-lg font-bold text-custom_gray">Reported {report.reportedEntityType} name: <span className="text-custom_red font-normal">{report.reportedEntityType === 'user' ? report.reportedEntity.firstName : report.reportedEntity.companyName}</span></h2>
                            <h2 className="text-lg font-bold text-custom_gray">Reported by name: <span className="text-custom_red font-normal">{report.reportedByType === 'user' ? report.reportedBy.firstName : report.reportedBy.companyName}</span></h2>
                            <div>
                                <p className="text-custom_gray font-bold text-lg">Reason:</p>
                                <div  className="border border-gray-300 p-4 rounded-lg">
                                    <p className="text-custom_gray">{report.reason}</p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 justify-start">
                                <Button
                                    style={'red-hover'}
                                    redirectPath={`/admin/users/edit/${report.reportedEntity._id}`}
                                >
                                    Edit Reported Profile
                                </Button>
                                <Button
                                    style={'red-hover'}
                                    redirectPath={`/admin/users/${report.reportedEntity._id}`}
                                >
                                    View Reported Profile
                                </Button>  
                            </div>
                        </div>
                        <div className="flex flex-row gap-4 justify-start">
                            <Button
                                style={'red-hover'}
                                redirectPath={`/admin/users/edit/${report.reportedEntity._id}`}
                            >
                                Approve
                            </Button>
                            <Button
                                style={'red-default'}
                                redirectPath={`/admin/users/${report.reportedEntity._id}`}
                            >
                                Decline
                            </Button>  
                            <Button 
                                style="red-default"
                                type="button"
                                onClick={() => {
                                    navigate(`/admin/reports/${reportId}`);
                                }}
                            >
                                Back
                            </Button>
                        </div>
                        
                    </div>
                    <div className="flex flex-col flex-1 mt-[-1rem] basis-1/2">
                        <div className="flex flex-col justify-end flex-wrap">
                            <img src={pathExperienceImage} alt="" /> 
                            <p className="text-right mt-[-2rem]">Designed by 
                            <a 
                                href="https://www.freepik.com" 
                                className="text-custom_red p-2" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Freepik
                            </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}