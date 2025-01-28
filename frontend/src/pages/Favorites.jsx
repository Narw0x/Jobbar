import { useRef, useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Toast } from "primereact/toast"
import axios from "axios"
import { useDispatch } from "react-redux"
import { updateUser } from "../store/slices/authSlice"
import { useLocation } from "react-router-dom"

import Button from "../components/button"
import { useNavigate } from "react-router-dom"
import { bouncy } from "ldrs"


export default function FavoritePage() {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    bouncy.register();

    const authState = useSelector(state => state.auth);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        axios.get(`http://localhost:4000/api/profile/favorite`, {
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
    }, [authState.token, authState.user.favoriteApplicants]);



    const handleAddFavorite = (userId) => {
        axios.put(`http://localhost:4000/api/profile/favorite/${userId}`, userId,
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
         <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast}/>
            
            <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white p-8">
                <h2 className="text-4xl font-bold text-custom_gray mb-4">Your Favorite Users</h2>
                {isLoading === 0 && (
                    <div className="flex justify-center">
                        <l-bouncy
                        size="45"
                        speed="1.75" 
                        color="gray" 
                        ></l-bouncy>
                    </div>
                )}
               {favorites.length !== 0 && (<div>
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
                </div>)}
                {favorites.length !== 0  && favorites.map((favorite) => (
                    <div key={favorite._id} className="flex lg:flex-row flex-col items-center justify-between py-2  border-b border-gray-200">
                        <div className="flex flex-row justify-between lg:basis-1/2 w-full items-center">
                            <div className="flex basis-1/2 text-left">
                                {favorite.firstName}
                            </div>
                            <div className="flex basis-1/2 text-left justify-end lg:justify-start">
                                {favorite.email}
                            </div>
                        </div>
                        <div className="flex flex-row justify-end lg:basis-1/2 w-full  gap-4">
                            
                            <div className=" text-custom_red flex items-center">
                                <button onClick={() => handleAddFavorite(favorite._id)} className="text-custom_blue">Remove</button>
                            </div>
                            <Button
                                style='red-hover'
                                onClick={() => navigate(`/profile/${favorite._id}`)}
                            >
                                View Profile
                            </Button>
                        </div>
                    </div>
                ))}

            </div>
        </section>
    )
}