import React from 'react'
import { useSelector } from 'react-redux'

const Alert = () => {   
    const alertState = useSelector(state=>state.alertReducer)
    
    return (
        <div className={`alert alert-${alertState.alertType}`}>
            {alertState.alertMsg}
        </div>
    )
}

export default Alert
