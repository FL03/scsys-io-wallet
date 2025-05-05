/**
 * Created At: 2025-04-04:14:32:03
 * @author - @FL03
 * @description - Profile Provider Component for managing user profiles in a React application.
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
// project
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from '@/lib/supabase';
// hooks
import { useUsername } from '@/hooks/use-username';
// feature-specific
import type { ProfileData } from './types';
import { fetchUserProfile } from './utils';

type ProviderState = {
  isLoading: boolean;
};
type ProfileContext = {
  isOwner: boolean;
  profile: ProfileData | null;
  state: ProviderState;
  username: string;
  loadProfile: () => Promise<ProfileData | null>;
};

export const ProfileContext = React.createContext<ProfileContext | null>(null);

/** create a profile context using values from the provider. */
export const useProfile = (): ProfileContext => {
  const context = React.useContext(ProfileContext);
  if (!context) {
    throw new Error('The useProfile must be used within a ProfileProvider');
  }
  return context;
};

type ProviderProps = { username?: string | null };

/** The Profile Provider component uses the given username to manage the corresponding user profile */
export const ProfileProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & ProviderProps
>(({ username, ...props }, ref) => {
  const currentUser = useUsername();
  // if no username is passed, use the current user
  username ??= currentUser;
  // determine if the current user is the owner of the profile
  const isOwner = currentUser === username;
  // if no username is passed, use the current user
  if (!username || username.trim() === '') {
    logger.error('no username was passed to the profile provider');
    throw new Error('No username was passed to the profile provider');
  }
  // initialize the supabase client for the browser
  const supabase = createBrowserClient();
  // initialize the profile state
  const [_profile, _setProfile] = React.useState<ProfileData | null>(null);
  const [_isLoading, _setIsLoading] = React.useState<boolean>(true);
  // initialize a reference to the channel
  const channelRef = React.useRef<RealtimeChannel | null>(null);
  // create a callback for loading the profile data
  const _loadProfile = React.useCallback(
    async (alias: string): Promise<ProfileData | null> => {
      // ensure the loading toggle is triggered
      if (!_isLoading) _setIsLoading(true);
      // try to fetch the profile data
      logger.trace(`Loading profile for ${alias}`);
      try {
        const data = await fetchUserProfile({ username: alias });
        // if a profile is returned, set it to the state
        if (data) _setProfile(data);
        // return the data
        return data;
      } catch (error) {
        logger.error(error, 'Unable to load the profile data');
        throw error;
      } finally {
        // set the loading state to false
        _setIsLoading(false);
      }
    },
    [_setProfile, _setIsLoading, _isLoading]
  );
  const _onProfileChange = React.useCallback(
    (payload: RealtimePostgresChangesPayload<ProfileData>) => {
      const data = payload.new as ProfileData;

      if (payload.eventType === 'INSERT') {
        logger.info('A new user profile has been created');
        _setProfile(data);
      }
      if (payload.eventType === 'UPDATE') {
        logger.info('Updating the user profile');
        _setProfile(data);
      }
      if (payload.eventType === 'DELETE') {
        logger.info('Profile deleted');
        _setProfile(null);
      }
    },
    [_setProfile]
  );
  // a callback for creating a channel
  const _createProfileChannel = React.useCallback(
    (alias?: string | null) => {
      return supabase
        .channel(`profiles:${alias}`, { config: { private: true } })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `username=eq.${alias}`,
          },
          _onProfileChange
        )
        .subscribe(handleRealtimeSubscription);
    },
    [supabase, _onProfileChange]
  );
  // loading effects
  React.useEffect(() => {
    // handle profile loading
    if (_isLoading && username) _loadProfile(username);
    return () => {
      _setIsLoading(false);
    };
  }, [username, _isLoading, _setIsLoading, _loadProfile]);
  // realtime effects
  React.useEffect(() => {
    // if a username is passed and the channel is not already created, create a new channel
    if (username) {
      channelRef.current ??= _createProfileChannel(username);
    }

    return () => {
      if (channelRef.current) {
        // unsubscribe from the channel
        channelRef.current?.unsubscribe();
        // remove the channel
        supabase.realtime.removeChannel(channelRef.current);
        // nullify the local reference
        channelRef.current &&= null;
      }
    };
  }, [supabase, username, channelRef, _createProfileChannel]);

  // redeclare stateful parameters and public facing methods
  const profile = _profile;
  // memoize a state object to group all states for the provider
  const state = React.useMemo(
    () => ({
      isLoading: _isLoading,
    }),
    [_isLoading]
  );

  const loadProfile = React.useCallback(
    async () => _loadProfile(username),
    [username, _loadProfile]
  );

  // create the context object
  const ctx = React.useMemo(
    () => ({
      profile: profile,
      uid: profile?.id,
      username,
      isOwner,
      state,
      loadProfile,
    }),
    [username, profile, isOwner, state, loadProfile]
  );
  return (
    <ProfileContext.Provider value={ctx}>
      <div ref={ref} {...props} />
    </ProfileContext.Provider>
  );
});
ProfileProvider.displayName = 'ProfileProvider';

export default ProfileProvider;
