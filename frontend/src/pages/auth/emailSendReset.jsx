import { Toast } from "primereact/toast"
import { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Button from "../../components/button";
import { isValidEmail } from "../../util/validation";
import axios from "axios";

export default function EmailSendReset() {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.email) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields', life: 2000 });
            return;
        }

        if(!isValidEmail(data.email)) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid email address', life: 2000 });
            return;
        }

        axios.post('https://jobbar-5m8u.onrender.com/api/auth/reset-password', {data})
        .then((response) => {
            navigate('/login', { state: { type: 'success', message: response.data.message } });
        })
        .catch((error) => {
            if (error.response) {
                setMessageState({ type: 'error', message: error.response.data.message });
            } else {
                setMessageState({ type: 'error', message: 'An error occurred' });
            }
        });

    }

    return (
        <section className="bg-custom_bg_gray lg:p-16 py-16  min-h-[61.5vh]">
            <Toast ref={toast} />
            <Helmet>
                <title>Reset Password | Jobbar</title>
                <meta name="description" content="Reset your password on Jobbar" />
                <meta name="keywords" content="Jobbar, Reset Password, Job Search, Job Application" />
                <meta name="author" content="Jobbar Team" />
            </Helmet>
            <div className="flex justify-center flex-col max-w-[1000px] md:w-[60%] w-[90%] m-auto border border-black rounded-lg bg-white md:p-16 p-8">
                <h1 className="text-center lg:text-4xl text-2xl text-custom_gray font-bold m-8">Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col mb-4">
                        <label className="text-custom_gray text-2xl font-bold" htmlFor="email">Email</label>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" type="email" name="email" id="email" value={data.email} onChange={handleChange} autoComplete='on'/>
                    </div>
                    <div className="flex flex-col text-xl">
                        <Button btnStyle={'red-hover'}>Send</Button>
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
                        btnStyle={'red-default'}
                        redirectPath={`/register/user`}
                    >
                        Create an User Account
                    </Button>
                    <Button 
                        btnStyle={'red-default'}
                        redirectPath={`/register/company`}
                    >
                        Create a Company Account
                    </Button>
                </div>
            </div>
        </section>
    )
}