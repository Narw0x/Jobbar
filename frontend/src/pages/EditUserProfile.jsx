
import { useSelector } from "react-redux"

import Button from "../components/button";

export default function EditUserProfilePage() {

    const authState = useSelector((state) => state.auth);

    

    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white">
                <div>
                    <div className="w-full object-fill flex end">
                        <img className="w-full max-h-[250px]" src={`/${authState.user.bgImage}`} alt="" />
                    </div>
                    <div className="flex m-4 ml-auto justify-end ">
                        <Button
                            style="red-hover"
                        >
                            Select
                        </Button>
                    </div>
                </div>    
                <div className="flex items-center">
                    
                </div>
            </div>
            <div>
                
            </div>
        </section>
    )
}