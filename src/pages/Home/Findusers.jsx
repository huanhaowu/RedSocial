import {useEffect, useState} from 'react';
import {supabase} from '../../supabase/client.js';
import {Link, useNavigate} from 'react-router-dom';
import {getUserIDbyEmail} from '../../functions/User/getUserIDbyEmail.js';
import {getAllUsers} from '../../functions/User/getAllUsers.js';

const Findusers = ({token}) => {

    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [inputText, setInputText] = useState('');

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    function handleHomePage(){
        navigate('/homepage');
    }

    async function handleSubmit(e){
      e.preventDefault();
      const user = await getUserIDbyEmail(token.user.email)
      console.log(inputText);
    } 

    async function getAllUsers() {
      try {
        const { data: users, error } = await supabase
          .from('User')
          .select('*');
  
        if (error) {
          throw new Error(`Error fetching users: ${error.message}`);
        }

        setUsers(users);
        console.log(users);
  
        console.log(users);
      } catch (e) {
        console.error(e.message);
      }
    }

    useEffect(() => {
      getAllUsers()
    }, [])

  return (
    <>
        <h1>Find users</h1>
        <div>
                <form id="textForm" onSubmit={handleSubmit}>
                    <label for="textInput">Search user</label>
                    <br/>
                    <input
                        type="text"
                        id="textInput"
                        name="textInput"
                        placeholder='Username'
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>

            <h1>Users</h1>
                <ul>
                    {users.map((user) => (
                        <li key={user.id} className='text-xs'>
                            {user.Username}
                        </li>
                    ))}
                </ul>


        <button onClick={handleHomePage}>Homepage</button>
        <button onClick={handleLogout}>Log out</button>
    </>
  );
  
}

export default Findusers