'use server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
// feature-specific
import { ProfileData } from '../types';
/**
 *
 * @description Fetches the user profile from the database using the username.
 * @param username - The username of the user to fetch the profile for.
 * @returns The user profile object.
 * @throws Error if the username is not provided or if there is an error fetching the profile.
 */
export const getProfile = async (
  username?: string | null
): Promise<ProfileData | null> => {
  if (!username || username.trim() === '') {
    logger.warn(
      'getProfile',
      'skipping fetch of profile because username was nullish'
    );
    return null;
  }

  const supabase = await createServerClient();
  // fetch the user profile
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('username', username)
    .single();

  if (error) {
    logger.error('Error fetching profile:', error);
    throw error;
  }

  return data;
};

export const upsertProfile = async (
  profile?: any | null
): Promise<ProfileData | null> => {
  const supabase = await createServerClient();

  if (!profile) {
    logger.warn(
      'skipping upsert of profile because the passed params were nullish'
    );
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { count: 'exact', onConflict: 'id' })
    .eq('id', profile.id)
    .select()
    .single();

  if (error) {
    logger.error('Error upserting profile:', error);
    throw error;
  }
  return data;
};
