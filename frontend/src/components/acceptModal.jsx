import { forwardRef, useImperativeHandle, useRef } from "react"
import { useSelector } from "react-redux"
import { createPortal } from "react-dom"

import Button from "./button"
import axios from "axios"

const AcceptModal = forwardRef(function AcceptModal( { userName, userEmail, userId, jobId, setMessage, fetchApplicants },ref) {
    const dialog = useRef(null);
    const authState = useSelector((state) => state.auth);
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            userId,
            jobId
        }


        axios.post('http://localhost:4000/api/job/accept', data, {
            headers: {
                Authorization: `Bearer ${authState.token}`
            }
        }).then((res) => {
            fetchApplicants();
            setMessage({type: 'success', message: 'User has been accepted'});
        }).catch((err) => {
            console.log(err);
        })


        dialog.current.close();
    }

    const handleCancel = () => {
        dialog.current.close()
    }


    return createPortal(
        <dialog ref={dialog} className="p-4 rounded-md backdrop:bg-stone-900/90 shadow-md">
            <form onSubmit={handleSubmit} className="mt-4 text-left">
                <h2 className="text-xl font-bold text-custom_gray my-4">Accept User</h2>
                <div>
                    <p className="text-sm text-custom_gray">Are you sure?</p>
                    <p className="text-sm text-custom_gray">Name: <span className="text-custom_red">{userName}</span></p>
                    <p className="text-sm text-custom_gray">Email: <span className="text-custom_red">{userEmail}</span></p>
                    
                </div>
                <div className="flex justify-end gap-4 mt-4">
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
                        Accept
                    </Button>  
                </div>
            </form>
        </dialog>,
        document.getElementById("modal-root")
    )
})

export default AcceptModal