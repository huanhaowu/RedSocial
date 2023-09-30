import {useEffect, useState} from 'react';
import {supabase} from './supabase/client.js';
import {SignUp, Login, Homepage} from './pages'
import {Routes, Route, json} from 'react-router-dom'

const App = () => {

  const [token, setToken] = useState(false)

  if(token){
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  //to maintain the auth regardless of reload of page, and only logout when the user clicks the logout button
  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  }, [])

  return (
    <div> 
    <Routes>
      <Route path={'/signup'} element={<SignUp/>}/>
      <Route path={'/'} element={<Login setToken={setToken}/>}/>
      {token ? <Route path={'/homepage'} element={<Homepage token={token}/>}/>: ''}
    </Routes>
    </div>
  )
}

export default App