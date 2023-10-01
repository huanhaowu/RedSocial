import {useState} from 'react';
import {supabase} from '../../supabase/client.js';
import {Link, useNavigate} from 'react-router-dom';

const Findusers = ({token}) => {

    const navigate = useNavigate()

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    function handleHomePage(){
        navigate('/homepage');
    }

  return (
    <>
        <h1>Find users</h1>
        

        <button onClick={handleHomePage}>Homepage</button>
        <button onClick={handleLogout}>Log out</button>
    </>
  );
  
}

export default Findusers