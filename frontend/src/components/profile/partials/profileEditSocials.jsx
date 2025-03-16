export default function ProfileEditSocials({ userInfo, handleUserSocialChange }) {
    return (
        <div className="flex md:flex-row flex-col mb-4 w-full justify-between">
            <div className="md:w-[30%] flex flex-col">
                <label className="text-custom_gray text-xl font-bold" htmlFor="twitter">Twitter</label>
                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.twitter || ''} type="text" name="twitter" id="twitter" placeholder="username" />
            </div>
            <div className="md:w-[30%] flex flex-col">
                <label className="text-custom_gray text-xl font-bold" htmlFor="instagram">Instagram</label>
                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.instagram || ''} type="text" name="instagram" id="instagram" placeholder="username" />
            </div>
            <div className="md:w-[30%] flex flex-col">
                <label className="text-custom_gray text-xl font-bold" htmlFor="github">Github</label>
                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.github || ''} type="text" name="github" id="github" placeholder="username" />
            </div>
        </div>
    )
}