import {supabase} from '../../supabase/client.js';

export async function getCommentsByPostID(PostID) {
    try {
      const { data: comments, error } = await supabase
        .from('Comment')
        .select('*')
        .eq('PostID', PostID);

      if (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
      }

      console.log(comments);
    } catch (e) {
      console.error(e.message);
    }
  }