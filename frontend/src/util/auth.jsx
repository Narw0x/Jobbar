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

export function getUserRole(){
    const user = localStorage.getItem('user');
    if(!user) return null;

    const userType = JSON.parse(user).role;

    return userType;
}

export function checkCompanyLoader(){
    const role = getUserRole();


    if(!role){
        return redirect('/');
    }
    

    if(role === "company"){
        return redirect('/');
    }

    return null;
}

function getAdmin(){
    const admin = localStorage.getItem('admin');
    if(!admin) return null;

    console.log(admin);
    

    const isAdmin = JSON.parse(admin).role === "admin";


    return isAdmin;
}


export function checkAdminLoader(){
    const role = getAdmin();

    if(!role){
        return redirect('/');
    }

    return null;
}