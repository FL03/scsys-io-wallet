/*
  Appellation: provider <auth>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
// feature-specific
import { NotificationData, Notification } from './types';
import { fetchNotifications } from './utils';

type ContextState = {
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};

type NotificationContext = {
  notifications: NotificationData[];
  state: ContextState;
  getNotification?: (id: string) => NotificationData | undefined;
  insertNotification?: (notification: Notification) => void;
  updateNotification?: (notification: Notification) => void;
  removeNotification?: (id: string) => void;
  isLoading?: boolean;
};

export const NotificationContext =
  React.createContext<NotificationContext | null>(null);

export const useNotificationsContext = (): NotificationContext => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('The useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const NotificationProvider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { username: string }
>(({ username, ...props }, ref) => {
  // instantiate the client-side supabase client
  const supabase = createBrowserClient();
  // initialize the profile state
  const [_store, _setStore] = React.useState<NotificationData[]>([]);
  // initialize various stateful indicators
  const [_isLoading, _setIsLoading] = React.useState<boolean>(true);
  const [_isUpdating, _setIsUpdating] = React.useState<boolean>(false);
  const [_isDeleting, _setIsDeleting] = React.useState<boolean>(false);
  // setup a reference to the realtime channel
  const channelRef = React.useRef<RealtimeChannel | null>(null);
  // create a callback for loading the profile data
  const _getNotifications = React.useCallback(
    async (u: string) => {
      if (!_isLoading) _setIsLoading(true);
      try {
        const data = await fetchNotifications({ username: u });
        if (data) _setStore(data);
      } catch (err) {
        logger.error(err);
      } finally {
        _setIsLoading(false);
      }
    },
    [_isLoading, _setIsLoading, _setStore]
  );

  // a callback for creating a channel
  const _createChannel = React.useCallback(
    (alias: string) => {
      return supabase
        .channel(`notifications:${alias}`, { config: { private: true } })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `username=eq.${alias}`,
          },
          (payload) => {
            const data = payload.new as NotificationData;

            if (payload.eventType === 'INSERT') {
              logger.info('Inserted a notification');
              _setStore((prev) => [...prev, data]);
            }
            if (payload.eventType === 'UPDATE') {
              logger.info('Updated a notification');
              _setStore((prev) => {
                return prev.map((item) =>
                  item.id === data.id ? { ...item, ...data } : item
                );
              });
            }
            if (payload.eventType === 'DELETE') {
              logger.info('Deleted a notification');
              _setStore((prev) => prev.filter(({ id }) => id !== data.id));
            }
          }
        )
        .subscribe(handleRealtimeSubscription);
    },
    [supabase, _setStore]
  );
  // initial load
  React.useEffect(() => {
    // if null, load the profile data
    if (_isLoading) _getNotifications(username);

    return () => {
      // ensure the loading state is false on unmount
      _setIsLoading(false);
    }
  }, [username, _isLoading, _setIsLoading, _getNotifications]);
  // realtime effects
  React.useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = _createChannel(username);
    }
    return () => {
      if (channelRef.current) {
        supabase.realtime.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [channelRef, supabase, _createChannel]);
  // redeclare stateful parameters and public-facing methods
  const notifications = _store;

  // create a setter function
  const setStore = React.useCallback(_setStore, [_setStore]);

  // group state indicators into a single object
  const state = React.useMemo(
    () => ({
      isDeleting: _isDeleting,
      isLoading: _isLoading,
      isUpdating: _isUpdating,
    }),
    [_isDeleting, _isLoading, _isUpdating]
  );
  // create the context object
  const ctx = React.useMemo(
    () => ({ notifications, state }),
    [notifications, state]
  );
  return (
    <NotificationContext value={ctx}>
      <div ref={ref} {...props} />
    </NotificationContext>
  );
});
NotificationProvider.displayName = 'NotificationProvider';
