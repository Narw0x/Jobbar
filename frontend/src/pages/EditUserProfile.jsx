import { useDispatch, useSelector } from "react-redux"
import { updateUser } from "../store/slices/authSlice"
import { useState, useEffect } from "react"
import { FileUpload } from 'primereact/fileupload';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Autocomplete from "../components/autocomplete";
import Button from "../components/button";

export default function EditUserProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        // Create a FormData object for sending files
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

        

        axios.put(`http://localhost:4000/api/profile/edit/${authState.user._id}`, formData, {
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
    
    
    return (
        <section className="bg-custom_bg_gray py-8">
            <form className="max-w-[1440px] w-[70%] mx-auto  border rounded-lg shadow-md bg-white" onSubmit={handleEditForm}>
                <div>
                    <div className="w-full object-fill flex end flex-col">
                        <img className="w-full max-h-[250px] rounded-t" src={authState.user.bgImage === bgPreview ? `http://localhost:4000/public/background/${userInfo?.bgImage}`:`${bgPreview}`} alt="" />
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
                        {bgImage !== authState.user.bgImage ? <Button type="button" onClick={() => {setBgImage(authState.user.bgImage)}} style="red-default">Delete</Button>: null}
                    </div>
                </div>
                <h2 className="text-custom_gray font-bold text-3xl m-8 mb-0">Personal Information</h2>
                <div className="flex rounded-lg border border-black m-8 justify-between mt-4">
                    <div className="basis-2/3 flex flex-col m-8">
                        <div className="flex justify-between  mb-4">
                            <div className="flex flex-col w-[45%]">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="firstName">First Name</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.firstName || ''} onChange={handleUserInfoChange} type="text" name="firstName" id="firstName" />    
                            </div>
                            <div className="flex flex-col w-[45%]">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="lastName">Last Name</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" value={userInfo.lastName || ''} onChange={handleUserInfoChange}  type="text" name="lastName" id="lastName" />
                            </div>
                            
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
                        <img className="border border-black rounded-lg w-60 h-60 flex m-auto justify-center" src={authState.user.avatar === avatarPreview ? `http://localhost:4000/public/avatar/${userInfo?.avatar}`:`${avatarPreview}`} alt="" />
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
                            avatar !== authState.user.avatar ?
                                <Button 
                                    type="button" 
                                    onClick={() => {setAvatar(authState.user.avatar);}} 
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
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.twitter || ''} type="text" name="twitter" id="twitter" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="instagram">Instagram</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.instagram || ''} type="text" name="instagram" id="instagram" />
                            </div>
                            <div className="w-[30%] flex flex-col">
                                <label className="text-custom_gray text-xl font-bold" htmlFor="github">Github</label>
                                <input className="bg-white focus:bg-white focus:border-custom_gray border border-custom_gray rounded p-2 my-2 text-lg" onChange={handleUserSocialChange}  value={userInfo.socialMedia.github || ''} type="text" name="github" id="github" />
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
                                navigate(`/profile/${authState.user._id}`);
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