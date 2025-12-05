// File: app/actions.js
'use server';

import { createClient } from '@supabase/supabase-js';

// Create a Supabase client. It will automatically use the environment variables
// we set up in the .env.local file and in our Vercel settings.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if credentials are available
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function submitForm(formData) {
  // Debug: Log environment variables (safely)
  console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

  // Check if Supabase is configured
  if (!supabase) {
    console.warn('Supabase is not configured. Form submission skipped.');
    return {
      success: false,
      error: 'Database not configured. Please add Supabase credentials to .env.local'
    };
  }

  const leadData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    company: formData.get('company'),
  };

  console.log('Attempting to insert lead data:', leadData);

  try {
    // --- FIX: Ensured the table name is lowercase to match Supabase standards ---
    const { data, error } = await supabase
      .from('leads') // This must match your table name exactly
      .insert([leadData])
      .select();

    // If there was an error during the insert, throw it to be caught by the catch block
    if (error) {
      console.error('Supabase Error Details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { success: false, error: error.message };
    }

    console.log('Successfully inserted data:', data);
    return { success: true, message: 'Thank you! Your form has been submitted.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
}