const path = "/jobbar_logo.svg";
import Button from "./button";


export default function Header({  }) {
    return (
        <header className="flex flex-col bg-white w-[100%]">
            <div className="flex justify-between max-w-[1440px] m-auto mt-2 mb-2">
                <div className="">
                    <img className="max-w-40 max-h-40 object-contain" src={path} alt="" />
                </div>
                <div className="flex justify-center mb-auto mt-auto gap-4">
                    <Button type="gray-hover">Login</Button>
                    <Button type="gray-default">Register</Button>
                </div>
            </div>
            <hr className="h-1 bg-custom_gray"/>
        </header>
    )

}