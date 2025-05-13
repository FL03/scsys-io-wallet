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
import { HookCallback } from '@/types/hooks';
import {} from '@/types';
import { handleRealtimeSubscription } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseQueryOptions } from '@/types/supabase';

/** The hook state */
type HookState = {
  isLoading: boolean;
};

type UsePostsOptions = {
  client?: ReturnType<typeof createBloggerBrowserClient>;
  query?: SupabaseQueryOptions<BlogPostData>;
};

/** The return type of the custom hook designed for the blogger featureset */
type UsePostsContext = {
  data: BlogPostData[];
  state: HookState;
  getAll: (options?: SupabaseQueryOptions<BlogPostData>) => Promise<void>;
  removePost: (postId: string) => Promise<BlogPostData>;
};
/**
 * A custom hook designed to streamline interactions with the blog
 * @param {UsePostsOptions} options - The options for the hook.
 * @returns {UsePostsContext} - The posts and the loading state.
 */
export const usePosts = ({ client }: UsePostsOptions = {}): UsePostsContext => {
  // initialize a client-side supabase client
  const supabase = client ?? createBloggerBrowserClient();

  const _channel = React.useRef<RealtimeChannel | null>(null);
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

  // create a realtime channel for detecting changes to the notifications table
  const _createChannelForPublishedPosts = React.useCallback(() => {
    return supabase
      .channel(`posts:published`, { config: { private: true } })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `is_published=eq.true`,
        },
        (payload) => {
          const data = payload.new as BlogPostData;

          if (payload.eventType === 'INSERT') {
            logger.info('Creating the store...');
            _setData((prev) => [...prev, data]);
          }
          if (payload.eventType === 'UPDATE') {
            logger.info('Updating the store...');
            _setData((prev) =>
              prev.map((item) => {
                if (item.id === data.id) {
                  return { ...item, ...data };
                }
                return item;
              })
            );
          }
          if (payload.eventType === 'DELETE') {
            logger.info('Deleting the exercise...');
            _setData((prev) => prev.filter((item) => item.id !== data.id));
          }
        }
      )
      .subscribe((status, err) => {
        handleRealtimeSubscription(status, err);
        // if (onSubscription) onSubscription(status, err);
      });
  }, [supabase, _setData]);

  const _deletePostById = React.useCallback(
    async (postId: string): Promise<BlogPostData> => {
      const { data, error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .select()
        .single();

      if (error) {
        logger.error('Error removing the notification:', error.message);
        throw new Error(error.message);
      }
      _setData((prev) => prev.filter((i) => data.id === i.id));
      return data;
    },
    [_setData, supabase]
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
  // realtime effects
  React.useEffect(() => {
    // if the channel is not created, create it
    _channel.current ??= _createChannelForPublishedPosts();

    return () => {
      if (_channel.current) {
        // unsubscribe from the channel
        _channel.current?.unsubscribe();
        // remove the channel
        supabase.realtime.removeChannel(_channel.current);
        // nullify the channel
        _channel.current &&= null;
      }
    };
  }, [_channel, _createChannelForPublishedPosts]);
  // redeclare public-facing variables and methods
  const data = _data;
  const getAll = _fetchAllPosts;
  const removePost = _deletePostById;

  return React.useMemo(
    () => ({ data, state, getAll, removePost }),
    [data, state, getAll, removePost]
  );
};
