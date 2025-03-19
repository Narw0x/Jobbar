import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../store/slices/authSlice"

import { useSelector } from "react-redux";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { isValidText } from "../../../util/validation";
import EducationForm from "../../../components/education/educationForm";
import { Helmet } from "react-helmet";





export default function EducationPage(){
    const toast = useRef(null);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const authState = useSelector((state) => state.auth);

    const [type, setType] = useState('');
    const [education, setEducation] = useState({});

    const handleTypeChange = (e) => {
        e.target.value === 'school' && setEducation({
            educationType: 'school',
            date: [],
            schoolName: ''
        });
        e.target.value === 'certificate' && setEducation({
            educationType: 'certificate',
            date: [],
            certificateName: '',
            company: ''
        });
        e.target.value === 'skill' && setEducation({
            educationType: 'skill',
            skillName: '',
            level: ''
        });
        setType(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducation((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(type === '') {
            setMessageState({type: 'error', message: 'Please select education type'});
            return;
        }

        const data = {
            ...education
        };

        if(data.educationType === 'school') {
            if(!isValidText(data.schoolName)) {
                setMessageState({type: 'error', message: 'Please provide a valid school name'});
                return;
            }
            if(data.date === null || data.date.length === 0 || data.date[0] === null || data.date[1] === null) {
                setMessageState({type: 'error', message: 'Please provide a valid date'});
                return;
            }
        }


        if(data.educationType === 'certificate') {
            if(!isValidText(data.certificateName)) {
                setMessageState({type: 'error', message: 'Please provide a valid certificate name'});
                return;
            }
            if(!isValidText(data.company)) {
                setMessageState({type: 'error', message: 'Please provide a valid company name'});
                return;
            }
            if(data.date === null || data.date.length === 0 || data.date[0] === null) {
                setMessageState({type: 'error', message: 'Please provide a valid date'});
                return;
            }
        }


        if(data.educationType === 'skill') {
            if(!isValidText(data.skillName)) {
                setMessageState({type: 'error', message: 'Please provide a valid skill name'});
                return;
            }
            if(data.level === '') {
                setMessageState({type: 'error', message: 'Please provide a valid skill level'});
                return;
            }
        }


        axios.post(`https://jobbar-5m8u.onrender.com/api/profile/education/add`, data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then((response) => {
            if (response.status === 200) {
                dispatch(updateUser(response.data.payload.user));
                navigate(`/profile/${authState.user._id}`, { state: { type: 'success', message: 'Education added successfully' } });
            }
        }).catch((error) => {
            console.log(error);
            
        });

    }

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
            <Helmet>
                <title>Add Education | Jobbar</title>
            </Helmet>
            <Toast ref={toast} />
            <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl text-custom_gray font-bold ">Add your Education </h1>
                <div>
                    <form className="flex md:flex-row flex-col mt-4" onSubmit={handleSubmit}>
                        <EducationForm education={education} handleChange={handleChange} type={type} handleTypeChange={handleTypeChange} state={authState} />
                    </form>
                </div>
            </div>
        </section>
    )
}