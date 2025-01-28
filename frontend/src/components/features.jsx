export default function Features({title, description, image}){
    return(
        <div className="flex flex-row md:ml-8 lg:ml-[20%] mt-4">
            <img className="md:w-[27%]" src={`../${image}.svg`} alt="" />
            <div className="text-left ">
                <h4 className="text-xl text-custom_gray font-bold">{title}</h4>
                <p className="text-custom_red">{description}</p>
            </div>
        </div>
    )
}