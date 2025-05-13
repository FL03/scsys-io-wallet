/**
 * Created At: 2025-04-04:20:05:11
 * @author - @FL03
 * @description - useAuth hook for managing authentication state and user information.
 * @file - use-auth.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  AuthChangeEvent,
  Session,
  Subscription,
  User,
} from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import { createBrowserClient } from '@/lib/supabase';
import { HookCallback } from '@/types';

type SupabaseAuthStateHandler = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

type AuthHookState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthHookOpts = {
  client?: ReturnType<typeof createBrowserClient>;
  onAuthStateChange?: SupabaseAuthStateHandler;
};

type AuthHookReturn = {
  getUser: () => Promise<User>;
  signOut: () => Promise<void>;
  session: Session | null;
  state: AuthHookState;
  user?: User;
  userId?: string;
  username?: string;
};

export const useAuth: HookCallback<AuthHookOpts, AuthHookReturn> = ({
  client,
  onAuthStateChange,
} = {}) => {
  const supabase = client ?? createBrowserClient();
  // store the subscription to the auth state changes as a reference
  const authSubRef = React.useRef<Subscription | null>(null);
  // local state
  const [_session, _setSession] = React.useState<Session | null>(null);
  const [_user, _setUser] = React.useState<User | undefined>();
  // loading states
  const [_isSessionLoading, _setIsSessionLoading] = React.useState(true);
  const [_isUserLoading, _setIsUserLoading] = React.useState(false);

  const _isAuthenticated = React.useMemo(
    () => !!_session?.user,
    [_session]
  );
  const _isLoading = React.useMemo(
    () => _isSessionLoading || _isUserLoading,
    [_isSessionLoading, _isUserLoading]
  );

  const _state = React.useMemo(
    () => ({
      isAuthenticated: _isAuthenticated,
      isLoading: _isLoading,
    }),
    [_isAuthenticated, _isLoading]
  );

  // this callback handles auth state changes
  const _createAuthSub = React.useCallback(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // log the event
      logger.trace(
        { event, id: session?.user?.id },
        'Detected a change of auth state...'
      );
      // if a method is passed, call it with the event and session
      // data **before** executing the default behaviors
      if (onAuthStateChange) onAuthStateChange(event, session);

      // update the local session
      _setSession(session);

      if (event === 'SIGNED_OUT') {
        logger.info('Signing out the current user...');
        // nullify the local user instance
        _setUser(undefined);
      }
      if (session) {
        const { user } = session;
        if (
          [
            'PASSWORD_RECOVERY',
            'SIGNED_IN',
            'TOKEN_REFRESH',
            'USER_UPDATED',
          ].includes(event)
        ) {
          logger.info(
            {
              event,
            },
            'Reflecting the updated user instance in the local state...'
          );
          // update the local user instance
          _setUser(user);
        }
      }
    });
    return subscription;
  }, [supabase, _setSession, _setUser, onAuthStateChange]);
  // use the supabase client to get the session
  const _getSession = React.useCallback(async (): Promise<Session | null> => {
    if (!_isSessionLoading) _setIsSessionLoading(true);
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        logger.error(error, 'Error getting supabase auth session');
        throw error;
      }
      if (!session) {
        return null;
      }
      _setSession(session);
      _setUser(session.user);
      return session;
    } catch (error) {
      logger.error(error, 'Error getting supabase auth session');
      throw error;
    } finally {
      _setIsSessionLoading(false);
    }
  }, [
    supabase,
    _isSessionLoading,
    _setIsSessionLoading,
    _setSession,
    _setUser,
  ]);
  // use the supabase client to get the user
  const _getUser = React.useCallback(async (): Promise<User> => {
    if (!_isUserLoading) _setIsUserLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        logger.error(error, 'Error getting user');
        throw error;
      }
      _setUser(data.user);
      return data.user;
    } catch (error) {
      logger.error(error, 'Error getting user');
      throw error;
    } finally {
      _setIsUserLoading(false);
    }
  }, [supabase, _isUserLoading, _setIsUserLoading, _setUser]);
  // a callback handling the logout process for a user
  const signOut = React.useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Error signing out the user: ', error.message);
      throw new Error(error.message);
    }
    logger.info('Successfully signed out the user...');
    return;
  }, [supabase]);
  // session-specific loading effects
  React.useEffect(() => {
    if (_isSessionLoading) _getSession();
    // handle unmounting
    return () => {
      // cleanup loading states
      _setIsSessionLoading(false);
    };
  }, [_isSessionLoading, _setIsSessionLoading, _getSession]);
  // user-specific loading effects
  React.useEffect(() => {
    // trigger the user loading process if the session is loaded and the user is not
    if (_isUserLoading) _getUser();
    // handle unmounting
    return () => {
      // cleanup loading states
      _setIsUserLoading(false);
    };
  }, [_isUserLoading, _setIsUserLoading, _getUser]);
  // realtime-specific effects
  React.useEffect(() => {
    // if there isn't a reference to the subscription, create one
    authSubRef.current ??= _createAuthSub();
    // handle unmounting
    return () => {
      // cleanup realtime effects
      authSubRef.current?.unsubscribe();
      authSubRef.current &&= null;
    };
  }, [_createAuthSub]);

  // redeclare external methods and variables
  const getUser = _getUser;
  // memoize the return object
  return React.useMemo(
    () => ({
      session: _session,
      state: _state,
      user: _user,
      userId: _user?.id,
      username: _user?.user_metadata.username,
      getUser,
      signOut,
    }),
    [_session, _state, _user, getUser, signOut]
  );
};
