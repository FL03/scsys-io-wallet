/**
 * Created At: 2025-04-09:18:59:43
 * @author - @FL03
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';

export const GET = async (req: NextRequest) => {
  const supabase = await createServerClient<any, "public">();

  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const userId = searchParams.get('uid') ?? searchParams.get('userId') ?? searchParams.get('user_id');

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
    throw new Error(error.message);
  }
  return NextResponse.json(data, { status: 200 });
};
