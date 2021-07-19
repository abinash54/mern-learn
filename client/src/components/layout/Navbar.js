import React from 'react';
import { Link } from 'react-router-dom';
import { regActions } from '../../store/reg_slice';
import { useSelector, useDispatch } from 'react-redux';


const NavBar=()=>{
    //getting the auth status
    const loggedIn = useSelector(state=>state.registerReducer.isAuthenticated);
    const dispatch = useDispatch();

    const logoutHandler =()=>{
        dispatch(regActions.deauthenticateUser());
    }

    return(
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>
            <ul>
                <li><Link to="/">Developers</Link></li>
                {!loggedIn && <li><Link to="/register">Register</Link></li>}
                {!loggedIn && <li><Link to="/login">Login</Link></li>}
                {loggedIn && <li><Link onClick={logoutHandler} to="/"><i className='fas fa-sign-out-alt'/><span className='hide-sm'>Logout</span></Link></li>}

            </ul>
        </nav>
    );
}

export default NavBar;