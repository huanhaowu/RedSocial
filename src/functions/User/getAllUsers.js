import { supabase } from './your-supabase-config-file'; // Make sure to import your Supabase configuration

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
    // Log the error to the console
    console.error(e.message);

    // Display a styled error message on the UI
    showErrorNotification(e.message);
  }
}

function showErrorNotification(errorMessage) {
  // Create a div element for the error notification
  const errorNotification = document.createElement('div');
  
  // Apply Tailwind CSS classes for styling
  errorNotification.className = 'bg-red-500 text-white p-4 rounded';

  // Set the error message as the content of the notification
  errorNotification.textContent = errorMessage;

  // Append the notification to the body or a specific container in your HTML
  document.body.appendChild(errorNotification);
}
