/**
 * Created At: 2025-04-04:19:43:34
 * @author - @FL03
 * @description - Auth Button Component
 * @file - auth-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { LogInIcon, LogOutIcon } from 'lucide-react';
// hooks
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// project
import { ENDPOINT_AUTH_LOGIN } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/use-supabase';

type AuthButtonProps = {
  className?: string;
  size?: React.ComponentProps<typeof Button>['size'];
  variant?: React.ComponentProps<typeof Button>['variant'];
  inline?: boolean;
  onError?: (error?: any) => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onSuccess?: () => void;
};
/** A simple authentication button for managing the user state. */
export const AuthButton: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'onClick'> & AuthButtonProps
> = ({
  ref,
  className,
  size = 'default',
  variant = 'destructive',
  inline,
  onError,
  onSignIn,
  onSignOut,
  onSuccess,
  ...props
}) => {
  const router = useRouter();
  // initialize the client-side supabase client
  const auth = useAuth();
  // a callback for handling the click event on the button
  const handleOnClick = async (event: React.BaseSyntheticEvent) => {
    // prevent default action
    event.preventDefault();
    // prevent the event from propagating upward
    event.stopPropagation();
    // trace the event
    logger.trace('Handling the auth button click event...');
    try {
      // resolve the callback to use w.r.t. the current authentication state
      if (auth.state.isAuthenticated) {
        if (onSignOut) onSignOut();
        else await auth.signOut();
      } else {
        if (onSignIn) onSignIn();
        else router.push(ENDPOINT_AUTH_LOGIN);
      }
      // use the onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMsg = auth.state.isAuthenticated
        ? 'Error signing out...'
        : 'Error signing in...';
      logger.error({ error }, errorMsg);
      toast.error('Error', { description: errorMsg });
      if (onError) onError(error);
      throw error;
    }
  };
  // a callback to resolve into the description w.r.t. the current authentication state
  const description = () => {
    if (auth.state.isAuthenticated) {
      return 'Sign out of your account';
    }
    return 'Sign in to your account';
  };
  // render the component
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            ref={ref}
            className={cn('transition-colors', className)}
            size={inline ? 'icon' : size}
            variant={variant}
            onClick={handleOnClick}
          >
            {auth.state.isAuthenticated ? <LogOutIcon /> : <LogInIcon />}
            <span className={inline ? 'sr-only' : 'not-sr-only'}>
              {auth.state.isAuthenticated ? 'Logout' : 'Login'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{description()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
AuthButton.displayName = 'AuthButton';

export default AuthButton;
