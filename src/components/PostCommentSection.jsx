import { useEffect, useState } from 'react';
import {getCommentsByPostID} from '../functions/Comment/getCommentsByPostID'
import {postComment} from '../functions/Comment/postComment'

const PostCommentSection = ({PostID, UserCommentID, updateCommentsCount}) => {

    const [comments, setComments] = useState([])
    const [inputText, setInputText] = useState('');
    const [userCommentUsername, setUserCommentUsername] = useState('');

    async function fetchComments() {
        const commentsData = await getCommentsByPostID(PostID);
        setComments(commentsData);
        console.log(commentsData)
    }

    useEffect(() => {
        fetchComments();
    }, [PostID]);

    async function handleCommentSubmit(e){
        e.preventDefault()
        console.log('A new comment has been submitted ' + inputText + ' by ' + UserCommentID)
        await postComment(PostID, UserCommentID, inputText)
        setInputText('');
        fetchComments()
        updateCommentsCount();
    }

    return (
        <div>
            {/* this is the {PostID} and the active user is {UserCommentID} */}

            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    required
                />
                <button type="submit">Post</button>
            </form>

            {comments.map((comment) => (
                <div key={comment.id}>
                    <p>{comment.User.Username} - {comment.Text}</p>
                </div>
            ))}
        </div>
    )
}

export default PostCommentSection