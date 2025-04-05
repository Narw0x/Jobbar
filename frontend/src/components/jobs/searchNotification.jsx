import { Toast } from "primereact/toast"
import Button from "../button";
import Autocomplete from "../autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isValidAddress } from "../../util/validation";
import axios from "axios";
import { updateUser } from "../../store/slices/authSlice";

export default function SearchNotification() {
    const toast = useRef(null);
    const [requestConfig, setRequestConfig] = useState({
        address: '',
        radius: '5',
        salary: '0',
        field: 'All'
    });
    const authState = useSelector((state) => state.auth);
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
                        toast.current?.show({ severity: 'success', summary: 'Success', detail: messageState.message, life: 2000 });
                        break;
                    case 'error':
                        toast.current?.show({ severity: 'error', summary: 'Error', detail: messageState.message, life: 2000 });
                        break;
                    default:
                        break;
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messageState]);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRequestConfig((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleNotificationSubmit = (e) => {
        e.preventDefault();

        const data = {
            ...requestConfig
        }

        if (!isValidAddress(data.address)) {
            setMessageState({ type: 'error', message: 'Please provide a valid address' });
            return;
        }
        if (data.salary < 0) {
            setMessageState({ type: 'error', message: 'Please provide a valid salary' });
            return;
        }
        
        axios.put('https://jobbar-5m8u.onrender.com/api/profile/notification', data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then(response => {
            dispatch(updateUser(response.data.payload.user));
            setMessageState({ type: 'success', message: 'Updated successfully' });
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        if (authState.user.notifications) {
            setRequestConfig({
                address: authState.user.notifications.address,
                radius: authState.user.notifications.radius,
                salary: authState.user.notifications.salary,
                field: authState.user.notifications.field
            });
        }
    }, [authState.user.notifications]);

    const handleNotificationToggle = () => {
        const data = {
            isNotified: !authState.user.isNotified
        }

        axios.put('https://jobbar-5m8u.onrender.com/api/profile/notification-toggle', data, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: authState.user._id
            }
        }).then(response => {
            dispatch(updateUser(response.data.payload.user));
            setMessageState({ type: 'success', message: 'Updated successfully' });
        }).catch(err => {
            console.log(err);
        });
    }



    return (
        <div>
            <Toast ref={toast} />
            <h1 className="text-custom_gray text-4xl font-bold">Job notifications</h1>
            <form className="flex flex-col gap-4" onSubmit={handleNotificationSubmit}>
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
                    <label className="text-custom_gray text-xl" htmlFor="salary">Minimal Salary: </label>
                    <input className="border border-custom_gray rounded p-2" type='number' value={requestConfig.salary} onChange={handleChange} name="salary" id="salary" />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className="text-custom_gray text-xl" htmlFor="field">Field: </label>
                <select 
                        name="field" 
                        id="field" 
                        className="bg-white text-custom_gray focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 text-lg"
                        onChange={handleChange}
                        value={requestConfig.field}
                    >
                        <option value="All">All</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Construction">Construction</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                    </select>
                </div>
                <div className='flex flex-row gap-2 justify-between'>
                    <div className='flex justify-center items-center text-custom_gray gap-4'>
                        <p>Status: <span className="text-custom_red">{authState.user.isNotified ? "Active ":"Inactive"}</span></p>
                        <Button
                            btnStyle={authState.user.isNotified ? "gray-default" : "red-default"}
                            onClick={handleNotificationToggle}
                        >
                            {authState.user.isNotified ? "Disable" : "Enable"}
                        </Button>
                    </div>
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