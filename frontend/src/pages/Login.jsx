import Button from "../components/button"
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

export default function LoginPage({type = 'user'}) {
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    let message = location.state?.message || null;

    const dispatch = useDispatch();


    function handleSubmit(e) {
        e.preventDefault(); 
        
        const formData = new FormData(e.target);
    
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
        };
    
        // Send a POST request
        dispatch(loginStart());
        axios
            .post(`http://localhost:4000/api/${type.toLowerCase()}/login`, data)
            .then((response) => {
                dispatch(loginSuccess(response.data.payload));
                navigate('/profile/' + response.data.payload.user._id);
            })
            .catch((error) => {
                dispatch(loginFailure());
                setError('An error occurred during registration. Please try again.');
            });
    }



    return (
        <section className="bg-custom_bg_gray p-16">
            {(error && 
                <div className="text-custom_red border border-custom_red max-w-[1000px] flex justify-center m-auto text-center bg-red-100 rounded-lg p-4">
                    <p>{error}</p>
                </div>)
            || (message && <div className="bg-green-200 border border-green-600 text-center p-4 w-[1000px] justify-center m-auto rounded-lg text-green-800"><p>{message}</p></div>) }
            <div className="flex justify-center flex-col max-w-[1000px] w-[60%] m-auto border border-black rounded-lg bg-white p-16 mt-16">
                <h1 className="text-center text-6xl text-custom_gray font-bold m-8">Sign in as {type.toLowerCase() === 'user' ? 'User' : 'Company'}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="email">Email</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="email" name="email" id="email" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password" id="password" />
                        <label className="text-custom_red text-s" htmlFor="password">Forgot your password?</label>
                    </div>
                    <div className="flex flex-col text-xl">
                        <Button style={'red-hover'}>Sign in</Button>
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
                        redirectPath={`/login/${type.toLowerCase() === 'user' ? 'company' : 'user'}`}
                    >
                        Sign in as {type.toLowerCase() === 'user' ? 'Company' : 'User'}
                    </Button>

                    <Button 
                        style={'red-default'}
                        redirectPath={`/register/${type.toLowerCase()}`}
                    >
                        Create an Account
                    </Button>
                </div>
            </div>
            
        </section>
        
    )
}