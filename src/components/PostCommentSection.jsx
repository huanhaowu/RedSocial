import { useEffect, useState } from 'react';
import {getCommentsByPostID} from '../functions/Comment/getCommentsByPostID'
import {postComment} from '../functions/Comment/postComment'
import {formatTimestamp} from '../functions/formatTimestamp'

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
        <div className='mt-4 flex flex-col justify-center'>
            {/* this is the {PostID} and the active user is {UserCommentID} */}

            <form onSubmit={handleCommentSubmit} className='mb-3'>
                <input
                    type="text"
                    placeholder="Leave a comment..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    required
                    className='rounded-full border-2 h-fit px-4 py-1' 
                    style={{ width: '87%' }}
                />
                <button type="submit" className='ml-2 w-fit border-2 h-fit rounded-full px-4 py-1 bg-blue-400 text-white' >Post</button>
            </form>

            {comments.map((comment) => (
                <div key={comment.id} className='my-1.5 w-full bg-gray-200 px-3 py-1 rounded-lg'>
                    <div className='flex justify-between'>
                        <p className='font-semibold text-sm'>{comment.User.Username} </p>
                        <p className='text-sm'> hace {formatTimestamp(comment.Created_at)} </p>
                    </div>
                    <p className='text-sm'>{comment.Text}</p>
                </div>
            ))}
        </div>
    )
}

export default PostCommentSection