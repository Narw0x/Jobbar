import { redirect } from "react-router-dom";

export function getTokenDuration() {
    let exporationDate = localStorage.getItem('exp');
    exporationDate = new Date(exporationDate);
    const now = new Date();
    const duration = exporationDate.getTime() - now.getTime();
    return duration;
}

export function getAuthToken() {
    const token = localStorage.getItem('token');

    if(!token) return null;

    const tokenDuration = getTokenDuration();
    if(tokenDuration <= 0) return "Expired";
    
    return token;
}

export function tokenLoader(){
    return getAuthToken();
}

export function checkAuthLoader(){
    const token = getAuthToken();

    if(!token){
        return redirect('/');
    }

    if(token === "Expired"){
        return redirect('/login', {state: {type: 'error', message: 'Session expired. Please login again.'}});
    }

    return null;
}