export default function FavouriteHeader() {
    return (
        <div className="flex flex-row gap-4 justify-between">
            <div  className="flex flex-row justify-between w-full lg:basis-1/2">
                <div className="flex lg:basis-1/2 text-left  font-bold lg:text-xl text-custom_gray">
                    Name
                </div>
                <div className="flex lg:basis-1/2 text-left font-bold lg:text-xl text-custom_gray">
                    Email
                </div>
            </div>
            <div className="hidden lg:flex flex-row justify-end lg:basis-1/2">
                <div className="  font-bold md:text-xl text-custom_gray">
                    Actions
                </div>
            </div>
        </div>
    )
}