import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { Toast } from 'primereact/toast';
import { tailspin, bouncy } from 'ldrs';

import useFetchProfile from "../../hooks/useFetchProfile";

import ErrorPage from "../Error";
import ProfileHeader from "../../components/profile/profileHeader";
import ProfileAbout from "../../components/profile/profileAbout";
import ProfileExperience from "../../components/profile/profileExperience";
import ProfileEducation from "../../components/profile/profileEducation";
import ProfileContact from "../../components/profile/profileContact";
import JobsLayout from "../../components/jobs/jobsLayout";


export default function ProfilePage() {
    const toast = useRef(null);
    const { id } = useParams();
    const authState = useSelector((state) => state.auth);
    const location = useLocation();
    const [messageState, setMessageState] = useState(location.state || null);
    const { profileData, error } = useFetchProfile(id, authState.token, authState);

    tailspin.register();
    bouncy.register();

    useEffect(() => {
        if (location.state) {
            setMessageState(location.state);
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
        document.title = "Profile | Jobbar";
    }, []);


    const isCurrentUser = useMemo(() => authState.user._id === id, [authState.user._id, id]);

    const jobsLayout = useMemo(() => {
        if (profileData && profileData.role === 'company') {
            return (
                <JobsLayout
                    id={profileData._id}
                    jobs={profileData.jobOffers}
                    isCurrentUser={isCurrentUser}
                    token={authState.token}
                />
            );
        }
        return null;
    }, [profileData, isCurrentUser, authState.token]);

    if (error) {
        return <ErrorPage type="child" />;
    }

    if (!profileData) {
        return (
            <section className="bg-custom_bg_gray py-8">
                <div className="max-w-[1440px] w-[70%] mx-auto border rounded-lg shadow-md bg-white flex justify-center p-8">
                    <l-tailspin size="40" stroke="5" speed="0.9" color='gray' />
                </div>
            </section>
        );
    }

    return (
        <section className="bg-custom_bg_gray py-8">
            <Toast ref={toast} />
            <ProfileHeader profileData={profileData} isCurrentUser={isCurrentUser} setMessageState={setMessageState} />
            <ProfileAbout aboutText={profileData.about} />
            <ProfileExperience experience={profileData.experience} isCurrentUser={isCurrentUser} />
            <ProfileEducation education={profileData.education} isCurrentUser={isCurrentUser} />
            {jobsLayout}
            <ProfileContact contact={profileData} />
        </section>
    );
}
