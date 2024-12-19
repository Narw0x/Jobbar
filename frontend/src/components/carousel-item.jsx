export default function CarouselItem({author, title, description, image = "default_profile.svg"}){
    return(
        <div className="flex flex-row items-center justify-center my-16 mx-auto w-[95%]">
            <div className="">
                <img className="rounded-full border border-3 border-custom_gray max-w-[85%] p-4" src={`http://localhost:4000/public/avatar/${image}`} alt="" />
            </div>
            
            <div className=" mt-4">
                <h4 className="text-5xl text-custom_gray font-bold ">{title}</h4>
                <p  className="text-2xl text-custom_gray  ">{author}</p>
                <p className="text-custom_red text-xl">{description}</p>
            </div>
        </div>
    )
}