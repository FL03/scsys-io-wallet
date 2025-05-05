/**
 * Created At: 2025-04-04:22:12:39
 * @author - @FL03
 * @description - common queries for supabase
 * @file - queries.ts
 */
// project
import { logger } from '@/lib/logger';
// feature-specific
import { createBrowserClient } from './client';
import { createServerClient } from './server';
import { ClientOptions, SupabaseHandlerProps } from './types';
import { PublicDatabase } from '@/types/database.types';
import { SupaClient } from '@/types/supabase';

/** a universal adapter to create supabase clients for NextJS
 * 
 * @description - this function creates a supabase client for the current environment (SSR or CSR) and returns it. It can be used in both server and client components.
 * @params {upabaseHandlerProps<Database, SchemaName>} props - the props for the supabase client. It can be a supabase client, schema name, or ssr flag.
 * 
 */
export const supabaseClient = async <
  Database = PublicDatabase,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
>(
  props?: SupabaseHandlerProps<Database, SchemaName>
): Promise<SupaClient<Database, SchemaName>> => {
  return props?.client
    ? await props.client
    : props?.ssr
      ? createServerClient<Database, SchemaName>(props?.schema)
      : createBrowserClient<Database, SchemaName>(props?.schema);
};

export const getUserId = async (props?: SupabaseHandlerProps) => {
  const supabase = await supabaseClient(props);
  return await supabase.rpc('get_current_user_id').then(({ data }) => data);
};

export const getUsername = async (
  props?: SupabaseHandlerProps<PublicDatabase, 'public'>
): Promise<string | undefined> => {
  const supabase = await supabaseClient(props);
  const { data, error } = await supabase.rpc('username');

  if (error) {
    logger.error('Error getting username', error);
    throw error;
  }
  return data || undefined;
};

export const currentUser = async (
  client?: SupaClient,
  options?: ClientOptions
) => {
  const supabase = await supabaseClient({ client, ...options });
  return supabase.auth
    .getUser()
    .catch((error) => {
      throw error;
    })
    .then(({ data }) => data.user);
};
