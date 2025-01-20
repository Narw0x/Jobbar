import { createSlice } from "@reduxjs/toolkit";


const isTokenExpired = (exp) => {
    if (!exp) return true; 
    return Date.now() >= parseInt(exp, 10);
  };

const getInitialState = () => {
    const admin = JSON.parse(localStorage.getItem('admin')) || null;
    const adminToken = localStorage.getItem('adminToken') || null;
    const adminTokenExp = localStorage.getItem('adminTokenExp') || null;

    if (isTokenExpired(adminTokenExp)) {
        localStorage.removeItem('admin');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExp');
        return {
            admin: null,
            adminToken: null,
            adminTokenExp: null,
            loading: false,
        };
    }

    return {
        admin,
        adminToken,
        adminTokenExp,
        loading: false
    };
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: getInitialState(),
    reducers: {
        adminLoginStart: (state) => {
            state.loading = true;
        },
        adminLoginSuccess: (state, action) => {
            state.loading = false;
            state.admin = action.payload.admin;
            state.adminToken = action.payload.token;
            state.adminTokenExp = action.payload.exp;

            // Save data to localStorage
            localStorage.setItem('admin', JSON.stringify(action.payload.admin));
            localStorage.setItem('adminToken', action.payload.token);
            localStorage.setItem('adminTokenExp', action.payload.exp);

        },
        adminLoginFailure: (state, action) => {
            state.loading = false;
        },
        adminLogout: (state) => {
            state.admin = null;
            state.adminToken = null;
            state.adminTokenExp = null;

            localStorage.removeItem('admin');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminTokenExp');
        }
    }
});

export const { adminLoginStart, adminLoginSuccess, adminLoginFailure, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;