import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../../supabase/client';
import {getLikesByPostID} from '../../functions/Like/getLikesByPostID.js';
import {getCommentsCountByPostID} from '../../functions/Comment/getCommentsCountByPostID.js';

const Homepage = ({token}) => {

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({});
    const [commentsCount, setCommentsCount] = useState({});
    const navigate = useNavigate()

    function handleLogout(){
        sessionStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
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
                    const totalLikes = await getLikesByPostID(post.id);
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
                            Likes: {likes[post.id] !== undefined ? likes[post.id] : 'Loading...'} -
                            Comments: {commentsCount[post.id] !== undefined ? commentsCount[post.id] : 'Loading...'}
                        </li>
                    ))}
                </ul>

            <button onClick={handleLogout}>Log out</button>
        </div>
    )
}

export default Homepage