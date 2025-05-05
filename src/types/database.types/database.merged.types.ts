import { Database as PublicDatabase } from './database.public.types';
import { Database as BloggerDatabase } from './database.blogger.types';

import { SupabaseClient } from '@supabase/supabase-js';

export type Database = {
  blogger: BloggerDatabase['blogger'];
  public: PublicDatabase['public'];
};

export type Tables = {
  blogger: BloggerDatabase['blogger']['Tables'];
  public: PublicDatabase['public']['Tables'];
};

export type Enums = {
  blogger: BloggerDatabase['blogger']['Enums']
  public: PublicDatabase['public']['Enums'];
};


export type Functions = {
  blogger: BloggerDatabase['blogger']['Functions']
  public: PublicDatabase['public']['Functions'];
};

export type Views = {
  blogger: BloggerDatabase['blogger']['Views'];
  public: PublicDatabase['public']['Views'];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BloggerSupabaseClientType = SupabaseClient<BloggerDatabase, "blogger">