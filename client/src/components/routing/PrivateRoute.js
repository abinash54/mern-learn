import React from 'react'
import { Route } from 'react-router'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'



const PrivateRoute = (props, {...rest}) => (
    <Route 
    {...rest}
    render={
        !props.authState.isAuthenticated && 
        !props.authState.loading ? (
            <Redirect to='/login' />
        ):(
            <props.component {...props}/>
        )
    }
    />
    
)

export default PrivateRoute
