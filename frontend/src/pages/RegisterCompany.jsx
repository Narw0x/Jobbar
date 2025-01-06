import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { isValidText, isValidEmail, isValidPassword, isValidPhoneNumber, isValidAddress } from "../util/validation";

import Autocomplete from "../components/autocomplete";
import Button from "../components/button"

export default function RegisterCompanyPage() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [companyProfile, setCompanyProfile] = useState({
        companyName: '',
        email: '',
        password: '',
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

    function handleSubmit(e) {
        e.preventDefault(); 

        const data = {
            ...companyProfile,
        };

        if (!isValidText(data.companyName)) {
            setError('Company name is required.');
            return;
        }

        if (!isValidEmail(data.email)) {
            setError('Email is invalid.');
            return;
        }

        if (!isValidPassword(data.password)) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (!isValidAddress(data.address)) {
            setError('Address is required.');
            return;
        }

        if (!isValidPhoneNumber(data.phone)) {
            setError('Phone number is invalid.');
            return;
        }

       
        // Send a POST request
        axios
            .post('http://localhost:4000/api/company/register', data)
            .then((response) => {
                navigate('/login/company', {state: {message: response.data.message, type: 'success'}});
            })
            .catch((error) => {
                console.error('Error:', error.response?.data || error.message); // Handle error
                setError('An error occurred during registration. Please try again.');
            });
    }


    return(
        <section className="bg-custom_bg_gray p-16">
            {error && 
                <div className="text-custom_red border border-custom_red max-w-[1000px] flex justify-center m-auto text-center bg-red-100 rounded-lg p-4">
                    <p>{error}</p>
                </div>
            }
            <div className="flex justify-center flex-col max-w-[1000px] w-[60%] m-auto border border-black rounded-lg bg-white p-16 mt-16">
                <h1 className="text-center text-6xl text-custom_gray font-bold m-8">Sign up as Company</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="companyName">Company Name</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="text" name="companyName" id="companyName" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="email">Email</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="email" name="email" id="email" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password" id="password" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password again</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password_2" id="password_2" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="address">Address</label>
                        <Autocomplete
                            value={companyProfile.address}
                            onChange={handleChange}
                            />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="phone">Phone</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="phone" name="phone" id="phone"  placeholder="+421 xxxxxxxxx"/>
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
                        redirectPath={`/login/user`}
                    >
                        Sign in
                    </Button>
                </div>
            </div>
        </section>
    )
};