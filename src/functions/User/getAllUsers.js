import {supabase} from '../../supabase/client.js';

export async function getAllUsers() {
    try {
      const { data: users, error } = await supabase
        .from('User')
        .select('*');

      if (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }

      console.log(users);
    } catch (e) {
      console.error(e.message);
    }
  }