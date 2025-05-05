// use-blogger.tsx
'use client';
import * as React from 'react';
// project
import {
  BlogPostData,
  createBloggerBrowserClient,
  fetchPosts,
} from '@/features/blog';
import { logger } from '@/lib/logger';
import { HookCallback } from '@/types/callbacks';
import { BloggerSupabaseClientType } from '@/types';

/** The hook state */
type HookState = {
  isLoading: boolean;
};

type SupabaseFetchOptions = {
  limit?: number;
  offset?: number;
};

type HookOptions = {
  client?: BloggerSupabaseClientType;
  query?: SupabaseFetchOptions;

}

/** The return type of the custom hook designed for the blogger featureset */
type HookReturn = {
  data: BlogPostData[];
  state: HookState;
  fetch: (options?: SupabaseFetchOptions) => Promise<void>;
};
/**
 * A custom hook designed to streamline interactions with the blog
 * @param {HookOptions} options - The options for the hook.
 * @returns {HookReturn} - The posts and the loading state.
 */
export const usePosts: HookCallback<HookOptions, HookReturn> = ({ client, ...options } = {}) => {
  // initialize a client-side supabase client
  const supabase = client ?? createBloggerBrowserClient();
  // declare a stateful variable to manage the posts
  const [_data, _setData] = React.useState<BlogPostData[]>([]);
  // initialize the loading state
  const [_loading, _setLoading] = React.useState<boolean>(true);

  // aggregate all stateful indicators into a single object & memoize it
  const state = React.useMemo<HookState>(
    () => ({
      isLoading: _loading,
    }),
    [_loading]
  );

  const _fetchAllPosts = React.useCallback(
    async (args?: { limit?: number; offset?: number }) => {
      if (!_loading) _setLoading(true);

      try {
        const posts = await fetchPosts(args);
        _setData(posts);
      } catch (error) {
        logger.error('Error fetching posts:', error);
      } finally {
        _setLoading(false);
      }
    },
    [_loading, _setData, _setLoading]
  );
  // handling loading effects
  React.useEffect(() => {
    if (_loading) _fetchAllPosts({ limit: 10, offset: 0 });

    return () => {
      // cleanup function to reset the loading state
      _setLoading(false);
    };
  }, [_loading, _setLoading, _fetchAllPosts]);

  // redeclare public-facing variables and methods
  const data = _data;
  const fetch = _fetchAllPosts;

  return React.useMemo(() => ({ data, state, fetch }), [data, state, fetch]);
};
