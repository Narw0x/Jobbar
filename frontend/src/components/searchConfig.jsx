import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/slices/authSlice";

import { useLocation } from "react-router-dom";
import Button from "./button";
import Autocomplete from "./autocomplete";
import { Toast } from "primereact/toast";
import { isValidAddress } from "../util/validation";



export default function SearchPageConfig(){
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const toast = useRef(null);

    const [requestConfig, setRequestConfig] = useState({
        address: '',
        radius: '5',
        jobType: 'full-time',
        salary: '0',
        experience: '0-1'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestConfig((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    useEffect(() => {
        setRequestConfig({
            address: authState.user.searchConfig.address,
            radius: authState.user.searchConfig.radius,
            jobType: authState.user.searchConfig.jobType,
            salary: authState.user.searchConfig.salary,
            experience: authState.user.searchConfig.experience
        });
    }, [authState.user.searchConfig]);



    const handleConfigSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...requestConfig
        }

        if(!isValidAddress(data.address)){
            setMessageState({type: 'error', message: 'Please provide a valid address'});
            return;
        }

        if(data.salary < 0){
            setMessageState({type: 'error', message: 'Please provide a valid salary'});
            return;
        }

        axios.put('https://jobbar-5m8u.onrender.com/api/profile/config', data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then(response => {
            dispatch(updateUser(response.data.payload.user));
            setMessageState({type: 'success', message: 'Updated successfully'});
            
        }).catch(err => {
            console.log(err);
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


    return(
        <div>
            <Toast ref={toast} />
            <h1 className="text-custom_gray text-4xl font-bold">My Preferencies</h1>
            <form className="flex flex-col gap-4" onSubmit={handleConfigSubmit}>
                <div className='flex flex-col mt-4'>
                    <div className='flex flex-row gap-4 justify-between'>
                        <div className='flex flex-col w-full'>
                            <label className="text-custom_gray text-xl" htmlFor="address">Location: </label>
                            <Autocomplete
                                value={requestConfig.address}
                                onChange={handleChange}
                            />   
                        </div>
                        
                        <div className='flex flex-col justify-between'>
                            <label className="text-custom_gray text-xl" htmlFor="radius">Radius: </label>
                            <select className="border border-custom_gray bg-white rounded p-2 text-xl text-custom_gray my-2" value={requestConfig.radius} onChange={handleChange} name="radius" id="radius">
                                <option value="5">5 km</option>
                                <option value="10">10 km</option>
                                <option value="25">25 km</option>
                                <option value="50">+50 km</option>
                            </select>                                             
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className="text-custom_gray text-xl" htmlFor="jobType">Job Type: </label>
                    <select className="border border-custom_gray rounded p-2 bg-white text-xl text-custom_gray" value={requestConfig.jobType} onChange={handleChange} name="jobType" id="jobType">
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="temporary">Temporary</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>

                    </select>
                </div>
                <div className='flex flex-col gap-2'>
                    <label className="text-custom_gray text-xl" htmlFor="salary">Minimal Salary: </label>
                    <input className="border border-custom_gray rounded p-2" type='number' value={requestConfig.salary} onChange={handleChange} name="salary" id="salary" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className="text-custom_gray text-xl" htmlFor="experience">Experience: </label>
                    <select className="border border-custom_gray rounded p-2 bg-white text-xl text-custom_gray" value={requestConfig.experience} onChange={handleChange} name="experience" id="experience">
                        <option value="0-1">0-1</option>
                        <option value="1-3">1-3</option>
                        <option value="3-5">3-5</option>
                        <option value="5+">5+</option>
                    </select>
                </div>

                <div>
                    <Button 
                        btnStyle="red-hover"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </div>
    )
}