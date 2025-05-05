'use client';
// imports
import * as React from 'react';
// project
import { AuthButton } from '@/features/auth';
import { cn } from '@/lib/utils';
// hooks
import { useIsMobile } from '@/hooks/use-mobile';
import { useSupabaseAuth } from '@/hooks/use-supabase';
// feature-specific
import { PlatformNavbar } from './platform-navbar';
import { CustomSidebarTrigger } from '../sidebar';
// components
import { ActionGroup, ActionGroupItem } from '@/components/common/action-group';
import {
  Appbar,
  AppbarContent,
  AppbarLeading,
  AppbarTitle,
  AppbarTrailing,
} from '@/components/common/appbar';
import { AppLogo } from '@/components/common/icons';
import { ThemeButton } from '@/components/common/theme';

/** The primary appbar used throughout the application  */
export const PlatformAppBar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Appbar>, 'children'>
> = ({ ref, className, flavor = 'default', variant = 'default', ...props }) => {
  // initialize a reference to the supabase auth hook
  const auth = useSupabaseAuth();
  const isMobile = useIsMobile();
  // render the component
  return (
    <Appbar {...props} ref={ref} className={cn('z-50', className)}>
      <AppbarLeading>
        <AppLogo className="h-8 w-8" />
        <AppbarTitle>scsys</AppbarTitle>
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
            <AuthButton variant="outline" inline={isMobile} />
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
