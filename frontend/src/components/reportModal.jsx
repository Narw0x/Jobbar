import { forwardRef, useImperativeHandle, useRef, useState } from "react"

import { createPortal } from "react-dom"
import { useSelector } from "react-redux"

import Button from "./button"
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { isValidText } from "../util/validation";

const ReportModal = forwardRef(function ReportModal({type, setMessage} ,ref) {
    const {id} = useParams();
    const dialog = useRef();
    useImperativeHandle(ref, () => {
        return {
            open() {
                dialog.current.showModal();
            }
        }
    })

    const [reason, setReason] = useState('');
    const authState = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setReason(e.target.value);
    }

    const resetReport = () => {
        setReason('');
    }

    const handleSumbit = (e) => {
        e.preventDefault();


        if(!isValidText(reason)){
            resetReport();
            dialog.current.close();
            setMessage({type: 'error', message: 'Please provide a valid reason'});
            return;
        }
        

        const data = {
            reportedEntity: id,
            reportedEntityType: type,
            reportedBy: authState.user._id,
            reportedByType: authState.user.role,
            reason
        }

        axios.post('http://localhost:4000/api/report', data, {
            headers: {
                Authorization: `Bearer ${authState.token}`
            }
        }).then((res) => {
            resetReport();
            setMessage({type: 'success', message: 'User has been reported successfully'});
            dialog.current.close();
        }
        ).catch((err) => {
            console.log(err);
        });
        dialog.current.close();
    }

    const handleCancel = () =>{
        resetReport();
        dialog.current.close()
    }

 

    return createPortal(
        <dialog ref={dialog} className="p-4 rounded-md backdrop:bg-stone-900/90 shadow-md">
            <form onSubmit={handleSumbit} className="mt-4 text-left">
                <h2 className="text-xl font-bold text-custom_gray my-4">Report User</h2>
                <div>
                    <p className="text-sm text-gray-500">Please provide a reason for reporting this user</p>
                    <textarea className="w-full h-32 border border-gray-200 rounded-lg p-2 mt-2" name="reason" id="reason" value={reason} onChange={handleChange} placeholder="Enter your reason here"></textarea>
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
                        Send
                    </Button>  
                </div>
                
            </form>
        </dialog>,
        document.getElementById("modal-root")
    )
})

export default ReportModal