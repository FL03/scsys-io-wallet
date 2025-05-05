import { REALTIME_SUBSCRIBE_STATES, SupabaseClient } from "@supabase/supabase-js";


export type SupabaseFetchOptions = {
  limit?: number;
  offset?: number;
  ascending?: boolean;
};

export type SupabaseSortBy<TData> = {
  column: keyof TData;
  ascending?: boolean;
}

export type AsyncRouteParams = Record<string, string | number | boolean | null | undefined>;

export type AsyncRouteCallback<TParams extends AsyncRouteParams = SupabaseFetchOptions, TInit extends RequestInit = RequestInit, TOut = unknown> = (params?: TParams, init?: TInit) => Promise<TOut>;


export type SupabaseQueryOptions<T> = {
  limit?: number;
  orderBy?: {
    column: keyof T;
    ascending?: boolean;
  };
};

export type SupabaseQueryHandler<TData, TOut = TData[]> = (props?: SupabaseQueryOptions<TData>) => Promise<TOut>;

export type SupaSubscriptionCallback = (
  status: REALTIME_SUBSCRIBE_STATES,
  err?: Error
) => void;

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