import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Dashboard from '../../components/admin/dashboard';


export default function AdminDashboard() {

    const [dataLength, setDataLength] = useState({
        user: 0,
        jobOffers: 0,
        reports: 0
    });

    const adminState = useSelector((state) => state.admin);

    useEffect(() => {
        axios.get('https://jobbar-5m8u.onrender.com/api/admin/length', {
            headers: {
                Authorization: `Bearer ${adminState.adminToken}`
            }
        })
            .then((res) => {
                setDataLength({
                    user: res.data.payload.users,
                    jobOffers: res.data.payload.jobOffers,
                    reports: res.data.payload.reports
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [adminState.adminToken]);

    return (
        <section className=" bg-custom_bg_gray p-8 min-h-[61.5vh] mx-auto mb-auto">
            <Helmet>
                <title>Admin Dashboard | Jobbar</title>
            </Helmet>
            <Dashboard dataLength={dataLength}/>
        </section>
    )
}
