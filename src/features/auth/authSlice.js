import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    authChecked: false, // true once we've checked /current-user at least once
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.authChecked = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.authChecked = true;
        },
        setAuthChecked: (state) => {
            state.authChecked = true;
        },
    },
});

export const { setUser, clearUser, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
