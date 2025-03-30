import { FileUpload } from "primereact/fileupload";
import Button from "../../button";

export default function ProfileEditPicture({profilePicture, avatar, onDeletePf, avatarPreview, onSelectPf, userInfo, onResetPf}) {
    return (
        <div className="basis-1/3 m-8 flex flex-col gap-4 pt-8">
            <img className="border border-black rounded-lg w-60 h-60 flex m-auto justify-center" src={userInfo.avatar === avatarPreview ? `https://jobbar-5m8u.onrender.com/public/avatar/${userInfo?.avatar}`: avatarPreview === 'default_profile.svg' ? `https://jobbar-5m8u.onrender.com/public/avatar/${avatarPreview}`: `${avatarPreview}`} alt="" />
            <div className="flex justify-center gap-4">
                <FileUpload 
                    ref={profilePicture}
                    mode="basic" 
                    name="demo[]" 
                    accept=".png, .jpg, .jpeg" 
                    auto = {false} 
                    maxFileSize={1000000} 
                    unstyled={true}
                    onSelect={onSelectPf} 
                    className="border-[1px] bg-custom_red text-white border-custom_red hover:bg-white hover:text-custom_red hover:border-custom_red py-2 px-4 rounded transition-all duration-300 ease-in-out cursor-pointer" 
                />
                {
                avatar !== userInfo.avatar &&
                    <Button 
                        type="button" 
                        onClick={() => {onDeletePf()}} 
                        btnStyle="red-default"
                    >
                        Delete
                    </Button>
                }
                {'default_profile.svg' !== userInfo.avatar &&
                    <Button 
                        type="button" 
                        onClick={() => {onResetPf()}} 
                        btnStyle="red-default"
                    >
                        Reset
                    </Button>
                }
            </div>
        </div>
    )
}