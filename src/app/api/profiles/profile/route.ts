/**
 * Created At: 2025-04-09:19:07:06
 * @author - @FL03
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient, currentUser } from '@/lib/supabase';
import { PublicDatabase } from '@/types/database.types';

export const DELETE = async (req: NextRequest) => {
  // initialize the server-side supabase client
  const supabase = await createServerClient<any, "public">();
  // create a new URL object from the request URL
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const userId = searchParams.get('uid') ?? searchParams.get('userId') ?? searchParams.get('user_id');

  if (!username && !userId) {
    logger.error({ username, userId }, 'No username or userId provided...');
    return NextResponse.error();
  }

  let query = supabase.from('profiles').delete({ count: 'exact' });

  if (username) {
    query = query.eq('username', username);
  }

  if (userId) {
    query = query.eq('id', userId);
  }

  const { data, error } = await query.single();

  if (error) {
    logger.error({ error }, 'Error deleting the profile...');
    return NextResponse.error();
  }
  return NextResponse.json(data, { status: 200 });
}

export const GET = async (req: NextRequest) => {
  // initialize the server-side supabase client
  const supabase = await createServerClient<PublicDatabase, "public">('public');
  // create a new URL object from the request URL
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const userId = searchParams.get('uid') ?? searchParams.get('userId') ?? searchParams.get('user_id');

  if (!username && !userId) {
    logger.error({ username, userId }, 'No username or userId provided...');
    return NextResponse.error();
  }

  let query = supabase.from('profiles').select('*', { count: 'estimated' });

  if (username) {
    query = query.eq('username', username);
  }

  if (userId) {
    query = query.eq('id', userId);
  }

  const { data, error } = (userId || username) ? await query.single() : await query;

  if (error) {
    logger.error(error, 'Error querying the database...');
    return NextResponse.error();
  }
  return NextResponse.json(data, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const { formData } = req;

  const supabase = await createServerClient();

  const user = await currentUser(supabase);
  if (!user) {
    logger.error(user, '[POST] User not authenticated...');
    throw new Error('User needs to be authenticated to update the profile...');
  }
  
  // destructure the user object to get the user id
  const { id: userId } = user;
  // get the form data from the request
  const form = await formData();
  // upsert the formData into the profiles table and return the entry
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        avatar_url: form.get('avatar_url') as string,
        bio: form.get('bio') as string,
        display_name: form.get('display_name') as string,
        role: form.get('role') as string,
        status: form.get('status') as string,
        username: form.get('username') as string,
      },
      { onConflict: 'id' }
    )
    .eq('id', userId)
    .select()
    .single();
    // check for errors
  if (error) {
    logger.error(error, '[POST] Error upserting the profile...');
    return NextResponse.error();
  }
  // log the success message
  logger.info({ data }, 'Success: upserted the profile with the given data...');
  return NextResponse.json(data ?? {}, { status: 201 });
};
