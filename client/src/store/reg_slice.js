import { createSlice } from "@reduxjs/toolkit";

import axios from 'axios';

const initialState = {
    token:localStorage.getItem('token'),
    isAuthenticated:false,
    loading:true,
    user:null
}

const regSlice = createSlice({ //name should be authslice and export as that
    name:'reg_slice',
    initialState,
    reducers:{
        authenticateUser(state, action){
            localStorage.setItem('token',action.payload.token);
            state.isAuthenticated = true;
            state.loading = false;
        },

        loadUser(state, action){
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload.user;
        },

        
        
        deauthenticateUser(state){
            localStorage.removeItem('token');
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        }
    }
})

export const regActions = regSlice.actions;
export default regSlice;