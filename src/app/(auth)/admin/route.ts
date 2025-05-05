// route.ts
'use server';
// imports
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { getUsername } from '@/lib/supabase';

/** This function manages the GET request to the `/admin` route. */
export const GET = async () => {
  logger.trace("Fetching the current user's username...");
  try {
    const username = await getUsername();
    // handle the case where no username is returned
    if (!username || username.trim() === '') {
      logger.error('No username found; redirecting to login page...');
      return NextResponse.error();
    }
    // log the successful retrieval of the username
    logger.trace(`Redirecting to the admin dashboard`);
    // redirect to the admin dashboard with the username
    return NextResponse.redirect(`/admin/${username}?view=dashboard`);
  } catch (error) {
    // log the error
    logger.error(`Error fetching username: ${error}`);
    // redirect to the error page with the error message
    return redirect(
      `/error?code=500&message=${encodeURIComponent(
        'An error occurred while fetching the username'
      )}`
    );
  }
};
