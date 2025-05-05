/*
  Appellation: provider-buttons <widgets>
  Contrib: @FL03
*/
'use client';
// globals
import * as React from 'react';
// imports
import { Provider } from '@supabase/supabase-js';
import { toast } from 'sonner';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { createBrowserClient } from '@/lib/supabase';
// components
import {
  GithubIcon,
  GoogleIcon,
  XPlatformLogo,
} from '@/components/common/icons';
import { Button } from '@/components/ui/button';

type ProviderButtonMode = 'sign-in' | 'link' | 'sign-up';

type AuthProviderButtonsProps = {
  inline?: boolean;
  mode?: ProviderButtonMode;
};
/** A set of buttons for signing in or linking with OAuth providers. */
export const AuthProviderButtons: React.FC<
  React.ComponentPropsWithRef<'div'> & AuthProviderButtonsProps
> = ({ ref, className, mode = 'sign-in', inline, ...props }) => {
  // initialize the provider state
  const [scope, setScope] = React.useState<Provider | null>(null);
  // initialize the supabase client
  const supabase = createBrowserClient();
  // handle the OAuth sign-in or link
  const handleOnProviderClicked = (provider: Provider) => {
    return async (event: React.BaseSyntheticEvent) => {
      // prevent the default event action
      event.preventDefault();
      // prevent the event from bubbling up
      event.stopPropagation();
      try {
        // ensure the current scope matches the passed provider
        if (provider !== scope) setScope(provider);

        if (mode === 'sign-in') {
          const { error: loginError } = await supabase.auth.signInWithOAuth({
            provider,
          });
          if (loginError) {
            logger.error(
              { error: loginError, provider },
              `An error occurred when signing in with ${provider}`
            );
            toast.error('Error', { description: loginError.message });
            return;
          }
          toast.success(`Signed in with ${provider}`);
        }
        if (mode === 'link') {
          const { error: linkingError } = await supabase.auth.linkIdentity({
            provider,
          });
          if (linkingError) {
            logger.error(
              { error: linkingError, provider },
              `An error occurred when linking with ${provider}`
            );
            toast.error('Error', { description: linkingError.message });
            return;
          }
          logger.info('Linking identity with provider:', provider);
          toast.success(`Linked with ${provider}`);
        }
      } catch (error) {
        logger.error('Error:', error);
        toast.error('Error', {
          description: 'An error occurred while signing in.',
        });
      } finally {
        setScope(null);
      }
    };
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'gap-2 lg:gap-4',
        inline && 'flex flex-row flex-nowrap items-center',
        !inline && 'flex flex-1 flex-col',
        className
      )}
    >
      <Button
        variant="secondary"
        onClick={handleOnProviderClicked('github')}
        disabled={scope === 'github'}
      >
        <GithubIcon />
        <span className={inline ? 'sr-only' : 'not-sr-only'}>GitHub</span>
      </Button>
      <Button
        variant="secondary"
        onClick={handleOnProviderClicked('google')}
        disabled={scope === 'google'}
      >
        <GoogleIcon />
        <span className={inline ? 'sr-only' : 'not-sr-only'}>Google</span>
      </Button>
      <Button
        variant="secondary"
        onClick={handleOnProviderClicked('twitter')}
        disabled={scope === 'twitter'}
      >
        <XPlatformLogo />
        <span className={inline ? 'sr-only' : 'not-sr-only'}>Twitter</span>
      </Button>
    </div>
  );
};
AuthProviderButtons.displayName = 'AuthProviderButtons';
