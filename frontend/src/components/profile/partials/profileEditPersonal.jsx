import Autocomplete from "../../autocomplete"

export default function ProfileEditPersonal({userInfo, handleUserInfoChange}) {
    return (
        <div className="md:basis-2/3 flex flex-col m-8 md:mb-8 mb-0">
            <div className="flex flex-col md:flex-row justify-between  mb-4">
                {userInfo.role === 'user' && <div className="flex flex-col md:w-[45%]">
                    <label className="text-custom_gray text-xl font-bold" htmlFor="firstName">First Name</label>
                    <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.firstName || ''} onChange={handleUserInfoChange} type="text" name="firstName" id="firstName" />    
                </div>}
                {userInfo.role === 'user' && <div className="flex flex-col md:w-[45%]">
                    <label className="text-custom_gray text-xl font-bold" htmlFor="lastName">Last Name</label>
                    <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.lastName || ''} onChange={handleUserInfoChange}  type="text" name="lastName" id="lastName" />
                </div>}
                {userInfo.role === 'company' && <div className="flex flex-col w-full">
                    <label className="text-custom_gray text-xl font-bold" htmlFor="companyName">Company Name</label>
                    <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.companyName || ''} onChange={handleUserInfoChange}  type="text" name="companyName" id="companyName" />
                </div>}
                
            </div>
            <div className="flex flex-col mb-4">
                <label className="text-custom_gray text-xl font-bold" htmlFor="address">Address</label>
                <Autocomplete
                    value={userInfo.address || ''}  
                    onChange={handleUserInfoChange} 
                    name="address"
                />                        
            </div>
            <div>
                <label className="text-custom_gray text-xl font-bold" htmlFor="about">About</label>
                <textarea className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray p-2 my-2 text-lg w-full resize-none rounded-lg"  onChange={handleUserInfoChange}  value={userInfo.about || ''} name="about" id="about"></textarea>
            </div>
        </div>
    )
}