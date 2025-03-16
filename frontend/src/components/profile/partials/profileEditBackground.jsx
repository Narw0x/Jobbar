import { FileUpload } from "primereact/fileupload";
import Button from "../../button"

export default function ProfileEditBackground({state, bgImage, setBgImage, bgPreview, onSelectBg, userInfo}) {
    return ( 
        <div>
            <div className="w-full object-fill flex end flex-col">
                <img className="w-full min-h-[150px] max-h-[250px] rounded-t" src={state.user.bgImage === bgPreview ? `https://jobbar-5m8u.onrender.com/public/background/${userInfo?.bgImage}`:`${bgPreview}`} alt="" />
                <hr className="bg-black"/>
            </div>
            <div className="flex m-4 ml-auto justify-end gap-4">
                <FileUpload
                    mode="basic" 
                    name="demo[]" 
                    accept=".png, .jpg, .jpeg" 
                    auto = {false}
                    maxFileSize={1000000} 
                    unstyled={true}
                    onSelect={onSelectBg}
                    className="border-[1px] bg-custom_red text-white border-custom_red hover:bg-white hover:text-custom_red hover:border-custom_red py-2 px-4 rounded transition-all duration-300 ease-in-out cursor-pointer"
                />
                {bgImage !== state.user.bgImage ? <Button type="button" onClick={() => {setBgImage(state.user.bgImage)}} btnStyle="red-default">Delete</Button>: null}
            </div>
        </div>
    )
}