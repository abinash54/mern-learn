import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alert_slice";
import regSlice from "./reg_slice";


const store = configureStore({
    reducer:{
        alertReducer:alertSlice.reducer,
        registerReducer:regSlice.reducer
    }
});

export default store;