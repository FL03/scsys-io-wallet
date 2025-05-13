'use client';
// imports
import * as React from 'react';
// feature-specific
import { PlatformAppBar } from './nav/platform-appbar';
import { PlatformSidebar } from './sidebar/platform-sidebar';
// components
import {
  Scaffold,
  ScaffoldContent,
  ScaffoldProvider,
} from '@/components/common/scaffold';
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
  className,
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
    <SidebarProvider defaultOpen={sidebarOpenByDefault} className="flex-1 h-full w-full">
      <ScaffoldProvider>
        {/* screen */}
        <Scaffold {...props} ref={ref} className={cn('min-h-full', className)}>
          {/* appbar */}
          <PlatformAppBar />
          {/* display */}
          <ScaffoldContent asContainer={!fullWidth}>{children}</ScaffoldContent>
        </Scaffold>
      </ScaffoldProvider>
      {/* sidebar */}
      <PlatformSidebar
        collapsible={sidebarOnCollapse}
        side={sidebarPosition}
        variant={sidebarVariant}
      />
    </SidebarProvider>
  );
};
PlatformScaffold.displayName = 'PlatformScaffold';

export default PlatformScaffold;
