/**
 * Created At: 2025-04-04:14:45:38
 * @author - @FL03
 * @description - client-side functions for supabase
 * @file - client.ts
 */
'use client';
// imports
import * as ssr from '@supabase/ssr';
// project
import { PublicDatabase } from '@/types/database.types';
// feature-specific
import { supabaseCreds } from './consts';

export const createBrowserClient = <
  D = PublicDatabase,
  SName extends string & keyof D = 'public' extends keyof D
    ? 'public'
    : string & keyof D,
>(
  schema?: SName
) => {
  const { url, anonKey } = supabaseCreds();

  return ssr.createBrowserClient<D, SName>(url, anonKey, {
    db: { schema },
  });
};

export default createBrowserClient;
