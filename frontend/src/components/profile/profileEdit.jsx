import NavigationButtons from "../navigationButtons";
import ProfileEditBackground from "./partials/profileEditBackground";
import ProfileEditInfo from "./partials/profileEditInfo";
import ProfileEditPersonal from "./partials/profileEditPersonal";
import ProfileEditPicture from "./partials/profileEditPicture";
import ProfileEditSocials from "./partials/profileEditSocials";

export default function ProfileEdit({state, userInfo, handleUserInfoChange, handleUserSocialChange, onSelectPf, onSelectBg, avatar, setAvatar, bgImage, setBgImage, bgPreview, avatarPreview}) {
    return(
        <>
            <ProfileEditBackground state={state} bgImage={bgImage} setBgImage={setBgImage} bgPreview={bgPreview} onSelectBg={onSelectBg} userInfo={userInfo}/>
            <h2 className="text-custom_gray font-bold text-3xl m-8 mb-0">Personal Information</h2>
            <div className="flex flex-col-reverse lg:flex-row rounded-lg border border-black m-8 justify-between mt-4">
                <ProfileEditPersonal userInfo={userInfo} handleUserInfoChange={handleUserInfoChange}/>
                <ProfileEditPicture state={state} avatar={avatar} setAvatar={setAvatar} avatarPreview={avatarPreview} onSelectPf={onSelectPf} userInfo={userInfo}/> 
            </div>
            <h2 className="text-custom_gray font-bold text-3xl m-8 mb-0">Contact</h2>
            <div className="flex rounded-lg border border-black m-8 justify-between mt-4 flex-col">
                <div className="flex md:flex-row flex-col m-8 mb-4 justify-between">
                    <ProfileEditInfo userInfo={userInfo} handleUserInfoChange={handleUserInfoChange}/>
                </div>
                <div className="flex flex-row m-8 mt-0">
                    <ProfileEditSocials userInfo={userInfo} handleUserSocialChange={handleUserSocialChange}/>
                </div>
            </div>
            <div className="flex justify-center m-8 gap-4">
                <NavigationButtons btnText={"Cancel"} route={`/profile/${state.user._id}`}/>
            </div>
        </>
    )}