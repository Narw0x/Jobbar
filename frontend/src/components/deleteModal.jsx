import { forwardRef, useImperativeHandle, useRef, useState } from "react"

import { createPortal } from "react-dom"
import { useDispatch, useSelector } from "react-redux"

import Button from "./button"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { isValidPassword } from "../util/validation";

const DeleteAccountModal = forwardRef(function DeleteAccountModal( _,ref) {
    const dialog = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    })

    const authState = useSelector((state) => state.auth);
    const [password, setPassword] = useState('');

    const resetModal = () => {
        setPassword('');
    }


    const handleSumbit = (e) => {
        e.preventDefault();

        if(!isValidPassword(password)){
            resetModal();
            dialog.current.close();
            return navigate(`/profile/${authState.user._id}`, { state: { type: 'error', message: 'Password is invalid!' } });
        }


        const data = {
            email: authState.user.email,
            password: password
        }


        axios.post(`http://localhost:4000/api/${authState.user.role}/delete`, data, {
            headers: {
                Authorization: `Bearer ${authState.token}`
            }
        }).then((res) => {
            dialog.current.close();
            if(res.status === 200){
                navigate('/login', { state: { type: 'success', message: 'Account has been deleted successfully' } });
                dispatch(logout());
            }
        }
        ).catch((err) => {
            console.log(err);
        });
        dialog.current.close();
    }

    const handleCancel = () =>{
        resetModal();
        dialog.current.close()
    }

 

    return createPortal(
        <dialog ref={dialog} className="p-4 rounded-md backdrop:bg-stone-900/90 shadow-md">
            <form onSubmit={handleSumbit} className="mt-4 text-left ">
                <h2 className="text-xl font-bold text-custom_gray my-4">Delete Account</h2>
                <div>
                    <p className="text-lg text-gray-500">Please provide password</p>
                    <input
                        type="password"
                        className="w-full border rounded-md p-2 mt-2"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-4 ml-16">
                    <Button
                        style={"red-hover"}
                        onClick={handleCancel}
                        type="button"
                    >
                        Cancel
                    </Button>  
                    <Button
                        style={"red-hover"}
                    >
                        Send
                    </Button>  
                </div>
                
            </form>
        </dialog>,
        document.getElementById("modal-root")
    )
})

export default DeleteAccountModal