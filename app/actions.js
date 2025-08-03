// File: app/actions.js
'use server'; // This directive marks all functions in this file as Server Actions

import { MongoClient } from 'mongodb';

export async function submitForm(formData) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    // --- FIX: Updated the database and collection names to match your Compass setup ---
    const db = client.db('BigVision'); 
    const collection = db.collection('BigVision'); 

    const leadData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      submittedAt: new Date(),
    };

    await collection.insertOne(leadData);
    
    return { success: true, message: 'Thank you! Your form has been submitted.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  } finally {
    await client.close();
  }
}
