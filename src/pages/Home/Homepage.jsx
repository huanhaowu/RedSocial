import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../../supabase/client';
import {getLikesCountByPostID} from '../../functions/Like/getLikesCountByPostID.js';
import {getCommentsCountByPostID} from '../../functions/Comment/getCommentsCountByPostID.js';
import {getUserIDbyEmail} from '../../functions/User/getUserIDbyEmail.js';
import {postLikeByPostID} from '../../functions/Like/postLikeByPostID.js';
import {deleteLikeByPostID} from '../../functions/Like/deleteLikeByPostID.js';
import {getLikeByPostIDandUserID} from '../../functions/Like/getLikeByPostIDandUserID.js';
import {postPost} from '../../functions/Post/postPost.js';
import { formatTimestamp } from '../../functions/formatTimestamp';

const Homepage = ({token}) => {

    const navigate = useNavigate()
    const [inputText, setInputText] = useState('');
    
    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({});
    const [commentsCount, setCommentsCount] = useState({});

    async function getAllPost() {
        try {
            const { data: Post, error } = await supabase.from('Post').select('*').order('Created_at', { ascending: false });
            if (error) {
                throw error;
            }
            setPosts(Post);

            const likesMap = {};
            const commentsCountMap = {};

            for (const post of Post) {
                const totalLikes = await getLikesCountByPostID(post.id);
                likesMap[post.id] = totalLikes;

                const totalComments = await getCommentsCountByPostID(post.id);
                commentsCountMap[post.id] = totalComments;
            }
            setLikes(likesMap);
            setCommentsCount(commentsCountMap);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    function handleFindusers(){
        navigate('/findusers');
    }

    async function handleLikeClick(PostID){
        const user = await getUserIDbyEmail(token.user.email)
        console.log( 'The user ' + user[0].id + ' liked the post ' + PostID);
        const hasLiked = await getLikeByPostIDandUserID(PostID, user[0].id);

        if (hasLiked === false) {
            // Call the postLikeByPostID function
            await postLikeByPostID(PostID, user[0].id);
        } else {
            // Call the deleteLikeByPostID function
            await deleteLikeByPostID(PostID, user[0].id);
        }
        getAllPost()
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
    height: '100vh',  
  }}>
    <div className='flex h-full w-full'>
            <div className='fixed bg-white h-96 w-72 ml-16 mt-6 rounded-md flex justify-center '>
                <div className='mt-4'>
                <h1 className='font-semibold'> Bienvendio, {token.user.user_metadata.first_name}</h1>
                </div>
            </div>

          
           
    <div className='ml-96 w-3/5'>
        <div className=' mt-6 bg-white rounded-md right-20 p-6 h-36 w-full '>
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
                  
                </form>
                <div className='mt-4 flex justify-end'>
                    <button className='bg-blue-300 w-16 rounded-md flex items-center justify-center hover:bg-blue-400' type="submit">Submit</button>
                </div>
        </div>


        <div className=' h-3/4 w-full mt-2 overflow-y-scroll overflow-hidden hover:overflow-y-scroll scrollbar scrollbar-thumb-grey-200 scrollbar-thin'>
            {posts.map((post) => (
                <div key={post.id} className="bg-white h-50 w-2/2 p-6 ml-6 mr-6 mt-6 rounded-md transform transition-transform hover:scale-105">
                    <div className='flex'>
                        <div className='flex w-60'>
                            <h1 className='flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>

                            Creado por: {post.PostUser}</h1>
                        </div>
                        <div className='flex justify-end w-full'>
                            <h1> Hace {formatTimestamp(post.Created_at)}</h1>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <h1>{post.Text}</h1>
                    </div>
                    <div className='flex mt-4'>
                        <div className='flex  w-20 h-5'>
                            <button className='flex' onClick={() => handleLikeClick(post.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:text-green-500">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                </svg>
                                {likes[post.id] !== undefined ? likes[post.id] : 'Loading...'}
                            </button>
                        </div>
                        <div>
                        Comments: {commentsCount[post.id] !== undefined ? commentsCount[post.id] : 'Loading...'}
                        </div>
                    </div>
                </div>
            ))}
        </div>


        </div>       
    </div>
    </div>
    )
}

export default Homepage

