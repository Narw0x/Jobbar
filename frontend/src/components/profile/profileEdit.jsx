import NavigationButtons from "../navigationButtons";
import ProfileEditBackground from "./partials/profileEditBackground";
import ProfileEditInfo from "./partials/profileEditInfo";
import ProfileEditPersonal from "./partials/profileEditPersonal";
import ProfileEditPicture from "./partials/profileEditPicture";
import ProfileEditSocials from "./partials/profileEditSocials";

export default function ProfileEdit({state, userInfo, handleUserInfoChange, handleUserSocialChange, onSelectPf, onSelectBg, avatar, bgPreview, avatarPreview, onDeleteBg, onDeletePf, profilePicture, backgroundPicture, onResetBg, onResetPf}) {
    const route = state.user?._id ? `/profile/${state.user._id}` : `/xyz/users/`;
    return(
        <>
            <ProfileEditBackground onDeleteBg={onDeleteBg} backgroundPicture={backgroundPicture} bgPreview={bgPreview} onSelectBg={onSelectBg} userInfo={userInfo} onResetBg={onResetBg} />
            <h2 className="text-custom_gray font-bold text-3xl m-8 mb-0">Personal Information</h2>
            <div className="flex flex-col-reverse lg:flex-row rounded-lg border border-black m-8 justify-between mt-4">
                <ProfileEditPersonal userInfo={userInfo} handleUserInfoChange={handleUserInfoChange}/>
                <ProfileEditPicture  avatar={avatar} profilePicture={profilePicture} onDeletePf={onDeletePf} avatarPreview={avatarPreview} onSelectPf={onSelectPf} userInfo={userInfo} onResetPf={onResetPf}/> 
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
                <NavigationButtons btnText={"Cancel"} route={route}/>
            </div>
        </>
    )}