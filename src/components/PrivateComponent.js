import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const PrivateComponent=()=>{
    const { userLoggedIn } =useAuth();
    //const auth=localStorage.getItem('user');
    return userLoggedIn ? <Outlet />:<Navigate to="/signup" />

}

export default PrivateComponent