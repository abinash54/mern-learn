import { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Redirect } from 'react-router';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert'
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { useDispatch } from 'react-redux';

import { alertActions } from './store/alert_slice'
import { regActions } from './store/reg_slice';


import loadUserFromToken from './utils/loadUserFromToken';


const App=()=> {
  const dispatch = useDispatch();
  const auth_state = useSelector(state=>state.registerReducer);

  //useEffect to check if any token in localStorage and get user if token is there
  useEffect(()=>{
    (async () =>{
      const resData = await loadUserFromToken();

      

      if(resData === 'NO_TOKEN_FOUND'){
        //console.log('res error');
        dispatch(regActions.deauthenticateUser());
        return <Redirect to='/login' />
      }else if(resData === 'AUTH_ERROR'){
        //console.log('res error');
        dispatch(regActions.deauthenticateUser());
        return <Redirect to='/login' />
      }else{
        //console.log('token found and authenticated');
        dispatch(regActions.loadUser(resData));
        return <Redirect to='/dashboard' />
      }
    })()

  }, []);
  

  const alertVisibility = useSelector(state=>state.alertReducer.visibility)
  //getting alert dismiss dispatch
  
  if(alertVisibility){
    setTimeout(()=>{
      dispatch(alertActions.removeAlert());
    }, 3000);
  }
  
  return (
  
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          {alertVisibility && <Alert />}
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact authState={auth_state} path="/dashboard" component={Dashboard} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  )
};

export default App;
