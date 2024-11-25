// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('id'),
        expiration: localStorage.getItem('expiration'), 
        type: localStorage.getItem('type'),
        user: localStorage.getItem('user')
    });

    const login = (token, userId, type, user) => {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 3);
        localStorage.setItem('token', token);
        localStorage.setItem('id', userId);
        localStorage.setItem('expiration', expiration.toISOString());
        localStorage.setItem('type', type);
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuthState({ token, userId, expiration, type, user });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('expiration');
        localStorage.removeItem('type');
        localStorage.removeItem('user');
        setAuthState({ token: null, userId: null, expiration: null, type: null, user: null });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
