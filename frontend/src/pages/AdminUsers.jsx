import { useState } from "react";

import Button from "../components/button"
import axios from "axios";
import { useSelector } from "react-redux";

export default function AdminUsersPage() {

    const [email, setEmail] = useState('');



    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const [user, setUser] = useState(null);

    const authState = useSelector((state) => state.auth);


    const handleSubmit = (e) => {
        e.preventDefault();

        axios.get(`http://localhost:4000/api/admin/user/${email}`,{
            headers: {
                Authorization: `Bearer ${authState.token}`
            }
        })
            .then((res) => {
                console.log(res.data.payload.user);
                
                setUser({
                    userName: res.data.payload.user.userName,
                    email: res.data.payload.user.email
                });
            })
            .catch((err) => {
                console.log(err);
            });
        
    }

    console.log(user);
    


    return (
        <section className="flex flex-col items-center justify-center bg-custom_bg_gray">
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8">
                <h1  className="text-2xl text-custom_gray font-bold">Find User</h1>
                <form className="flex flex-row gap-4 mt-8 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 basis-[90%]">
                        <h2 className="text-xl text-custom_gray font-bold">Search User by Email</h2>
                        <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 text-lg" type="email" name="email" id="email" value={email} onChange={handleChange} />
                    </div>
                    <div className="flex flex-col text-xl basis-[10%] mt-auto "> 
                        <Button style={'red-hover'}>Search</Button>
                    </div>
                </form>
                {user && <div className="flex flex-col gap-4 mt-8">
                    <h2 className="text-xl text-custom_gray font-bold">User Information</h2>
                    
                    <div className="flex flex-row">
                        <div className="flex basis-1/5">
                            <p className="text-custom_gray text-lg">Name: <span className="text-custom_red">{user.userName}</span></p>
                        </div>
                        <div className="flex flex-row basis-2/5">
                            <p className="text-custom_gray text-lg">Email: <span className="text-custom_red">{user.email}</span></p>
                        </div>
                        <div className="flex basis-2/5 justify-end gap-4">
                            <Button style={'red-default'}>Edit</Button>
                            <Button style={'red-hover'}>Delete</Button>
                        </div>
                    </div>
                </div>}
                        
            </div>
        </section>
    )
}