import Button from "../components/button"
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { isValidText, isValidEmail, isValidPassword, isValidPhoneNumber } from "../util/validation";

export default function RegisterCompanyPage() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault(); 
        const formData = new FormData(e.target);

        // Validate company name
        if (!isValidText(formData.get('companyName'))) {
            setError('Company name is invalid');
            return;
        }

        // Validate email
        if (!isValidEmail(formData.get('email'))) {
            setError('Email is invalid');
            return;
        }

        // Validate password
        if (!isValidPassword(formData.get('password'))) {
            setError('Password is invalid');
            return;
        }

        // Validate password match
        if (formData.get('password') !== formData.get('password_2')) {
            setError('Passwords do not match');
            return;
        }

        // Validate address
        if (!isValidText(formData.get('address'))) {
            setError('Address is invalid');
            return;
        }

        // Validate phone number
        if (!isValidPhoneNumber(formData.get('phone'))) {
            setError('Phone number is invalid');
            return;
        }

        
    
        // Create the data object
        const data = {
            companyName: formData.get('companyName'),
            email: formData.get('email'),
            password: formData.get('password'),
            address: formData.get('address'),
            phoneNumber: formData.get('phone'),
        };

        console.log(data);
        
    
        // Send a POST request
        axios
            .post('http://localhost:4000/api/company/register', data)
            .then((response) => {
                navigate('/login/company', { state: { message: response.data.message } });
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
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="address" name="address" id="address" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="phone">Phone</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="phone" name="phone" id="phone"  placeholder="+421xxxxxxxxx"/>
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