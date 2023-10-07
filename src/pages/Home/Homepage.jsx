import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../../supabase/client';
import {getUserIDbyEmail} from '../../functions/User/getUserIDbyEmail.js';
import {postPost} from '../../functions/Post/postPost.js';
import PostCard from '../../components/PostCard';
import {getAllUserRelation } from '../../functions/Relation/getAllUserRelation';

const Homepage = ({token}) => {

    const navigate = useNavigate()
    const [inputText, setInputText] = useState('');
    const [activeUser, setActiveUser] = useState('');
    const [posts, setPosts] = useState([]);

    async function getAllPost() {
        try {
            const { data: Post, error: postError  } = await supabase
            .from('Post')
            .select('*')
            .order('Created_at', { ascending: false });

            if (postError) {
                throw postError;
            }

            setPosts(Post);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    async function handlePostSubmit(e){
        e.preventDefault()
        const user = await getUserIDbyEmail(token.user.email)
        console.log('A new post has been submitted ' + inputText)
        await postPost(inputText, user[0].id)
        setInputText('');
        getAllPost()
    }

    useEffect(() => {
        getAllPost()
    }, [])

    return (

    <div style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2014/08/15/11/29/beach-418742_1280.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',  // This ensures that the background image stays fixed while scrolling
    height: '150vh',  
    }}>
        <div className='flex h-full w-full'>
            <div className='fixed bg-white h-5/6 w-72 ml-16 mt-6 py-4 rounded-md flex flex-col items-center justify-between'>
                    
                    <div className='flex flex-col items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-20 h-20">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                   
                        <h1 className='font-semibold'> Bienvenido, {token.user.user_metadata.first_name}</h1>
                        <div id='navButtons' className='mt-6 flex flex-col justify-center'>
                            <button onClick={() => {navigate('/homepage');}} className="bg-blue-400 w-52 hover:bg-blue-500 text-white font-semibold py-1 px-6 rounded-md text-left">
                                Homepage
                            </button>
                            <button onClick={() => {navigate('/friends');}} className=" w-52 font-semibold py-1 px-6 text-left rounded-md">
                                Friends
                            </button>
                            <button onClick={() => {navigate('/findusers');}} className=" w-52 font-semibold py-1 px-6 text-left rounded-md">
                                Explore
                            </button>
                            <button onClick={() => {navigate('/profile');}} className=" w-52 font-semibold py-1 px-6 text-left rounded-md">
                                Profile
                            </button>
                        </div>
                    </div>
                    <button onClick={handleLogout} className='ml-2 w-52 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded'>Log out</button>
            </div>
            <div className='ml-96 w-3/5'>
                <div className='mt-6 bg-white rounded-md right-20 p-6 h-fit w-full '>
                    <form id="textForm" onSubmit={handlePostSubmit}>
                            <label className='flex text-lg font-semibold' for="textInput">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
                                </svg>
                                Crea un post</label>
                            <div className='pt-2 w-full rounded-md'>
                                <input
                                className='border border-2 rounded-md w-full text-base  focus:outline-none focus:ring-1 focus:border-gray-300'
                                    type="text"
                                    id="textInput"
                                    name="textInput"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='mt-4 flex justify-end'>
                            <button className='bg-blue-400 w-24 rounded-md flex items-center justify-center hover:bg-blue-500 text-white font-semibold py-1 px-6' type="submit">Submit</button>
                        </div>
                    </form>
                </div>

                <div className=' h-3/4 w-full mt-2 overflow-y-scroll overflow-hidden hover:overflow-y-scroll scrollbar scrollbar-thumb-grey-200 scrollbar-thin'>
                        {posts.length === 0 ? (
                            <div className='bg-white h-50 w-2/2 p-6 mt-6 rounded-md'>
                                <p>There's no post, follow someone.</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <PostCard key={post.id} PostUserID={post.PostUser} PostText={post.Text} PostTime={post.Created_at} PostID={post.id} ActiveUserID={activeUser} />
                            ))
                        )}
                </div>

            </div>       
        </div>
    </div>
    )
}

export default Homepage

