import { Outlet } from 'react-router-dom';


export default function AdminRootLayout() {
    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    )
}