'use client';
// imports
import * as React from 'react';
// feature-specific
import { PlatformAppBar } from './nav/platform-appbar';
import { PlatformSidebar } from './sidebar/platform-sidebar';
// components
import { Scaffold, ScaffoldContent } from '@/components/common/scaffold';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

type ScaffoldProps = {
  fullWidth?: boolean;
  sidebarOpenByDefault?: boolean;
  sidebarOnCollapse?: 'offcanvas' | 'icon' | 'none';
  sidebarPosition?: 'left' | 'right';
  sidebarVariant?: 'sidebar' | 'floating' | 'inset';
};

/** The base scaffold for the application. */
export const PlatformScaffold: React.FC<
  React.ComponentPropsWithRef<typeof Scaffold> &
    React.PropsWithChildren<ScaffoldProps>
> = ({
  ref,
  children,
  fullWidth,
  sidebarOpenByDefault = false,
  sidebarOnCollapse = 'offcanvas',
  sidebarPosition = 'right',
  sidebarVariant = 'inset',
  ...props
}) => {
  // render the scaffold with the app bar and sidebar
  return (
    <SidebarProvider defaultOpen={sidebarOpenByDefault}>
      <Scaffold {...props} ref={ref}>
        <PlatformAppBar />
        <ScaffoldContent
          className={cn(
            ' px-4 py-2 flex flex-col flex-1 gap-4 w-full',
            !fullWidth && 'container mx-auto'
          )}
        >
          {children}
        </ScaffoldContent>
        <PlatformSidebar
          collapsible={sidebarOnCollapse}
          side={sidebarPosition}
          variant={sidebarVariant}
        />
      </Scaffold>
    </SidebarProvider>
  );
};
PlatformScaffold.displayName = 'PlatformScaffold';

export default PlatformScaffold;
