// route.ts
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createBloggerServerClient } from '@/features/blog';

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  // initialize the server-side supabase client for the blogger schema
  const supabase = await createBloggerServerClient();
  // create a new URL object from the request URL
  const reqUrl = new URL(req.url);
  // deconstruct the URL object
  const { searchParams } = reqUrl;

  const limit = searchParams.get('limit') ?? searchParams.get('pageSize') ?? searchParams.get('page_size');

  let query = supabase.from('posts').select('*', { count: 'estimated' });

  if (limit) {
    const limitNumber = parseInt(limit as string, 10);
    if (!isNaN(limitNumber)) {
      query = query.limit(limitNumber);
    }
  }

  const { data, error } = await query;

  if (error) {
    logger.error(error, 'Error querying the database...');
    throw new Error(error.message);
  }
  return NextResponse.json(data, { status: 200 });
};