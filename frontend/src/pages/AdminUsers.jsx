import { useState } from "react";

import Button from "../components/button"
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import { bouncy } from "ldrs";


export default function AdminUsersPage() {

    const [email, setEmail] = useState('');
    const toast = useRef(null);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    bouncy.register();

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

        useEffect(() => {
            document.title = "Users | Jobbar";
        }, []);

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
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8 mt-0 mx-auto">
                <h1  className="text-2xl text-custom_gray font-bold">Find User</h1>
                <form className="flex md:flex-row flex-col gap-4 mt-8 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 basis-[90%]">
                        <h2 className="text-xl text-custom_gray font-bold">Search User by Email</h2>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 text-lg" type="email" name="email" id="email" value={email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col text-xl basis-[10%] mt-auto "> 
                        <Button style={'red-hover'}>Search</Button>
                    </div>
                </form>
                {isLoading && (
                    <div className="flex justify-center p-8">
                        <l-bouncy
                        size="45"
                        speed="1.75" 
                        color="gray" 
                        ></l-bouncy>
                    </div>
                )}
                {user && <div className="flex flex-col gap-4 mt-8">
                    <h2 className="text-xl text-custom_gray font-bold">User Information</h2>
                    
                    <div className="flex md:flex-row flex-col">
                        <div className="flex basis-1/5">
                            <p className="text-custom_gray text-lg">Name: <span className="text-custom_red text-sm md:text-lg">{user.userName}</span></p>
                        </div>
                        <div className="flex flex-row basis-2/5">
                            <p className="text-custom_gray text-lg ">Email: <span className="text-custom_red text-sm md:text-lg">{user.email}</span></p>
                        </div>
                        <div className="flex flex-col md:flex-row basis-2/5 justify-end gap-4">
                            <Button style={'red-default'} redirectPath={`/xyz/users/${user._id}`}>View Profile</Button>
                            <Button style={'red-default'} redirectPath={`/xyz/users/edit/${user._id}`}>Edit</Button>
                            <Button style={'red-hover'} onClick={() => handleDelete(user._id)}>Delete</Button>
                        </div>
                    </div>
                </div>
                }
                        
            </div>
        </section>
    )
}