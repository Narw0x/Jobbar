import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FileUpload } from "primereact/fileupload";
import Button from "../components/button";
import Autocomplete from "../components/autocomplete";
import { useLocation } from "react-router";
import { isValidAddress, isValidEmail, isValidPhoneNumber, isValidText } from "../util/validation";
import { Toast } from "primereact/toast";

export default function AdminUserEditPage() {

    const adminState = useSelector((state) => state.admin);

    const {userId} = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);

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
    }, [userId]);

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

    useEffect(() => {
        document.title = "Edit User | Jobbar";
    }, []);



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
            <form className="container mx-auto  border rounded-lg shadow-md bg-white my-8" onSubmit={handleEditForm}>
                <div>
                    <div className="w-full object-fill flex end flex-col">
                        <img className="w-full max-h-[250px] rounded-t" src={userInfo.bgImage === bgPreview ? `https://jobbar-5m8u.onrender.com/public/background/${userInfo?.bgImage}`:`${bgPreview}`} alt="" />
                        <hr className="bg-black"/>
                    </div>
                    <div className="flex m-4 ml-auto justify-end gap-4">
                        <FileUpload
                            mode="basic" 
                            name="demo[]" 
                            accept=".png, .jpg, .jpeg" 
                            auto = {false}
                            maxFileSize={1000000} 
                            unstyled={true}
                            onSelect={onSelectBg}
                            className="border-[1px] bg-custom_red text-white border-custom_red hover:bg-white hover:text-custom_red hover:border-custom_red py-2 px-4 rounded transition-all duration-300 ease-in-out cursor-pointer"
                        />
                        {bgPreview !== userInfo.bgImage ? <Button type="button" onClick={() => {setBgPreview(userInfo.bgImage)}} style="red-default">Delete</Button>: null}
                    </div>
                </div>
                <h2 className="text-custom_gray font-bold text-3xl m-8 mb-0">Personal Information</h2>
                <div className="flex rounded-lg border border-black m-8 justify-between mt-4">
                    <div className="basis-2/3 flex flex-col m-8">
                        <div className="flex justify-between  mb-4">
                            {userInfo.role === 'user' && <div className="flex flex-col w-[45%]">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="firstName">First Name</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.firstName || ''} onChange={handleUserInfoChange} type="text" name="firstName" id="firstName" />    
                            </div>}
                            {userInfo.role === 'user' && <div className="flex flex-col w-[45%]">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="lastName">Last Name</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.lastName || ''} onChange={handleUserInfoChange}  type="text" name="lastName" id="lastName" />
                            </div>}
                            {userInfo.role === 'company' && <div className="flex flex-col w-full">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="companyName">Company Name</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.companyName || ''} onChange={handleUserInfoChange}  type="text" name="companyName" id="companyName" />
                            </div>}
                            
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="text-custom_gray text-xl font-bold" htmlFor="email">Email</label>
                            <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.email || ''} onChange={handleUserInfoChange}  type="email" name="email" id="email"/>
                        </div>
                        <div className="flex flex-col mb-4">
                            <label className="text-custom_gray text-xl font-bold" htmlFor="address">Address</label>
                            <Autocomplete
                                value={userInfo.address || ''}  
                                onChange={handleUserInfoChange} 
                            />                        
                        </div>
                        <div>
                            <label className="text-custom_gray text-xl font-bold" htmlFor="about">About</label>
                            <textarea className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray p-2 my-2 text-lg w-full resize-none rounded-lg"  onChange={handleUserInfoChange}  value={userInfo.about || ''} name="about" id="about"></textarea>
                        </div>
                    </div>
                    <div className="basis-1/3 m-8 flex flex-col gap-4 pt-8">
                        <img className="border border-black rounded-lg w-60 h-60 flex m-auto justify-center" src={userInfo.avatar === avatarPreview ? `https://jobbar-5m8u.onrender.com/public/avatar/${userInfo?.avatar}`:`${avatarPreview}`} alt="" />
                        <div className="flex justify-center gap-4">
                            <FileUpload 
                                mode="basic" 
                                name="demo[]" 
                                accept=".png, .jpg, .jpeg" 
                                auto = {false} 
                                maxFileSize={1000000} 
                                unstyled={true}
                                onSelect={onSelectPf} 
                                className="border-[1px] bg-custom_red text-white border-custom_red hover:bg-white hover:text-custom_red hover:border-custom_red py-2 px-4 rounded transition-all duration-300 ease-in-out cursor-pointer" 
                            />
                            {
                            avatar !== userInfo.avatar ?
                                <Button 
                                    type="button" 
                                    onClick={() => {setAvatar(userInfo.avatar);}} 
                                    style="red-default"
                                >
                                    Delete
                                </Button>
                                    : 
                                null
                            }
                        </div>
                    </div>
                </div>
                <h2 className="text-custom_gray font-bold text-3xl m-8 mb-0">Contact</h2>
                <div className="flex rounded-lg border border-black m-8 justify-between mt-4 flex-col">
                    <div className="flex flex-row m-8 mb-4 justify-between">
                        <div className="w-[30%] flex flex-col mb-4 ">
                            <label className="text-custom_gray text-xl font-bold" htmlFor="phone">Phone</label>
                            <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg "  onChange={handleUserInfoChange}  value={userInfo.phoneNumber || ''} type="phone" name="phoneNumber" id="phoneNumber" placeholder="+421 xxxxxxxxx"/>
                        </div>
                        <div className="w-[65%] flex flex-col mb-4">
                            <label className="text-custom_gray text-xl font-bold" htmlFor="website">Website</label>
                            <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg w-full"  onChange={handleUserInfoChange} value={userInfo.website || ''} type="text" name="website" id="website" />
                        </div>
                    </div>
                    <div className="flex flex-row m-8 mt-0">
                        <div className="flex flex-row mb-4 w-full justify-between">
                            <div className="w-[30%] flex flex-col">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="twitter">Twitter</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.twitter || ''} type="text" name="twitter" id="twitter" placeholder="https://x.com/username" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="instagram">Instagram</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.instagram || ''} type="text" name="instagram" id="instagram" placeholder="https://www.instagram.com/username" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="github">Github</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.github || ''} type="text" name="github" id="github" placeholder="https://github.com/username" />
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-center m-8 gap-4">
                        <Button 
                            style="red-hover"
                            type="button"
                            onClick={() => {
                                navigate(`/xyz/users`);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            style="red-default"
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    )
}