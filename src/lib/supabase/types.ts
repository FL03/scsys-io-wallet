/*
  Appellation: supabase <module>
  Contrib: @FL03
*/

import { SupabaseClient } from "@supabase/supabase-js";

export type SupaClient<Database = any, SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database> = SupabaseClient<Database, SchemaName> | Promise<SupabaseClient<Database, SchemaName>>;

export type ClientOptions<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
> = { schema?: SchemaName; ssr?: boolean };

export type SupabaseServerAction<TOut> = <Database, SchemaName extends string & keyof Database>(client?: SupaClient<Database, SchemaName>, options?: ClientOptions) => TOut;

export type SupabaseHandlerProps<
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
> = {
  client?: SupaClient<Database, SchemaName>;
  schema?: SchemaName;
  ssr?: boolean;
};

export type SupabaseClientHandler<
  TOut = any,
  Database = any,
  SchemaName extends string & keyof Database = 'public' extends keyof Database
    ? 'public'
    : string & keyof Database,
> = (
  client?: SupaClient<Database, SchemaName>,
  options?: ClientOptions<SchemaName>
) => Promise<TOut>;