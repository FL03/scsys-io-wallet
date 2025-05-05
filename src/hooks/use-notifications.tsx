/**
 * Created At: 2025-04-08:11:30:58
 * @author - @FL03
 * @description - Hooks for the fitness feature
 * @file - use-fitness.tsx
 */
'use client';
// imports
import * as React from 'react';
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
// project
import {
  Notification,
  NotificationData,
  fetchNotifications,
} from '@/features/notifications';
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from '@/lib/supabase';
import { SupaSubscriptionCallback } from '@/types/supabase';
// hooks
import { useUsername } from './use-username';

type HookParams = {
  username?: string | null;
  onSubscription?: SupaSubscriptionCallback;
  onNotificationChange?: (
    payload: RealtimePostgresChangesPayload<NotificationData>
  ) => void;
};

export const useNotifications = ({
  username,
  onSubscription,
}: HookParams = {}) => {
  // instantiate the client-side supabase client
  const supabase = createBrowserClient();
  // get the current username with the hook
  const currentUsername = useUsername({ client: supabase });
  // default to the current users username
  username ??= currentUsername;
  // setup a reference to the realtime channel
  const _channel = React.useRef<RealtimeChannel | null>(null);
  // initialize the stateful stores
  const [_data, _setData] = React.useState<Notification[]>([]);
  // initialize the loading state
  const [_isLoading, _setIsLoading] = React.useState<boolean>(true);
  const [_isLoaded, _setIsLoaded] = React.useState<boolean>(false);
  // double check the username
  if (!username || username.trim() === '') {
    logger.error('No valid username was passed to the useNotifications hook!');
    throw new Error('No username was passed onto the hook!');
  }
  //
  const _getNotificationsForUser = React.useCallback(
    async (u: string) => {
      try {
        const data = await fetchNotifications({ username: u });
        _setData(data);
      } catch (error) {
        logger.error('Error fetching exercise:', error);
      }
    },
    [_setData]
  );

  const _deleteNotificationById = React.useCallback(
    async (id: string): Promise<NotificationData | null> => {
      const { data, error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Error removing the notification:', error.message);
        return null;
      }
      _setData((prev) => prev.filter((i) => data.id === i.id));
      return data;
    },
    [_setData, supabase]
  );
  // create a realtime channel for detecting changes to the notifications table
  const _createChannel = React.useCallback(
    (u: string) => {
      return supabase
        .channel(`notifications:${u}`, { config: { private: true } })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `username=eq.${u}`,
          },
          (payload) => {
            const data = payload.new as Notification;

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
          if (onSubscription) onSubscription(status, err);
        });
    },
    [supabase, _setData]
  );
  // loading effects
  React.useEffect(() => {
    // perform an initial load
    if (_isLoading) {
      _getNotificationsForUser(username).finally(() => _setIsLoaded(true));
    }
    return () => {
      // cleanup the loading state(s)
      _setIsLoading(false);
      _setIsLoaded(false);
    };
  }, [
    username,
    _isLoading,
    _setIsLoading,
    _setIsLoaded,
    _getNotificationsForUser,
  ]);
  // realtime effects
  React.useEffect(() => {
    if (username) {
      // if the channel is not created, create it
      _channel.current ??= _createChannel(username);
    }
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
  }, [username, _channel, _createChannel]);
  // redeclare stateful parameters & public methods
  const data = _data;
  const isLoading = _isLoading;
  const deleteNotification = _deleteNotificationById;
  const state = React.useMemo(
    () => ({
      isLoading: _isLoading,
      isLoaded: _isLoaded,
    }),
    [_isLoading, _isLoaded]
  );

  // return the memoized values
  return React.useMemo(
    () => ({
      data,
      isLoading,
      deleteNotification,
    }),
    [data, isLoading, deleteNotification]
  );
};
