import { Helmet } from "react-helmet"
import { Toast } from "primereact/toast"
import { useRef, useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { isValidPassword } from "../../util/validation";
import Button from "../../components/button";
import { useNavigate } from "react-router-dom";


export default function PasswordReset() {
    const toast = useRef(null);
    const {token} = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        password: '',
        password_2: ''
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

        if (!data.password || !data.password_2) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields', life: 2000 });
            return;
        }

        if (data.password !== data.password_2) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 2000 });
            return;
        }

        if(!isValidPassword(data.password) ) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character', life: 2000 });
            return;
        }


        const resetData = {
            password: data.password,
            token,
        }

        axios.post('https://jobbar-5m8u.onrender.com/api/auth/reset-password/confirm', resetData)
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
                <meta name="description" content="Reset your password for Jobbar" />
                <meta name="keywords" content="Jobbar, Reset Password, Job Search" />
                <meta name="author" content="Jobbar Team" />
            </Helmet>
            <div className="flex justify-center flex-col max-w-[1000px] md:w-[60%] w-[90%] m-auto border border-black rounded-lg bg-white md:p-16 p-8">
                <h1 className="text-center lg:text-4xl text-2xl text-custom_gray font-bold m-8">Reset Password</h1>
                <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password" id="password"  value={data.password} onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col mb-4">
                        <label  className="text-custom_gray text-2xl font-bold" htmlFor="password">Password again</label>
                        <input  className="bg-white focus:bg-white border border-custom_gray focus:border-custom_gray rounded p-2 my-2 text-lg" type="password" name="password_2" id="password_2"  value={data.password_2} onChange={handleChange}/>
                    </div>
                    <div className="flex flex-col text-xl">
                        <Button btnStyle={'red-hover'}>Reset</Button>
                    </div>
                </form>
            </div>
        </section>
    )
}