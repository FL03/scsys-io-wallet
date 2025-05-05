// route.ts
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createBloggerServerClient } from '@/features/blog';

const RADIX = 10;

export const GET = async (req: NextRequest) => {
  const supabase = await createBloggerServerClient();
  // create a new URL object from the request url
  const url = new URL(req.url);
  // extract pagination and filter params from the url
  const limit = url.searchParams.get('limit');
  // initialize the query
  let query = supabase.from('posts').select().order('published_at', { ascending: false });
  // if a limit is passed, pass it onto the query
  if (limit) {
    const limitNumber = parseInt(limit as string, RADIX);
    if (!isNaN(limitNumber)) {
      query = query.limit(limitNumber);
    }
  }
  // execute the query and await the results
  const { data, error } = await query;
  // handle any errors that occur during the execution of the query
  if (error) {
    logger.error(error, 'Error querying the database...');
    throw new Error(error.message);
  }
  // return the data as a JSON response with a status code of 200
  return NextResponse.json(data, { status: 200 });
};