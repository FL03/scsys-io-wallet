/**
 * Created At: 2025-04-08:12:14:28
 * @author - @FL03
 * @description - Hooks for working with authenticated users and their profiles
 * @file - use-profile.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Subscription, SupabaseClient } from '@supabase/supabase-js';
// project
import { CACHE_KEY_USERNAME } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';

type HookOptions = {
  client?: SupabaseClient<any, 'public', any>;
};

/**
 * Memoized hook for getting the current user's username; invokes the "public.username" function deployed on the database using
 * supabase's "rpc" method
 *
 * @returns the current user's username
 */
export const useUsername = (opts?: HookOptions) => {
  // initialize the supabase client
  const supabase = opts?.client ?? createBrowserClient();
  // Try to get the initial value from cache
  const initialUsername = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(CACHE_KEY_USERNAME) || null;
    } catch (e) {
      return null;
    }
  }, []);
  // initialize stateful variables
  const [_username, _setUsername] = React.useState<string | null>(
    initialUsername
  );
  // refs
  const authSubRef = React.useRef<Subscription | null>(null);
  // state(s)
  const [_isLoading, _setIsLoading] = React.useState<boolean>(true);

  const _handleOnChange = React.useCallback(
    (data: string | null) => {
      if (!data) {
        _setUsername(null);
        // clear the cached username
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.removeItem(CACHE_KEY_USERNAME);
          } catch (e) {
            logger.warn('Failed to clear cached username', e);
          }
        }
      }
      if (data !== _username) {
        _setUsername(data);
        if (data && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(CACHE_KEY_USERNAME, data);
          } catch (e) {
            logger.warn('Failed to cache username', e);
          }
        }
      }
    },
    [_username, _setUsername]
  );

  const _getUsername = React.useCallback(async (): Promise<string> => {
    if (!_isLoading) _setIsLoading(true);
    logger.trace('useUsername', 'fetching username...');
    const { data, error } = await supabase.rpc('username');
    // check for errors
    if (error) {
      logger.error(error, 'Error fetching username from the database...');
      throw new Error('Error fetching username from the database...');
    }
    // log the event
    logger.info('Successfully fetched the username from the database', data);
    // set the username state variable
    _handleOnChange(data);

    return data;
  }, [supabase, _isLoading, _setIsLoading, _handleOnChange]);

  // handle the subscription to the auth state changes
  const _initAuthSub = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.trace('useUsername', 'auth state changed:', event, session);
      // check if the user is logged in
      if (session) {
        const { user } = session;
        if (event === 'SIGNED_IN') {
          // fetch the username from the database
          if (
            !user.user_metadata.username ||
            user.user_metadata.username === ''
          ) {
            await _getUsername();
          } else {
            _handleOnChange(user.user_metadata.username);
          }
        }
      }
      if (event === 'SIGNED_OUT') {
        // nullify the state and clear the cache
        _handleOnChange(null);
      }
    });
    return subscription;
  }, [supabase, _username, _getUsername, _handleOnChange, _setUsername]);

  // handle loading effects
  React.useEffect(() => {
    if (_isLoading) _getUsername().finally(() => _setIsLoading(false));
    return () => {
      // ensure the loading state is set to false on unmount
      _setIsLoading(false);
    };
  }, [_getUsername, _isLoading, _setIsLoading]);
  // subscribe to the auth state changes
  React.useEffect(() => {
    // on null, initialize the subscription
    authSubRef.current ??= _initAuthSub();
    return () => {
      // unsubscribe from the auth state changes
      authSubRef.current?.unsubscribe();
      // nullify the auth subscription
      authSubRef.current &&= null;
    };
  }, [_initAuthSub, authSubRef]);

  const username = _username ?? '';

  return React.useMemo(() => username, [username]);
};
