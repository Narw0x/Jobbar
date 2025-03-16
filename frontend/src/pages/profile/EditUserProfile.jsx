import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../../store/slices/authSlice"
import { useState, useEffect } from "react"
import { FileUpload } from 'primereact/fileupload';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Autocomplete from "../../components/autocomplete";
import Button from "../../components/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { isValidAddress, isValidPhoneNumber, isValidText } from "../../util/validation";
import { useLocation } from "react-router";
import ProfileEdit from "../../components/profile/profileEdit";
import { Helmet } from "react-helmet";

export default function EditUserProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useRef(null);


    const authState = useSelector((state) => state.auth);

    const [bgImage, setBgImage] = useState(authState.user.bgImage);
    const [avatar, setAvatar] = useState(authState.user.avatar);

    const [bgPreview, setBgPreview] = useState(authState.user.bgImage);
    const [avatarPreview, setAvatarPreview] = useState(authState.user.avatar);

    const [userInfo, setUserInfo] = useState({
        firstName: authState.user.firstName,
        lastName: authState.user.lastName,
        companyName: authState.user.companyName,
        address: authState.user.address,
        about: authState.user.about,
        phoneNumber: authState.user.phoneNumber,
        website: authState.user.website,
        socialMedia: {
            twitter: authState.user.socialMedia.twitter,
            instagram: authState.user.socialMedia.instagram,
            github: authState.user.socialMedia.github,
        },
        bgImage: authState.user.bgImage,
        avatar: authState.user.avatar,
        role: authState.user.role,
    });

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
        
        for (const key in userInfo) {
            if (key === 'socialMedia') {
                for (const socialKey in userInfo[key]) {
                    formData.append(`socialMedia[${socialKey}]`, userInfo[key][socialKey].toString());
                }
            } else {
                formData.append(key, userInfo[key]);
            }
        }

        if (bgImage) formData.append('bgImage', bgImage);
        if (avatar) formData.append('avatar', avatar);

        axios.put(`https://jobbar-5m8u.onrender.com/api/profile/edit/${authState.user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${authState.token}`,
            },
        })
        .then((response) => {
            dispatch(updateUser(response.data.payload.user));
            navigate(`/profile/${authState.user._id}`, { state: { message: response.data.message, type: 'success' }});
        }).catch((error) => {
            navigate(`/profile/${authState.user._id}`, { state: { message: error.response.data.message, type: 'error' } });
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
            <Helmet>
                <title>{`Settings | Jobbar`}</title>
            </Helmet>
            <Toast ref={toast} />
            <form className="max-w-[1440px] 2xl:w-[60%] xl:w-[80%] w-[90%] mx-auto  border rounded-lg shadow-md bg-white" onSubmit={handleEditForm}>
                <ProfileEdit state={authState} bgImage={bgImage} setBgImage={setBgImage} bgPreview={bgPreview} onSelectBg={onSelectBg} avatar={avatar} setAvatar={setAvatar} avatarPreview={avatarPreview} onSelectPf={onSelectPf} userInfo={userInfo} handleUserInfoChange={handleUserInfoChange} handleUserSocialChange={handleUserSocialChange} />
            </form>
        </section>
    )
}