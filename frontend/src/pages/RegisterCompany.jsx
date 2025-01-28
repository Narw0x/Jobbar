import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useRef } from 'react'; 
import { Toast } from 'primereact/toast';

import { isValidText, isValidEmail, isValidPassword, isValidAddress } from "../util/validation";

import Autocomplete from "../components/autocomplete";
import Button from "../components/button"

export default function RegisterCompanyPage() {
    const toast = useRef(null);
    const navigate = useNavigate();

    const [companyProfile, setCompanyProfile] = useState({
        companyName: '',
        email: '',
        password: '',
        password_2: '',
        address: '',
        phone: ''
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setCompanyProfile((prevState) => ({
            ...prevState,
            [name]: value,
        }));
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

    function handleSubmit(e) {
        e.preventDefault(); 

        const data = {
            companyName: companyProfile.companyName,
            email: companyProfile.email,
            password: companyProfile.password,
            address: companyProfile.address,
        };

        if (!isValidText(data.companyName)) {
            setMessageState({type: 'error', message: 'Company name is required.'});
            return;
        }

        if (!isValidEmail(data.email)) {
            setMessageState({type: 'error', message: 'Email is required.'});
            return;
        }

        if (!isValidPassword(data.password)) {
            setMessageState({type: 'error', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'});
            return;
        }

        if(data.password !== companyProfile.password_2){
            setMessageState({type: 'error', message: 'Passwords do not match.'});
            return;
        }

        if (!isValidAddress(data.address)) {
            setMessageState({type: 'error', message: 'Invalid address. Please enter a valid location.'});
            return;
        }

        // Send a POST request
        axios
            .post('http://localhost:4000/api/company/register', data)
            .then((response) => {
                navigate('/login', {state: {message: response.data.message, type: 'success'}});
            })
            .catch((error) => {
                console.error('Error:', error.response?.data || error.message); // Handle error
                setMessageState({type: 'error', message: error.response?.data?.message || 'An error occurred. Please try again.'});
            });
    }


    return(
        <section className="bg-custom_bg_gray lg:p-16 py-16">
            <Toast ref={toast} />
            <div className="flex justify-center flex-col max-w-[1000px] md:w-[60%] w-[90%] m-auto border border-black rounded-lg bg-white p-16 mt-16">
                <h1 className="text-center lg:text-6xl text-4xl text-custom_gray font-bold m-8">Sign up as Company</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="companyName">Company Name</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="text" name="companyName" id="companyName" value={companyProfile.companyName} onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="email">Email</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="email" name="email" id="email" value={companyProfile.email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password" id="password"  value={companyProfile.password} onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password again</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password_2" id="password_2"  value={companyProfile.password_2} onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="address">Address</label>
                        <Autocomplete
                            value={companyProfile.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col text-xl">
                        <Button style={'red-hover'}>Sign up</Button>
                    </div>
                </form>
                <div className="flex flex-row justify-between items-center my-8">
                    <hr className="w-[47%] border border-custom_gray" />
                    <div className="text-custom_gray">
                        <p>or</p>
                    </div>
                    <hr className="w-[47%] border border-custom_gray"/>
                </div>
                <div className="flex flex-col text-xl gap-4"> 
                    <Button 
                        style={'red-default'}
                        redirectPath={`/register/user`}
                    >
                        Sign up as User
                    </Button>

                    <Button 
                        style={'red-default'}
                        redirectPath={`/login`}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </section>
    )
};