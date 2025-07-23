import { createSlice } from '@reduxjs/toolkit';

const userData = localStorage.getItem('user');
let initialToken = null;
let initialUser = null;
if (userData) {
  try {
    const parsed = JSON.parse(userData);
    initialToken = parsed.access_token;
    initialUser = parsed.user || null; // If you store user info, otherwise decode from token as needed
  } catch {}
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    user: initialUser,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logoutSuccess: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer; 