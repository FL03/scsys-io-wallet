'use client';
// imports
import * as React from 'react';
// project
import { AuthButton } from '@/features/auth';
import { cn } from '@/lib/utils';
// hooks
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-supabase';
// feature-specific
import { PlatformNavbar } from './platform-navbar';
import { CustomSidebarTrigger } from '../sidebar';
// components
import { ActionGroup, ActionGroupItem } from '@/components/common/actions';
import {
  Appbar,
  AppbarContent,
  AppbarLeading,
  AppbarTitle,
  AppbarTrailing,
} from '@/components/common/appbar';
import { AppLogo } from '@/components/common/icons';
import { ThemeButton } from '@/components/common/buttons';

/** The primary appbar used throughout the application  */
export const PlatformAppBar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Appbar>, 'children'>
> = ({ ref, flavor = 'default', variant = 'default', ...props }) => {
  // initialize a reference to the supabase auth hook
  const auth = useAuth();
  const isMobile = useIsMobile();
  // render the component
  return (
    <Appbar {...props} ref={ref}>
      <AppbarLeading>
        <AppLogo className="h-6 w-6" />
        <AppbarTitle className="sr-only md:not-sr-only">scsys</AppbarTitle>
      </AppbarLeading>
      <AppbarContent>
        <PlatformNavbar className="overflow-x-auto" />
      </AppbarContent>
      <AppbarTrailing>
        <ActionGroup>
          <ActionGroupItem>
            <ThemeButton />
          </ActionGroupItem>
          <ActionGroupItem>
            <AuthButton variant="outline" />
          </ActionGroupItem>
          {auth.state.isAuthenticated && (
            <ActionGroupItem>
              <CustomSidebarTrigger />
            </ActionGroupItem>
          )}
        </ActionGroup>
      </AppbarTrailing>
    </Appbar>
  );
};
PlatformAppBar.displayName = 'PlatformAppBar';

export default PlatformAppBar;
