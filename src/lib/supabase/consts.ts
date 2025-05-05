/**
 * Created At: 2025-04-13:15:23:36
 * @author - @FL03
 * @file - consts.ts
 */
import { logger } from '@/lib/logger';

export const supabaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    logger.error('Missing Supabase URL');
    throw new Error('Missing Supabase URL');
  }
  return url;
};

export const supabaseKey = (): string => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    logger.error('Missing Supabase Anon Key');
    throw new Error('Missing Supabase Anon Key');
  }
  return key;
};

export const supabaseCreds = () => ({
  anonKey: supabaseKey(),
  url: supabaseUrl(),
});
