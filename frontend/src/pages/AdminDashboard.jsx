import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


export default function AdminDashboard() {

    const [dataLength, setDataLength] = useState({
        user: 0,
        jobOffers: 0,
        reports: 0
    });

    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        axios.get('http://localhost:4000/api/admin/length', {
            headers: {
                Authorization: `Bearer ${authState.token}`
            }
        })
            .then((res) => {
                setDataLength({
                    user: res.data.payload.users,
                    jobOffers: res.data.payload.companies,
                    reports: res.data.payload.reports
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
    , [authState.token]);




    return (
        <section className="flex flex-col items-center justify-center bg-custom_bg_gray">
            <div className="container border rounded-lg shadow-md bg-white m-8 p-8">
                <h1 className="text-2xl text-custom_gray font-bold">Admin Dashboard</h1>
                <p className="text-custom_gray text-lg ">Welcome, Admin!</p>

                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl text-custom_gray font-bold">Total Users</h2>
                        <p className="text-custom_gray text-lg">{dataLength.user}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl text-custom_gray font-bold">Total Job Offers</h2>
                        <p className="text-custom_gray text-lg">{dataLength.jobOffers}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl text-custom_gray font-bold">Total Reports</h2>
                        <p className="text-custom_gray text-lg">{dataLength.reports}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
