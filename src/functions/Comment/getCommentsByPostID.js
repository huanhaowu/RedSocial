import {supabase} from '../../supabase/client.js';

export async function getCommentsByPostID(PostID) {
    try {
      const { data: comments, error } = await supabase
        .from('Comment')
        .select(`UserCommentID, Text, User ( id, Username)`)
        .eq('PostID', PostID);

      if (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
      }

      console.log(comments);
      return comments;
    } catch (e) {
      console.error(e.message);
      return null
    }
  }