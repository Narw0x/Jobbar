const path = "/jobbar_logo.svg";
import Button from "./button";


export default function Header({ title }) {
    return (
        <header className="flex bg-white">
            <div className="flex justify-between w-[1440px] m-auto mt-2 mb-2">
                <div className="">
                    <img className="max-w-40 max-h-40 object-contain" src={path} alt="" />
                </div>
                <div>
                    <Button type="red-hover">Login</Button>
                </div>
            </div>
            <hr />
        </header>
    )

}