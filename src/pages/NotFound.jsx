import {useState} from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {

  return (
    <>
        <h1>Error 404</h1>
        

        <p>Go to the <Link to={'/'}> Login</Link> </p>
    </>
  );
  
}

export default NotFound