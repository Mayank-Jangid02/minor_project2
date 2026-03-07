import { createSlice } from '@reduxjs/toolkit';

const getInitialUserInfo = () => {
    try {
        const info = localStorage.getItem('userInfo');
        if (!info || info === 'undefined' || info === 'null') return null;
        return JSON.parse(info);
    } catch (e) {
        return null;
    }
};

const initialState = {
    userInfo: getInitialUserInfo(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout(state) {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
