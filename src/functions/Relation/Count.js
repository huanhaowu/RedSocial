import {supabase} from '../../supabase/client.js';

export async function countFollowedUsers(UserID) {
    try {
      const { data, error } = await supabase
        .from('Relation')
        .select('FollowedUserID', { count: 'exact' })
        .eq('UserID', UserID);
  
      if (error) {
        throw new Error(`Error counting followed users: ${error.message}`);
      }
  
      // Assuming the count is in the first element of the array
      const count = data.length > 0 ? parseInt(data[0].count) : 0;
  
      console.log(`Number of followed users for UserID ${UserID}: ${count}`);
      return count;
    } catch (error) {
      console.error('Error counting followed users:', error);
      throw error; // Re-throw the error to handle it in the calling code if needed
    }
  }