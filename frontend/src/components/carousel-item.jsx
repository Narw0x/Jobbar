export default function CarouselItem({author, title, description, image = "default_profile.svg"}){
    return(
        <div className="flex md:flex-row flex-col items-center justify-center my-16 mx-auto w-[95%]">
            <div className="">
                <img className="rounded-full border border-3 border-custom_gray max-w-[85%] p-4 mx-auto md:m-0" src={`http://localhost:4000/public/avatar/${image}`} alt="" />
            </div>
            
            <div className=" mt-4">
                <h4 className="lg:text-5xl text-2xl text-custom_gray font-bold text-center md:text-left">{title}</h4>
                <p  className="lg:text-2xl  text-lg text-custom_gray  text-center md:text-left">{author}</p>
                <p className="text-custom_red lg:text-xl text-center md:text-left">{description}</p>
            </div>
        </div>
    )
}