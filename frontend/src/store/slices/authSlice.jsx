import { createSlice } from '@reduxjs/toolkit';

const isTokenExpired = (exp) => {
  if (!exp) return true; 
  return Date.now() >= parseInt(exp, 10);
};

const getInitialState = () => {
  const token = localStorage.getItem('token') || null;
  const exp = localStorage.getItem('exp') || null;
  const user = JSON.parse(localStorage.getItem('user')) || null;

  if (isTokenExpired(exp)) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('exp');
    return {
      user: null,
      token: null,
      exp: null,
      isAuthenticated: false,
      loading: false,
    };
  }

  return {
    user,
    token,
    exp,
    isAuthenticated: !!token,
    loading: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.exp = action.payload.exp;

      // Save data to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('exp', action.payload.exp);
    },
    loginFailure: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.exp = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.exp = null;

      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('exp');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
