// project
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from '@/lib/supabase';
// feature-specific
import { ProfileData } from '../types';

type ChannelHandlerProps = {
  onProfileChange?(values?: ProfileData | null): void;
};

export const profileChannel = (
  username: string,
  options?: ChannelHandlerProps
) => {
  const { onProfileChange } = options || {};
  const supabase = createBrowserClient();
  return supabase
    .channel(`profiles:${username}`, { config: { private: true } })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `username=eq.${username}`,
      },
      (payload) => {
        const data = payload.new as ProfileData;

        if (['INSERT', 'UPDATE'].includes(payload.eventType)) {
          logger.trace(
            payload.eventType,
            'Updating the local instance of the users profile'
          );
          if (onProfileChange) onProfileChange?.(data);
        }
        if (['DELETE'].includes(payload.eventType)) {
          logger.info('Deleting the user profile');
          onProfileChange?.(null);
        }
      }
    )
    .subscribe(handleRealtimeSubscription);
};
