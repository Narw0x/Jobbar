import Footer from "../components/footer";
import Header from "../components/header";

import { Outlet } from 'react-router-dom';




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