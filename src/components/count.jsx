import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client.js';

const FollowersCount = ({ userId }) => {
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchFollowersCount = async () => {
      try {
        const { data, error } = await supabase
          .from('Relation')
          .select('FollowedUserID')
          .eq('FollowedUserID', userId);

        if (error) {
          throw new Error(`Error fetching followers: ${error.message}`);
        }

        // Fix: Add a check to make sure that the data array is not empty
        if (data.length > 0) {
          setFollowersCount(data.length); // Update the state with the count of followers
        }
      } catch (e) {
        console.error(e.message);
      }
    };

    fetchFollowersCount();
  }, [userId]); // Update the effect whenever the userId prop changes

  return (
    <div>
      <h1>{followersCount}</h1>
    </div>
  );
};

export default FollowersCount;
