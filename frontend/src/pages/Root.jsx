import { Outlet } from 'react-router-dom';

import Footer from "../components/footer";
import Header from "../components/header";

export function RootLayout(){
    return(
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}