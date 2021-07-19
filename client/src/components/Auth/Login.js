import React, { useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { regActions } from '../../store/reg_slice';
import { alertActions } from '../../store/alert_slice';
import { useDispatch, useSelector } from 'react-redux';
import loadUserFromToken from '../../utils/loadUserFromToken';
import setAuthToken from '../../utils/setAuthToken';


const Login = () => {
    const dispatch = useDispatch();
    const loggedIn = useSelector(state=>state.registerReducer.isAuthenticated);
    
    

    //testing token existance
    //console.log(localStorage.token);

    const [formData, setFormData] = useState({
        email:'',
        password:''
    });
    //getting values by destructring
    const {email, password} = formData;

    const onChange = e =>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    }

    const submissionHandler=async(e)=>{
        e.preventDefault();
        //console.log(formData)
        //creating the object to send
        const atmpLogin = {
            email,
            password
        }

        try {
            const config = {
                headers:{
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(atmpLogin);
            
            const res = await axios.post('/api/auth', body, config);
            
            

            const authToken = res.data['token'];
            
            //authenticate the user in reg
            dispatch(regActions.authenticateUser({
                token:authToken
            }));
            
            
            //set the user
            const user = await loadUserFromToken();
            dispatch(regActions.loadUser({
                user
            }))

           
            


        } catch (error) {
            if(error.response.status === 403){
                dispatch(regActions.deauthenticateUser());
                dispatch(alertActions.loginFailedAlert({
                    alertType:'danger',
                    alertMsg:'either username or password is incorrect'
                }));
            }
            
        }


    }

    if(loggedIn){
        return <Redirect to='/dashboard' />
    }

    return (
        <div>
            
            
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" action="dashboard.html" onSubmit={e=>submissionHandler(e)}>
                <div className="form-group">
                
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange = {e=>onChange(e)}
                    required
                />
                </div>
                <div className="form-group">

                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange = {e=>onChange(e)}
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Don't have an account? <Link href="/register">Sign Up</Link>
            </p>
        </div>
    )
}

export default Login
