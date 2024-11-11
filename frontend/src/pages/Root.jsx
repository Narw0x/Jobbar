import Footer from "../components/footer";
import Header from "../components/header";

import { Outlet, useSubmit, useLoaderData } from 'react-router-dom';
import { useEffect } from 'react';

import { getTokenDuration } from '../util/auth';



export function RootLayout(){
    const token = useLoaderData();
    const submit = useSubmit();

    useEffect(() => {
        if(!token){
          return;
        }
    
        if(token === 'EXPIRED'){
          submit(null, { method: 'post', action: '/' });
          return;
        }
    
        const tokenDuration = getTokenDuration();
    
        setTimeout(() => {
          submit(null, { method: 'post', action: '/' });
        }, tokenDuration);
    },[token, submit]);

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