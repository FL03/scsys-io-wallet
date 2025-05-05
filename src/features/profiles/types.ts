/**
 * Created At: 2025-04-04:21:05:31
 * @author - @FL03
 * @description - Profile types
 * @file - types.ts
 */
import { Database, PublicTables } from '@/types/database.types';

export const profileTable = {
  name: 'profiles',
  schema: 'public',
};
/** A database-compatible object for the profiles table */
export type ProfileData = PublicTables<'profiles'>;
/** A database-compatible object for inserting into the profiles table */
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
/** A database-compatible object for updating entries within the profiles table */
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
/** A generic type alias for database-compatible entries for the profiles table */
export type Profile = ProfileData | ProfileInsert | ProfileUpdate;
/** Common URL parameters for authenticated routes */
export type ProfileRouteParams = { username: string };
