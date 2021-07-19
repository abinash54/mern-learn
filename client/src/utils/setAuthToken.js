import React from 'react'
import axios from 'axios';

const setAuthToken = (token) => {
    if(token){
        //console.log('from setauthtoken, header set');
        axios.defaults.headers.common['x-auth-token'] = token;
    }else{
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;
