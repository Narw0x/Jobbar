import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProfilePage() {
    const authState = useSelector((state) => state.auth);

    return (
        <section className="bg-custom_bg_gray py-8">
            <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white">
                <div className="w-full object-fill">
                    <img className="w-full max-h-[250px]" src="/default_bg.png" alt="" />
                </div>
                <div className="flex items-center">
                    <div className="w-40 h-40 rounded-lg border border-custom_gray mx-8">
                        <img className="object-cover rounded-lg" src="/fabko.jpg" alt="" />
                    </div>
                    <div className="ml-4 flex-1">
                        <h2 className="text-lg font-semibold" id="UserName">{authState.user?.firstName || authState.user?.companyName}</h2>
                        <p className="text-sm text-gray-500">
                            Field in which the user is situated in
                        </p>
                    </div>

                    <div className="m-4">
                        <Link
                            to={`/profile/${authState.user._id}/edit`}
                        >
                            <img className="rotate-90" src="/settings.svg" alt="" />
                        </Link>
                        
                    </div>


                </div>

                
            </div>
            <div>
                <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                    <h2 className="text-lg font-semibold">About</h2>
                    <p className="text-sm text-gray-500">
                        A little bit about the user
                    </p>
                </div>
                <div className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white mt-4 p-8">
                    <h2 className="text-lg font-semibold">Experience</h2>
                    <p className="text-sm text-gray-500">
                        The user's experience
                    </p>
                </div>
            </div>
        </section>
    )
}