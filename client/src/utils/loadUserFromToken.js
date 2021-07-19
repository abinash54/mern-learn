import React from 'react'
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';




//this function load user object and return it
const loadUserFromToken = async() => {
    if(localStorage.token){
        //putting the token in header, in a field 'x-auth-token'
        setAuthToken(localStorage.token);
        //console.log('token found')
        try {
            const res = await axios.get('/api/auth');
            //get the user from here
            const user = JSON.stringify(res.data);
            return user;
            
        } catch (error) {
           
           return 'AUTH_ERROR';
        }
    }else{
        return 'NO_TOKEN_FOUND';
    }
}

export default loadUserFromToken
