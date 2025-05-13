// client.ts
'use client';

// project
import { logger } from "@/lib/logger";
import { createBrowserClient } from "@/lib/supabase"
import { cleanParams, resolveOrigin } from "@/lib/utils";
import { SupabaseFetchOptions } from "@/types/supabase";
// feature-specific
import { BlogPostData, BloggerDatabase } from "../types";

const BLOGGER_API_ENDPOINT = '/api/blog';

const bloggerApiUrl = (...path: string[]) => {
  return [BLOGGER_API_ENDPOINT, ...path].join("/");
}
/** Initializes a new browser client for supabase pre-configured to work with the `blogger` schema */
export const createBloggerBrowserClient = () => {
  return createBrowserClient<BloggerDatabase, "blogger">("blogger");
}

/** Fetch the user profile from the database using the dedicated api.  */
export const fetchPost = async (
  params?: SupabaseFetchOptions,
  init?: RequestInit
): Promise<BlogPostData> => {
  // ensure undefined or null params are not passed to the URL
  const _params = cleanParams(params ?? {});
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = new URL(bloggerApiUrl('posts', 'post'), resolveOrigin());
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

/** Fetch the user profile from the database using the dedicated api.  */
export const fetchPosts = async (
  params?: SupabaseFetchOptions,
  init?: RequestInit
): Promise<BlogPostData[]> => {
  // ensure undefined or null params are not passed to the URL
  const _params = cleanParams(params ?? {});
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = new URL(bloggerApiUrl('posts'), resolveOrigin());
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