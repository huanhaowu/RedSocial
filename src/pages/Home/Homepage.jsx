import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../../supabase/client';
import {getLikesCountByPostID} from '../../functions/Like/getLikesCountByPostID.js';
import {getCommentsCountByPostID} from '../../functions/Comment/getCommentsCountByPostID.js';
import {getUserIDbyEmail} from '../../functions/User/getUserIDbyEmail.js';
import {postLikeByPostID} from '../../functions/Like/postLikeByPostID.js';
import {deleteLikeByPostID} from '../../functions/Like/deleteLikeByPostID.js';
import {getLikeByPostIDandUserID} from '../../functions/Like/getLikeByPostIDandUserID.js';


const Homepage = ({token}) => {

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({});
    const [commentsCount, setCommentsCount] = useState({});
    const navigate = useNavigate()


    async function getAllPost() {
        try {
            const { data: Post, error } = await supabase.from('Post').select('*');
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

    useEffect(() => {
        getAllPost()
    }, [])

    return (
        <div>
            <h1> Welcome back, {token.user.user_metadata.first_name} </h1>

            <h1>Posts</h1>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            {post.Text}; created by userId: {post.PostUser}
                            <br />
                            <button onClick={() => handleLikeClick(post.id)}> Likes: {likes[post.id] !== undefined ? likes[post.id] : 'Loading...'}</button> -
                            Comments: {commentsCount[post.id] !== undefined ? commentsCount[post.id] : 'Loading...'}
                        </li>
                    ))}
                </ul>
                
            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}

export default Homepage