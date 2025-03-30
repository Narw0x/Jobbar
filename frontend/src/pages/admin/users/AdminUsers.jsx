import { useState } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import Loading from "../../../components/loading";
import SearchUser from "../../../components/admin/search";
import ShowUser from "../../../components/admin/showUser";
import { Helmet } from "react-helmet";


export default function AdminUsersPage() {

    const [email, setEmail] = useState('');
    const toast = useRef(null);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const adminState = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        axios.get(`https://jobbar-5m8u.onrender.com/api/admin/user/${email}`,{
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                
                setUser({
                    _id: res.data.payload.user._id,
                    userName: res.data.payload.user.userName,
                    email: res.data.payload.user.email
                });
                setIsLoading(false);
                setMessageState({type: 'success', message: 'User found'});
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
                navigate('/xyz/users', {state: {type: 'error', message: err.response.data.message}});
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


        const handleDelete = (id) => {
            axios.post(`https://jobbar-5m8u.onrender.com/api/admin/delete/${id}`, {},
            {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`
                }
            })
                .then((res) => {
                    setUser(null);
                    setEmail('');
                    navigate('/xyz/users', {state: {type: 'success', message: res.data.message}});
                })
                .catch((err) => {
                    console.log(err);
                    navigate('/xyz/users', {state: {type: 'error', message: err.response.data.message}});
                });
        }

    return (
        <section className=" bg-custom_bg_gray px-8 pt-8  min-h-[61.5vh]">
            <Toast ref={toast} />
            <Helmet>
                <title>Admin Users | Jobbar</title>
            </Helmet>
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8 mt-0 mx-auto">
                <SearchUser handleChange={handleChange} handleSubmit={handleSubmit} email={email} searching={'User'}/>
                <div className="mt-8">
                    {isLoading && <Loading />}
                </div>
                {user && <ShowUser user={user} handleDelete={handleDelete} searching={'User'} />}
            </div>
        </section>
    )
}