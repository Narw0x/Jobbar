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
        type: localStorage.getItem('type')
    });

    const login = (token, userId, type) => {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 3);
        localStorage.setItem('token', token);
        localStorage.setItem('id', userId);
        localStorage.setItem('expiration', expiration.toISOString());
        localStorage.setItem('type', type);
        
        setAuthState({ token, userId, expiration, type });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('expiration');
        localStorage.removeItem('type');
        setAuthState({ token: null, userId: null, expiration: null, type: null });
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
