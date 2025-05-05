/**
 * Created At: 2025-04-04:14:51:29
 * @author - @FL03
 * @description - supabase primitives and utilities for integrating with their systems
 * @file - index.ts
 */
export { createBrowserClient } from './client';
export {
  createServerClient,
} from './server';

export { supabaseUrl, supabaseKey } from './consts';
export * from './helpers';
export * from './queries';
export * from './types';
