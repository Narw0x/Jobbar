import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useLocation } from "react-router";
import { isValidAddress, isValidEmail, isValidPhoneNumber, isValidText } from "../../../util/validation";
import { Toast } from "primereact/toast";
import { Helmet } from "react-helmet";
import ProfileEdit from "../../../components/profile/profileEdit";

export default function AdminUserEditPage() {

    const adminState = useSelector((state) => state.admin);
    const {userId} = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const profilePicture = useRef(null);
    const backgroundPicture = useRef(null);
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        address: '',
        about: '',
        phoneNumber: '',
        website: '',
        socialMedia: {
            twitter: '',
            instagram: '',
            github: ''
        },
        bgImage: 'default_bg.png',
        avatar: 'default_profile.svg',
        role: ''
    });

    const [bgImage, setBgImage] = useState(userInfo.bgImage);
    const [avatar, setAvatar] = useState(userInfo.avatar);
    const [bgPreview, setBgPreview] = useState(userInfo.bgImage);
    const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar);

    useEffect(() => {
        axios.get(`https://jobbar-5m8u.onrender.com/api/admin/edit/${userId}`,{
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                setUserInfo(res.data.payload.user);
                setBgPreview(res.data.payload.user.bgImage);
                setAvatarPreview(res.data.payload.user.avatar);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userId, adminState.adminToken]);

    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUserSocialChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevState) => ({
            ...prevState,
            socialMedia: {
                ...prevState.socialMedia,
                [name]: value,
            },
        }));
    }

    useEffect(() => {
        return () => {
            if (bgPreview && bgPreview.startsWith("blob:")) {
                URL.revokeObjectURL(bgPreview);
            }
            if (avatarPreview && avatarPreview.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [bgPreview, avatarPreview]);


    const onSelectBg = (e) => {
        const file = e.originalEvent.target.files[0];
        if (file) {
          setBgImage(file); // Store the actual file object for upload
          // Optional: Create URL for preview
          const previewUrl = URL.createObjectURL(file);
          setBgPreview(previewUrl); // If you need to show a preview
        }
    };


    const onSelectPf = (e) => {
        const file = e.originalEvent.target.files[0];
        if (file) {
          setAvatar(file); // Store the actual file object for upload
          // Optional: Create URL for preview
          const previewUrl = URL.createObjectURL(file);
          setAvatarPreview(previewUrl); // If you need to show a preview
        }
    };

    const onDeleteBg = () => {
        setBgImage(userInfo.bgImage);
        setBgPreview(userInfo.bgImage);
        if (backgroundPicture.current) {
            backgroundPicture.current.clear();
        }
    }
    const onDeletePf = () => {
        setAvatar(userInfo.avatar);
        setAvatarPreview(userInfo.avatar);
        if (profilePicture.current) {
            profilePicture.current.clear();
        }
    }

    const onResetBg = () => {
        setBgImage('default_bg.png');
        setBgPreview('default_bg.png');
        if (backgroundPicture.current) {
            backgroundPicture.current.clear();
        }
    }

    const onResetPf = () => {
        setAvatar('default_profile.svg');
        setAvatarPreview('default_profile.svg');
        if (profilePicture.current) {
            profilePicture.current.clear();
        }
    }

    const handleEditForm = (e) => {
        e.preventDefault();

        if(userInfo.role === 'user' && (!isValidText(userInfo.firstName) || !isValidText(userInfo.lastName))){
            setMessageState({type: 'error', message: 'Please provide a valid name'});
            return;
        }

        if(userInfo.role === 'company' && !isValidText(userInfo.companyName)){
            setMessageState({type: 'error', message: 'Please provide a valid company name'});
            return;
        }

        if(!isValidEmail(userInfo.email)){
            setMessageState({type: 'error', message: 'Please provide a valid email'});
            return;
        }

        if(!isValidText(userInfo.about, 1, 500)){
            setMessageState({type: 'error', message: 'Please provide a valid about section'});
            return;
        }

        if(!isValidAddress(userInfo.address)){
            setMessageState({type: 'error', message: 'Please provide a valid address'});
            return;
        }

        if(userInfo.phoneNumber && !isValidPhoneNumber(userInfo.phoneNumber)){
            setMessageState({type: 'error', message: 'Please provide a valid phone number'});
            return;
        }

        if(userInfo.website && !isValidText(userInfo.website)){
            setMessageState({type: 'error', message: 'Please provide a valid website'});
            return;
        }

        for (const key in userInfo.socialMedia) {
            if (userInfo.socialMedia[key] && !isValidText(userInfo.socialMedia[key])) {
                setMessageState({type: 'error', message: 'Please provide a valid social media link'});
                return;
            }
        }

        

        const formData = new FormData();
        
        // Add all userInfo fields to formData
        for (const key in userInfo) {
            if (key === 'socialMedia') {
                for (const socialKey in userInfo[key]) {
                    formData.append(`socialMedia[${socialKey}]`, userInfo[key][socialKey].toString());
                }
            } else {
                formData.append(key, userInfo[key]);
            }
        }

        

        // Add the image files if they exist
        if (bgImage) {
            formData.append('bgImage', bgImage);
            
        }
        if (avatar) {
            formData.append('avatar', avatar);
        }

        axios.put(`https://jobbar-5m8u.onrender.com/api/admin/edit/${userId}`, formData, {
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                console.log(res.data);
                navigate(`/xyz/users`, {state: {type: 'success', message: 'User updated successfully'}});
            })
            .catch((err) => {
                console.log(err);
                navigate(`/xyz/users`, {state: {type: 'error', message: err.response.data.message}});
            }
        )

        
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
        <section className="flex flex-col items-center justify-center bg-custom_bg_gray">
            <Toast ref={toast} />
            <Helmet>
                <title>Edit User | Jobbar</title>
            </Helmet>
            <form className="container mx-auto  border rounded-lg shadow-md bg-white my-8" onSubmit={handleEditForm}>
                <ProfileEdit state={adminState} bgPreview={bgPreview} onSelectBg={onSelectBg} avatar={avatar}  avatarPreview={avatarPreview} onSelectPf={onSelectPf} userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} handleUserSocialChange={handleUserSocialChange} onDeleteBg={onDeleteBg} onDeletePf={onDeletePf} profilePicture={profilePicture} backgroundPicture={backgroundPicture} onResetBg={onResetBg} onResetPf={onResetPf} />
            </form>
        </section>
    )
}