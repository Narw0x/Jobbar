import { useState, useEffect } from 'react';
import axios from 'axios';


export default function useFetchProfile(id, token, state){
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (state.user._id !== id) {
            axios.get(`https://jobbar-5m8u.onrender.com/api/profile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    setProfileData(response.data.payload.user);
                }
            })
            .catch((error) => {
                console.error('Error fetching profile:', error);
                setError('An error occurred while fetching the profile. Please try again.');
            });
        } else {
            setProfileData(state.user);
        }
    }, [id, token, state.user]);

    return { profileData, error };
};