import axios from 'axios';
import { useState, useRef } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { isValidEmail, isValidPassword } from "../util/validation";


import Button from "../components/button"

export default function LoginPage() {
    const toast = useRef(null);
    const navigate = useNavigate();

    const [data , setData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const dispatch = useDispatch();

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
        
        if (!isValidEmail(data.email)) {
            setMessageState({message: 'Email is invalid', type: 'error'});
            return;
        }

        if (!isValidPassword(data.password)) {
            setMessageState({message: 'Password is invalid', type: 'error'});
            return;
        }

    
        // Send a POST request
        dispatch(loginStart());
        axios
            .post(`https://jobbar-5m8u.onrender.com/api/profile/login`, data)
            .then((response) => {
                dispatch(loginSuccess(response.data.payload));
                navigate('/profile/' + response.data.payload.user._id, {state: {message: response.data.message, type: 'success'}});
            })
            .catch((error) => {
                dispatch(loginFailure());
                console.log(error);
                setMessageState({message: error.response?.data.message || error.message, type: 'error'});
            });
    }

    return (
        <section className="bg-custom_bg_gray lg:p-16 py-16  min-h-[61.5vh]">
            <Toast ref={toast} />
            <div className="flex justify-center flex-col max-w-[1000px] md:w-[60%] w-[90%] m-auto border border-black rounded-lg bg-white md:p-16 p-8 md:mt-16">
                <h1 className="text-center lg:text-6xl text-4xl text-custom_gray font-bold m-8">Sign in</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="email">Email</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="email" name="email" id="email" value={data.email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password" id="password" value={data.password} onChange={handleChange} />
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
                        redirectPath={`/register/user`}
                    >
                        Create an User Account
                    </Button>
                    <Button 
                        style={'red-default'}
                        redirectPath={`/register/company`}
                    >
                        Create a Company Account
                    </Button>
                </div>
            </div>
        </section>
    )
}