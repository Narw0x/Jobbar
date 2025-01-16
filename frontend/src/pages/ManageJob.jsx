import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../components/button";

export default function ManageJobPage() {

    const {jobId} = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/job/applicants/${jobId}`)
        .then(response => {
            
            setApplicants(response.data.payload.applicants);
        }).catch(err => {
            console.log(err);
        });
            
    }, [jobId]);

    const handleAccept = (id) => {
        return () => {
            axios.post(`http://localhost:4000/api/job/accept/${jobId}`, {
                applicantId: id
            }).then(response => {
                setApplicants(applicants.filter(applicant => applicant.applicant._id !== id));
            }).catch(err => {
                console.log(err);
            });
        }
    }




    

    return(
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white">
                <form className="p-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex flex-row gap-4 justify-between">
                                <div  className="flex flex-row justify-between basis-1/2">
                                    <div className="flex basis-1/2 text-left  font-bold text-xl text-custom_gray">
                                        Applicant Name
                                    </div>
                                    <div className="flex basis-1/2 text-left font-bold text-xl text-custom_gray">
                                        Email
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        {applicants && applicants.map(applicant => (
                            <div className="flex flex-row gap-4 border-b py-2 justify-between">
                                <div className="flex flex-row justify-between basis-1/2 items-center">
                                    <div className="flex basis-1/2 text-left">
                                        {applicant.applicant.firstName} {applicant.applicant.lastName}
                                    </div>
                                    <div className="flex basis-1/2 text-left">
                                        {applicant.applicant.email}
                                    </div>
                                </div>
                                
                                <div className="flex gap-4 justify-end basis-1/2">
                                    <Button
                                        style='red-default'
                                        onClick={() => navigate(`/profile/${applicant.applicant._id}`)}
                                    >
                                        View Profile
                                    </Button>
                                    <Button
                                        style='red-hover'
                                        onClick={handleAccept(applicant.applicant._id)}
                                    >
                                        Accept
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </form>
            </div>
        </section>
    );
}