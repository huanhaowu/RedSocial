import {useEffect, useState} from 'react';
import {supabase} from '../../supabase/client.js';
import {Link, useNavigate} from 'react-router-dom';
import {getUserIDbyEmail} from '../../functions/User/getUserIDbyEmail.js';
import {getRelationByUserIDandFollowedID} from '../../functions/Relation/getRelationByUserIDandFollowedID.js';
import {postFollowUser} from '../../functions/Relation/postFollowUser.js';
import {postUnfollowUser} from '../../functions/Relation/postUnfollowUser.js';
import UserCard from '../../components/UserCard'

const Findusers = ({token}) => {

    const navigate = useNavigate()

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    function handleHomePage(){
        navigate('/homepage');
    }

  //this is a test
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Implement a debounce function to delay the API request
    const fetchCurrentUser = async () => {
      try {
        const user = await getUserIDbyEmail(token.user.email);
        setCurrentUser(user[0].id);
      } catch (error) {
        console.error('Error fetching current user:', error.message);
      }
    };

    fetchCurrentUser();

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    // Function to fetch search results
    const fetchSearchResults = async (input) => {
      setLoading(true);
      try {
        const { data: users, error } = await supabase
          .from('User')
          .select('*')
          .ilike('Username', `%${input}%`); // Adjust column name as needed

        if (error) {
          throw error;
        }

        const filteredUsers = users.filter((user) => user.id !== currentUser);
        setSearchResults(filteredUsers || []);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching search results:', error.message);
        setLoading(false);
      }
    };

    const debouncedFetch = debounce(fetchSearchResults, 300); // Adjust the delay as needed

    if (inputValue.trim() !== '') {
      debouncedFetch(inputValue);
    } else {
      setSearchResults([]);
    }
  }, [inputValue, currentUser, token.user.email]);
    //end of test

    const handleShowAllUsers = async () => {
      try {
        const { data: allUsers, error } = await supabase
          .from('User')
          .select('*');
  
        if (error) {
          throw error;
        }
        const filteredUsers = allUsers.filter((u) => u.id !== currentUser);
        setSearchResults(filteredUsers || []);
      } catch (error) {
        console.error('Error fetching all users:', error.message);
      }
    };

    async function handleFollow(UserID){
      // console.log( 'The user ' + user[0].id + ' started to follow ' + UserID);
      const hasLiked = await getRelationByUserIDandFollowedID(currentUser, UserID);

      if (hasLiked === false) {
          // Call the postLikeByPostID function
          await postFollowUser(currentUser, UserID);
      } else {
          // Call the deleteLikeByPostID function
          await postUnfollowUser(currentUser, UserID);
      }
    }

  return (
<>
  <div style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2014/08/15/11/29/beach-418742_1280.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',  // This ensures that the background image stays fixed while scrolling
    height: '100vh',  
    }}>
      <div className="grid grid-cols-6 gap-4">
          <div className='mt-6 ml-2 col-start-1 col-end-2 bg-white rounded-md'>

          </div>
          <div className='col-start-2 col-span-4 mt-6 bg-white rounded-md right-20 p-6 h-36 w-full'>
                  <div>
                    <h1 className='flex font-semibold'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                      Agregar usuario</h1>
                  </div>
                  <div className='mt-2'>
                      <input
                      className='border border-2 rounded-md w-full text-base  focus:outline-none focus:ring-1 focus:border-gray-300'
                      type="text"
                      placeholder=" Buscar nombre de usuario"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      />
                  </div>

                  <div  className='flex justify-end mt-2'>
                      <button className='bg-blue-300 w-46 p-1 rounded-md flex items-center justify-center hover:bg-blue-400' onClick={handleShowAllUsers}>Enseñar todos los usuarios</button>
                  </div>
          </div>

          <div className='col-start-2 col-span-4 '>
            <div className='h-4/5 overflow-y-auto overflow-y-scroll overflow-hidden hover:overflow-y-scroll scrollbar scrollbar-thumb-grey-200 scrollbar-thin'>
              {loading && <div>Loading...</div>}
              {searchResults.length === 0 && !loading && (
                <p>Este usuario no existe</p>
              )}
              {searchResults.length > 0 && (
                <div>
                  {searchResults.map((user) => (
                    <UserCard key={user.id} id={user.id} username={user.Username} token={token}></UserCard>
                  ))}
                </div>
              )}
            </div>
          </div>


        

            

      </div>
    </div>
      </>
   
  );
  
}

export default Findusers