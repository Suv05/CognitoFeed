'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const completeOnboarding = async (data) => {
  console.log('Server action received data:', data); // Debug log
  
  const { userId } = await auth()

  if (!userId) {
    console.log('No user ID found'); // Debug log
    return { error: 'No Logged In User' }
  }

  const client = await clerkClient()

  try {

    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        categories: data.preferences.categories,
        keywords: data.preferences.keywords,
      },
    })
    
    return { 
      success: true,
      message: 'Onboarding completed successfully',
      metadata: res.publicMetadata 
    }
  } catch (err) {
    console.error('Error updating user metadata:', err)
    return { error: 'There was an error updating the user metadata.' }
  }
}