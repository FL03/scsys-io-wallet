/**
 * Created At: 2025-04-09:18:50:51
 * @author - @FL03
 * @file - client.ts
 */
'use client';
// project
import { logger } from '@/lib/logger';
import { resolveOrigin } from '@/lib/utils';
// feature-specific
import { ProfileData } from '../types';
import { createBrowserClient,  } from '@/lib/supabase';
import { SupaSubscriptionCallback } from '@/types/supabase';

/** Fetch the user profile from the database using the dedicated api.  */
export const fetchUserProfile = async (
  params?: { uid?: string; username?: string } | { [key: string]: any },
  init?: RequestInit
): Promise<ProfileData | null> => {
  // check if params is an object and has keys
  if (typeof params !== 'object' || Object.keys(params).length === 0) {
    logger.warn(params, 'Missing search params');
  }
  // ensure undefined or null params are not passed to the URL
  const _params = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([_, value]) => value !== undefined && value !== null
    )
  );
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = new URL('/api/profiles', resolveOrigin());
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, init);
  // handle any response errors
  if (!res.ok) {
    logger.error(res, 'Failed to fetch data from the database...');
    throw new Error('Failed to fetch the user profile');
  }
  // parse json
  const data = await res.json();
  // return the data or default to null
  return data ?? null;
};

export const deleteUserProfile = async (
  params?: Record<string, string>,
  init?: RequestInit
): Promise<ProfileData | null> => {
  if (!params) {
    throw new Error('No params provided');
  }
  const url = new URL('/api/profiles/profile', resolveOrigin());
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, { method: 'DELETE', ...init }).then((res) =>
    res.json()
  );
};

export const onProfileChange = (
  username?: string,
  onChange?: React.Dispatch<Partial<ProfileData> | null>,
  onSubscribe?: SupaSubscriptionCallback
) => {
  if (!username) {
    logger.error('profileChannel', 'no username provided');
    throw new Error('Channel Error: Current user is not authenticated');
  }
  const supabase = createBrowserClient();
  // define the subscription
  return supabase
    .channel(`profiles:${username}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
      },
      (payload) => {
        if (payload.new) onChange?.(payload.new);
      }
    )
    .subscribe(onSubscribe);
};
