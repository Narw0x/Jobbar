import Button from "../button"
import ReportModal from "../reportModal"
import DeleteAccountModal from "../deleteModal"
import { useRef } from "react"


export default function ProfileHeader({ profileData, isCurrentUser, setMessageState }) {
    const reportModal = useRef();
    const deleteModal = useRef();


    const handleReport = () => {
        reportModal.current.open();
    }

    const handleDeleteAccount = () => {
        deleteModal.current.open();
    }


    return (
        <div className="max-w-[1440px] md:w-[70%] w-[90%] mx-auto border rounded-lg shadow-md bg-white">
            <div className="w-full object-fill">
                <img className="w-full min-h-[150px] max-h-[250px] rounded-t" src={`https://jobbar-5m8u.onrender.com/public/background/${profileData?.bgImage}`} alt="" />
            </div>
            <div className="flex md:flex-row flex-col">
                <div className="w-60 h-60 rounded m-8 md:m-8 my-8 mx-auto flex justify-start">
                    <img className={`w-full h-full object-cover rounded-2xl p-2 ${profileData?.avatar === 'default_profile.svg' ? 'border-[2px] border-custom-gray':null}`} src={`https://jobbar-5m8u.onrender.com/public/avatar/${profileData?.avatar}`} alt="" />
                </div>
                <div className="flex flex-grow sm:flex-row flex-col  justify-between p-8 md:p-0 pt-0 gap-2 md:gap-0">
                    <div className="sm:ml-4 flex-1 flex flex-col justify-center">
                        <h2 className="text-lg text-custom_gray font-semibold text-center sm:text-left" id="UserName">
                            {profileData?.firstName || profileData?.companyName}
                        </h2>
                        {profileData.address && <p className="text-sm text-gray-500 text-center sm:text-left">
                            {profileData.address}
                        </p>}
                        {!profileData.isVerified && (
                            <p className="text-sm text-custom_red text-center sm:text-left">
                                Your account is not verified
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col justify-end md:justify-center md:mx-4">
                        {!isCurrentUser && (
                            <div className="flex flex-row justify-center">
                                <Button btnStyle="red-hover" onClick={handleReport}>
                                    Report
                                </Button>
                                <ReportModal ref={reportModal} type={profileData.role} setMessage={setMessageState}></ReportModal>
                            </div>
                        )}
                        {isCurrentUser && (
                            <div className="flex flex-row justify-center sm:justify-none">
                                <Button btnStyle="red-hover" onClick={handleDeleteAccount}>
                                    Delete Account
                                </Button>
                                <DeleteAccountModal ref={deleteModal}></DeleteAccountModal>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}