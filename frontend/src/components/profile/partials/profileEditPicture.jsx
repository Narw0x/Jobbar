import { FileUpload } from "primereact/fileupload";
import Button from "../../button";

export default function ProfileEditPicture({state, avatar, setAvatar, avatarPreview, onSelectPf, userInfo}) {
    return (
        <div className="md:basis-1/3 m-8 my-0 lg:mt-8 flex flex-col gap-4 pt-8">
            <img className="border border-black rounded-lg w-60 h-60 flex m-auto justify-center" src={state.user.avatar === avatarPreview ? `https://jobbar-5m8u.onrender.com/public/avatar/${userInfo?.avatar}`:`${avatarPreview}`} alt="" />
            <div className="flex justify-center gap-4 lg:mb-12">
                <FileUpload 
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
                avatar !== state.user.avatar ?
                    <Button 
                        type="button" 
                        onClick={() => {setAvatar(state.user.avatar);}} 
                        btnStyle="red-default"
                    >
                        Delete
                    </Button>
                        : 
                    null
                }
            </div>
        </div>
    )
}