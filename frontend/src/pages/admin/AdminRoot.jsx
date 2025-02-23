import { Outlet } from 'react-router-dom';
import AdminHeader from '../../components/adminHeader';
import Footer from '../../components/footer';


export default function AdminRootLayout() {
    return (
        <>
            <AdminHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}