import React from 'react'
import { Fragment, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';

import { alertActions } from '../../store/alert_slice'
import { regActions } from '../../store/reg_slice';
import loadUserFromToken from '../../utils/loadUserFromToken';




const Register = (props) => {

    const loggedIn = useSelector(state=>state.registerReducer.isAuthenticated);


    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        password2:'',
    });

    //destructuring to get the values
    const {name, email, password, password2} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]:e.target.value});

    const onSubmit = async e=>{
        e.preventDefault();
        if(password !== password2){
            //dispatch the alert function here
            dispatch(alertActions.passwordDoNotMatchAlert({
                alertType:'danger',
                alertMsg:'passwords do not match'
            }))
            
        }else{
            const newUser = {
                name,
                email, 
                password
            }

            try {
                const config = {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }

                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);
                const authToken = res.data['token'];
                console.log(authToken);

                //dispatching the registration dispatch to authenticate
                dispatch(regActions.authenticateUser({token:authToken}));

            
                //set the user
                const user = await loadUserFromToken();
                dispatch(regActions.loadUser({
                    user
                }))

                //dispatching reg success alert
                dispatch(alertActions.regSuccessAlert({
                    alertType:'success',
                    alertMsg:`registration successful`
                }));

            } catch (error) {
                //handling the error
                if(error.response.status === 409){
                    dispatch(regActions.deauthenticateUser());
                    //dispatching reg fail alert
                    dispatch(alertActions.regFailedAlert({
                        alertType:'danger',
                        alertMsg:`email already there, use a different one`
                    }));
                }


                
            }
        }
    }

    if(loggedIn){
        return <Redirect to='/dashboard' />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>

            <form className="form" action="create-profile.html" autoComplete="off" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
            
                <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">

                <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} />

                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password} onChange={e => onChange(e)}
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    minLength="6"
                    value={password2} onChange={e => onChange(e)}
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}




export default Register;
