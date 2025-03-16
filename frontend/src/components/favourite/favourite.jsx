import { useNavigate } from "react-router-dom"
import Loading from "../loading";
import FavouriteHeader from "./partials/favouriteHeader";
import FavouriteItem from "./partials/favouriteItem";

export default function Favourite({isLoading, favorites, handleAddFavorite}) {
    return (
        <>
            {isLoading === 0 && <Loading />}
            {favorites.length !== 0 && <FavouriteHeader />}
            {favorites.length !== 0  && favorites.map((favorite) => (
                <FavouriteItem favorite={favorite} handleAddFavorite={handleAddFavorite} />
            ))}
        </>
    )
}