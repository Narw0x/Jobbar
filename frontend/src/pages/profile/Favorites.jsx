import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Toast } from "primereact/toast"
import axios from "axios"
import { useDispatch } from "react-redux"
import { updateUser } from "./../../store/slices/authSlice"
import { useLocation } from "react-router-dom"

import Favourite from "../../components/favourite/favourite"
import { Helmet } from "react-helmet"


export default function FavoritePage() {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const authState = useSelector(state => state.auth);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`https://jobbar-5m8u.onrender.com/api/profile/favorite`, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
                id: `${authState.user._id}`
            }
        }).then(response => {
            if(response.data.payload.favoriteUsers.length === 0){
                toast.current?.show({severity: 'info', summary: 'Info', detail: 'You have no favorite users', life: 2000});
            }
            setFavorites(response.data.payload.favoriteUsers);
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        });
    }, [authState.token, authState.user.favoriteApplicants, authState.user._id]);



    const handleAddFavorite = (userId) => {
        axios.put(`https://jobbar-5m8u.onrender.com/api/profile/favorite/${userId}`, userId,
            {
                headers: {
                    Authorization: `Bearer ${authState.token}`,
                    id: `${authState.user._id}`
                },
            }
        ).then(response => {
            response.data.payload.state === 'added' ? toast.current?.show({severity: 'success', summary: 'Success', detail: 'User added to favorites', life: 2000}) : toast.current?.show({severity: 'success', summary: 'Success', detail: 'User removed from favorites', life: 2000});
            dispatch(updateUser(response.data.payload.user));

        }).catch(err => {
            console.log(err);
        });
    }


    const location = useLocation();
    const [messageState, setMessageState] = useState(location.state || null);
    useEffect(() => {
        if (location.state) {
            setMessageState(location.state);
            // Clear the location state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        if (messageState) {
            const timer = setTimeout(() => {
                switch (messageState.type) {
                    case 'success':
                        toast.current?.show({severity: 'success', summary: 'Success', detail: messageState.message, life: 2000});
                        break;
                    case 'error':
                        toast.current?.show({severity: 'error', summary: 'Error', detail: messageState.message, life: 2000});
                        break;
                    default:
                        break;
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [messageState]);

    return (
        <section className="bg-custom_bg_gray py-8 min-h-[61.5vh]">
            <Helmet>
                <title>Favorites | Jobbar</title>
            </Helmet>
            <Toast ref={toast}/>
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white p-8">
                <h2 className="lg:text-4xl text-2xl font-bold text-custom_gray mb-4">Your Favorite Users</h2>
                <Favourite isLoading={isLoading} favorites={favorites} handleAddFavorite={handleAddFavorite} />
            </div>
        </section>
    )
}