import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { isValidText, isValidEmail, isValidPassword } from "../util/validation";
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Toast } from 'primereact/toast';

import Button from "../components/button"

export default function RegisterUserPage() {
    const toast = useRef(null);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password_2: '',
        gender: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const navigate = useNavigate();
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

        if(!isValidText(user.firstName)){
            setMessageState({type: 'error', message: 'First name is required.'});
            return;
        }

        if(!isValidText(user.lastName)){
            setMessageState({type: 'error', message: 'Last name is required.'});
            return;
        }

        if(!isValidEmail(user.email)){
            setMessageState({type: 'error', message: 'Email is invalid.'});
            return;
        }

        if(!isValidPassword(user.password)){
            setMessageState({type: 'error', message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'});
            return;
        }

        if(user.password !== user.password_2){
            setMessageState({type: 'error', message: 'Passwords do not match.'});
            return;
        }

        const data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            gender: user.gender
        }

        axios
            .post('http://localhost:4000/api/user/register', data)
            .then((response) => {
                navigate('/login', { state: { message: response.data.message, type: 'success' } });
            })
            .catch((error) => {
                console.error('Error:', error.response?.data || error.message);
                setMessageState({type: 'error', message: error.response?.data?.message || error.message});
            });
    }

    return(
        <section className="bg-custom_bg_gray lg:p-16 py-16">
            <Toast ref={toast} />
            <div className="flex justify-center flex-col max-w-[1000px] md:w-[60%] w-[90%] m-auto border border-black rounded-lg bg-white p-16 md:mt-16">
                <h1 className="text-center lg:text-6xl text-4xl text-custom_gray font-bold m-8">Sign up as User</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex flex-col md:w-[45%]">
                            <label className="text-custom_gray text-2xl font-bold" htmlFor="firstName">First Name</label>
                            <input 
                                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg w-full" 
                                type="text" 
                                name="firstName" 
                                id="firstName" 
                                value={user.firstName} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col md:w-[45%]">
                            <label className="text-custom_gray text-2xl font-bold" htmlFor="lastName">Last Name</label>
                            <input 
                                className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" 
                                type="text" 
                                name="lastName" 
                                id="lastName" 
                                value={user.lastName} 
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="email">Email</label>
                        <input 
                            className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={user.email} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="password">Password</label>
                        <input  
                            className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" 
                            type="password" 
                            name="password" 
                            id="password" 
                            value={user.password} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="password2">Password again</label>
                        <input  
                            className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" 
                            type="password" 
                            name="password_2" 
                            id="password_2" 
                            value={user.password_2} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="gender">Gender</label>
                        <select 
                            id="gender" 
                            name="gender" 
                            value={user.gender}
                            onChange={handleChange}
                            className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-3 my-2 text-lg"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
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
                        redirectPath={'/register/company'}
                    >
                        Sign up as Company
                    </Button>

                    <Button 
                        style={'red-default'}
                        redirectPath={'/login'}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </section>
    );
}