import { useNavigate } from "react-router-dom"

import Button from "../../button"

export default function FavouriteItem({favorite, handleAddFavorite}) {
    const navigate = useNavigate();
    return (
        <div key={favorite._id} className="flex lg:flex-row flex-col items-center justify-between py-2  border-b border-gray-200">
            <div className="flex flex-row justify-between lg:basis-1/2 w-full items-center">
                <div className="flex basis-1/2 text-left">
                    {favorite.firstName}
                </div>
                <div className="flex basis-1/2 text-left justify-end lg:justify-start max-w-24 md:max-w-full">
                    <p className="truncate">
                        {favorite.email}
                    </p>
                </div>
            </div>
            <div className="flex flex-row md:justify-end justify-between lg:basis-1/2 w-full  gap-4">
                <div className=" text-custom_red flex items-center">
                    <button onClick={() => handleAddFavorite(favorite._id)} className="text-custom_blue">Remove</button>
                </div>
                <Button
                    btnStyle='red-hover'
                    onClick={() => navigate(`/profile/${favorite._id}`)}
                >
                    View Profile
                </Button>
            </div>
        </div>
    )
}