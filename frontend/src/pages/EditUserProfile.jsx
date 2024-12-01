
import { useSelector } from "react-redux"


export default function EditUserProfilePage() {

    const authState = useSelector((state) => state.auth);

    

    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full max-h-[250px]" src="/default_bg.png" alt="" />
                </div>
                <div className="flex items-center">
                    <div className="w-40 h-40 rounded-lg mx-8">
                        <img className="object-cover rounded-lg" src="/fabko.jpg" alt="" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h2 className="text-lg font-semibold" id="UserName">User_name</h2>
                        <p className="text-sm text-gray-500">
                            Field in which the user is situated in
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <p>Haolo</p>
                
            </div>
        </section>
    )
}