// File: app/actions.js
'use server';

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client. It will automatically use the environment variables
// we set up in the .env.local file and in our Vercel settings.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function submitForm(formData) {
  const leadData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
    // The 'created_at' column in Supabase is handled automatically
  };

  try {
    // --- FIX: Ensured the table name is lowercase to match Supabase standards ---
    const { data, error } = await supabase
      .from('leads') // This must match your table name exactly
      .insert([leadData]);

    // If there was an error during the insert, throw it to be caught by the catch block
    if (error) {
      throw error;
    }
    
    return { success: true, message: 'Thank you! Your form has been submitted.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}