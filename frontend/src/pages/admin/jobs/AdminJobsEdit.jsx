import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { useLocation } from "react-router";

import { Toast } from "primereact/toast";
import { logout } from "../../../store/slices/authSlice";
import { isValidAddress, isValidText } from '../../../util/validation';
import AdminNavigationButtons from '../../../components/admin/jobs/adminNavigationButtons';
import Image from '../../../components/image';
import { Helmet } from 'react-helmet';
import JobOfferForm from '../../../components/jobs/jobOfferForm';


export default function AdminJobsEditPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const toast = useRef(null);

    const adminState = useSelector((state) => state.admin);

    const [jobOffer, setJobOffer] = useState({
        jobTitle: '',
        address: '',
        employmentType: 'Full-time',
        date: '',
        description: '',
        experience: '',
        skills: [
            {
                skillName: '',
                skillLevel: 'Beginner'
            }
        ],
        requirements: [
            { requirementName: '', requirementType: 'Beginner' }
        ],
        salary: {
            amount: '',
            currency: '€'
        }

    });

    useEffect(() => {
        if (params.jobId) {
            axios.get(`https://jobbar-5m8u.onrender.com/api/job/edit/${params.jobId}`, {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`,
                }
            }).then((response) => {
                if (response.status === 200) {
                    const date = new Date(response.data.payload.job.date);
                    setJobOffer(prevState => ({
                        ...prevState,
                        ...response.data.payload.job,
                        date
                    }));
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }, [params.jobId, adminState.adminToken, dispatch, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobOffer((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRequirementChange = (index, field, value) => {

        setJobOffer(prevState => ({
            ...prevState,
            requirements: prevState.requirements.map((req, i) => 
                i === index ? { ...req, [field]: value } : req
            )
        }));
    };

    const addRequirement = () => {
        setJobOffer(prevState => ({
            ...prevState,
            requirements: [
                ...prevState.requirements,
                { requirementName: '', requirementType: 'Beginner' }
            ]
        }));
    };

    const handleSkillChange = (index, field, value) => {
        setJobOffer(prevState => ({
            ...prevState,
            skills: prevState.skills.map((req, i) =>
                i === index ? { ...req, [field]: value } : req
            )
        }));

    };

    const addSkill = () => {
        setJobOffer(prevState => ({
            ...prevState,
            skills: [
                ...prevState.skills,
                { skillName: '', skillLevel: 'Beginner' }
            ]
        }));
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setJobOffer((prevState) => ({
            ...prevState,
            salary: {
                ...prevState.salary,
                [name]: value
            }
        }));
    };

    const handleDelete = async () => {
        await axios.put(`https://jobbar-5m8u.onrender.com/api/job/delete/${params.jobId}`, {}, {
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`,
                id: jobOffer.companyId
            }
        }).then((response) => {
            if (response.status === 200) {
                navigate(`/xyz/jobs`, { state: { type: 'success', message: 'Job offer deleted successfully' } });
            }
        }).catch((error) => {
            console.log(error);
            
        });
    };




    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...jobOffer,
        }
        
        if(!isValidText(data.jobTitle)){
            setMessageState({type: 'error', message: 'Please provide a valid job title'});
            return;
        }

        if(!isValidAddress(data.address)){
            setMessageState({type: 'error', message: 'Please provide a valid address'});
            return;
        }
        
        if(!isValidText(data.description, 1, 500)){
            setMessageState({type: 'error', message: 'Please provide a valid description'});
            return;
        }

        if(!isValidText(data.experience)){
            setMessageState({type: 'error', message: 'Please provide a valid experience'});
            return;
        }

        if(+data.salary.amount < 1){
            setMessageState({type: 'error', message: 'Please provide a valid salary'});
            return;
        }

        if(data.skills.length < 1){
            for (const skill of data.skills) {
                if(!isValidText(skill.skillName)){
                    setMessageState({type: 'error', message: 'Please provide a valid skill name'});
                    return;
                }
            }
        }

        if(data.requirements.length < 1){
            for (const requirement of data.requirements) {
                if(!isValidText(requirement.requirementName)){
                    setMessageState({type: 'error', message: 'Please provide a valid requirement name'});
                    return;
                }
            }
        }




        axios.put(`https://jobbar-5m8u.onrender.com/api/job/edit/${params.jobId}`, data, {
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`,
            }
        }).then((response) => {
            if (response.status === 201) {
                navigate(`/xyz/jobs`, { state: { type: 'success', message: 'Job offer updated successfully' } });
            }
        }).catch((error) => {
            console.log(error);

            if(error.response.statusText === 'Unauthorized'){
                dispatch(logout());
                navigate(`/login/user`, { state: { type: 'error', message: 'Session expired. Please login again.' } });
            }else{
                // navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Failed to add job offer' } });
            }
        });
        

    };

    const location = useLocation();
    const [messageState, setMessageState] = useState(location.state || null);

    useEffect(() => {
        if (location.state) {
            setMessageState(location.state);
            // Clear the location state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        if (messageState) {
            const timer = setTimeout(() => {
                switch (messageState.type) {
                    case 'success':
                        toast.current?.show({severity: 'success', summary: 'Success', detail: messageState.message, life: 2000});
                        break;
                    case 'error':
                        toast.current?.show({severity: 'error', summary: 'Error', detail: messageState.message, life: 2000});
                        break;
                    default:
                        break;
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messageState]);

  return (
    <section className="bg-custom_bg_gray py-8">
        <Toast ref={toast} />
        <Helmet>
            <title>Edit Job Offer | Jobbar</title>
            <meta name="description" content="Edit your job offer on Jobbar" />
        </Helmet>
        <div className="max-w-[1440px] mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl text-custom_gray font-bold ">Create a Job Offer</h1>
            <div>
                <form className="flex lg:flex-row flex-col mt-4" onSubmit={handleSubmit}>
                    <JobOfferForm jobOffer={jobOffer} handleChange={handleChange} handleSkillChange={handleSkillChange} handleRequirementChange={handleRequirementChange} addSkill={addSkill} addRequirement={addRequirement} handleSalaryChange={handleSalaryChange} edit={true} handleDelete={handleDelete} setMessageState={setMessageState} setJobOffer={setJobOffer}/>
                    <div className="flex flex-col flex-1 mt-[-1rem]">
                        <div className="flex flex-col justify-end flex-wrap">
                            <Image />
                        </div>
                        <div className="flex space-x-4 justify-end mt-4">
                            <AdminNavigationButtons route={`/xyz/jobs`} btnText={'Back'} secondBtnText={'Save'} btnType='submit' />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>
  );
}