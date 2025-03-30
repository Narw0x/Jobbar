import {  useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Toast } from 'primereact/toast';
import { tailspin, bouncy } from 'ldrs'

import { Helmet } from "react-helmet";
import ProfileHeader from "../../../components/profile/profileHeader";
import ProfileAbout from "../../../components/profile/profileAbout";
import ProfileExperience from "../../../components/profile/profileExperience";
import ProfileEducation from "../../../components/profile/profileEducation";
import ProfileContact from "../../../components/profile/profileContact";
import JobsLayout from "../../../components/jobs/jobsLayout";


export default function AdminProfilePage() {
    const toast = useRef(null);
    const { userId } = useParams();
    const adminState = useSelector((state) => state.admin);
    const [profileData, setProfileData] = useState(null); 
    tailspin.register();
    bouncy.register();


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

    useEffect(() => {
            axios.get(`https://jobbar-5m8u.onrender.com/api/profile/${userId}`, {
                headers: {
                    Authorization: `Bearer ${adminState.adminToken}`, // Include the token in the Authorization header
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        setProfileData(response.data.payload.user); // Update state with fetched user data
                    }
                })
                .catch((error) => {
                    setMessageState({type: 'error', message: 'An error occurred while fetching the user data. Please try again.'});
                });
        }, [userId, adminState.adminToken]);


    const jobsLayout = useMemo(() => {
        if (profileData && profileData.role === 'company') {
            return (
                <JobsLayout
                    id={profileData._id}
                    jobs={profileData.jobOffers}
                    isCurrentUser={false}
                    token={adminState.adminToken}
                />
            );
        }
        return null;
    }, [profileData, adminState.adminToken]);


    if (!profileData) {
        return (
            <section className="bg-custom_bg_gray py-8">
                <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white flex justify-center p-8">
                    <l-tailspin size="40"stroke="5"speed="0.9" color='gray' ></l-tailspin>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-custom_bg_gray py-8">
            <Helmet>
                <title>{`Profile | ${profileData.firstName ? profileData.firstName : profileData.companyName} | Jobbar`}</title>
            </Helmet>
            <Toast ref={toast}/>
            <ProfileHeader profileData={profileData} isCurrentUser={false} setMessageState={setMessageState} />
            <ProfileAbout aboutText={profileData.about} />
            <ProfileExperience experience={profileData.experience} isCurrentUser={false} />
            <ProfileEducation education={profileData.education} isCurrentUser={false} />
            {jobsLayout} 
            <ProfileContact contact={profileData} />
        </section>
    );
}
