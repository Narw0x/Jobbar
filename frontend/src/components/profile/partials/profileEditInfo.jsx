export default function ProfileEditInfo({ userInfo, handleUserInfoChange }) {
    return ( 
        <>
            <div className="md:w-[30%] flex flex-col mb-4 ">
                <label className="text-custom_gray text-xl font-bold" htmlFor="phoneNumber">Phone</label>
                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg "  onChange={handleUserInfoChange}  value={userInfo.phoneNumber || ''} type="phone" name="phoneNumber" id="phoneNumber" placeholder="+421 xxxxxxxxx"/>
            </div>
            <div className="md:w-[65%] flex flex-col mb-4">
                <label className="text-custom_gray text-xl font-bold" htmlFor="website">Website</label>
                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg w-full"  onChange={handleUserInfoChange} value={userInfo.website || ''} type="text" name="website" id="website" />
            </div>
        </>
    )
}