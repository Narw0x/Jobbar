import { useRef, useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Toast } from "primereact/toast";




import Button from "../components/button"
import { isValidPassword, isValidEmail } from "../util/validation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { adminLoginFailure, adminLoginStart, adminLoginSuccess } from "../store/slices/adminSlice";
import { use } from "react";


export default function AdminLoginPage() {
    const dispatch = useDispatch();
    const toast = useRef(null);
    const navigate = useNavigate();

    const adminToken = useSelector((state) => state.admin.adminToken);


    const [data , setData] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if(adminToken) {
            navigate('/admin/dashboard');
        }
    }, []);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidEmail(data.email)) {
            setMessageState({type: 'error', message: 'Invalid email address'});
            return;
        }

        if(!isValidPassword(data.password)) {
            setMessageState({type: 'error', message: 'Invalid password'});
            return;
        }

        dispatch(adminLoginStart());
        axios.post('http://localhost:4000/api/admin/login', data)
            .then((res) => {
                setMessageState({type: 'success', message: res.data.message});
                dispatch(adminLoginSuccess(res.data.payload));
                navigate('/admin/dashboard', {state: {type: 'success', message: res.data.message}});
            })
            .catch((err) => {
                console.log(err);
                setMessageState({type: 'error', message: err.response.data.message});
                dispatch(adminLoginFailure());
                
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
        <section className="bg-custom_bg_gray h-screen">
            <Toast ref={toast} />
            <div className="flex justify-center items-center h-full ">
                <div className="border border-gray-300 p-8 xl:max-w-[40%] container mx-8 rounded-lg shadow-md bg-white">
                    <h1 className="text-4xl font-bold text-custom_gray text-center py-4">Admin Login</h1>
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
                            <Button style='red-hover'>Sign in</Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
};