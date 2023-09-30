import {supabase} from '../../supabase/client.js';

export async function postUser(Username, Email) {
    try {
        // First, check if a user with the same email exists
        const { data: existingUser, error: existingUserError } = await supabase
          .from('User')
          .select('id')
          .eq('Email', Email)
      
        if (existingUserError) {
          throw new Error('An error occurred while checking for existing user');
        }
      
        if (existingUser) {
          // User with the same email already exists, you can handle this as needed
          // For example, you can show an alert or return an error response
          alert('User with the same email already exists');
          return; // Exit the function
        }
      
        // If no user with the same email exists, proceed with the insert
        const { data, error } = await supabase
          .from('User')
          .insert([
            { Username: Username, Email: Email },
          ])
          .select();
      
        if (error) {
          throw error;
        }
      
        console.log('User inserted successfully');
        // Continue with any other actions you need to perform after insertion
      } catch (error) {
        console.error(error);
        // Handle the error as needed, e.g., display an error message to the user
      }
}