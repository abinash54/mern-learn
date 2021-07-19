import { createSlice } from "@reduxjs/toolkit";




const initialAlertState = {
    visibility:false,
    alertType:'',
    alertMsg:'',
}


const alertSlice = createSlice({
    name:'alert_slice',
    initialState:initialAlertState,
    reducers:{
        passwordDoNotMatchAlert(state, action){
            state.visibility = true;
            state.alertType = action.payload.alertType;
            state.alertMsg = action.payload.alertMsg;
        },

        regSuccessAlert(state, action){
            state.visibility = true;
            state.alertType = action.payload.alertType;
            state.alertMsg = action.payload.alertMsg;
        },

        regFailedAlert(state, action){
            state.visibility = true;
            state.alertType = action.payload.alertType;
            state.alertMsg = action.payload.alertMsg;
        },

        loginFailedAlert(state, action){
            state.visibility = true;
            state.alertType = action.payload.alertType;
            state.alertMsg = action.payload.alertMsg;
        },

        removeAlert(state){
            state.visibility = false;
            state.alertType = '';
            state.alertMsg = '';
        }
    }
})


export default alertSlice;
export const alertActions = alertSlice.actions;