import { useEffect, useState } from 'react';
import {getRelationByUserIDandFollowedID} from '../functions/Relation/getRelationByUserIDandFollowedID.js';
import {postFollowUser} from '../functions/Relation/postFollowUser.js';
import {postUnfollowUser} from '../functions/Relation/postUnfollowUser.js';
import {getUserIDbyEmail} from '../functions/User/getUserIDbyEmail.js';

const UserCard = ({username, id, token}) => {

    const [hasFollowed, setHasFollowed] = useState(false);

    async function handleFollow(UserID){
        const user = await getUserIDbyEmail(token.user.email);

        if (!hasFollowed) {
            await postFollowUser(user[0].id, UserID);
            setHasFollowed(true);
        } else {
            await postUnfollowUser(user[0].id, UserID);
            setHasFollowed(false);
        }
    }

    useEffect(() => {
        async function checkRelation() {
            const user = await getUserIDbyEmail(token.user.email);
            const relation = await getRelationByUserIDandFollowedID(user[0].id, id);

            if (relation) {
                setHasFollowed(true);
            } else {
                setHasFollowed(false);
            }
        }

        checkRelation()
    }, [id, token.user.email])

    return (
        <div>
            <h1 className='text-xl'> {username}</h1>
            <button onClick={() => {handleFollow(id)}}> 
                {hasFollowed ? 'Followed' : 'Follow user'} 
            </button>
        </div>
    )
}

export default UserCard