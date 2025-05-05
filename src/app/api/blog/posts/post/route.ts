// route.ts
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createBloggerServerClient } from '@/features/blog';

export const GET = async (req: NextRequest) => {
  // create a server-side client for supabase
  const supabase = await createBloggerServerClient();
  // create a new URL object from the initial request
  const url = new URL(req.url);
  // deconstruct the URL object to get access to the searchParams
  const { searchParams } = url;
  const postId = searchParams.get('id') ?? searchParams.get('postId') ?? searchParams.get('post_id');
  const slug = searchParams.get('slug');
  const username = searchParams.get('username');
  // initialize the base query
  let query = supabase.from('posts').select('*', { count: 'estimated' });
  // if a postId was provided, pass it to the query
  if (postId) {
    query = query.eq('id', postId);
  }
  // if a username was provided, pass it to the query
  if (username) {
    query = query.eq('username', username);
  }
  // execute the query and get the data
  const { data, error } = await query.single();
  // handle any errors 
  if (error) {
    logger.error(error, 'Error querying the database...');
    return NextResponse.error();
  }
  // return the data as a JSON response
  return NextResponse.json(data, { status: 200 });
};