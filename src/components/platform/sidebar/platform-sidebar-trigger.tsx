'use client';
// imports
import * as React from 'react';
import { SidebarCloseIcon, SidebarIcon } from 'lucide-react';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

/** A custom sidebar trigger for the platform with additional controls */
export const CustomSidebarTrigger: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children'> & {
    side?: 'left' | 'right';
    hideLabel?: boolean;
  }
> = ({
  ref,
  className,
  onClick,
  hideLabel = false,
  side = 'left',
  size = 'default',
  variant = 'ghost',
  ...props
}) => {
  const { open, openMobile, toggleSidebar, state } = useSidebar();

  const isExpanded = open || openMobile || state === 'expanded';
  const buttonSize = isExpanded ? size : 'icon';

  return (
    <Button
      {...props}
      autoFocus={false}
      ref={ref}
      className={cn(
        'items-center justify-center min-w-8',
        'hover:background-blur hover:text-accent-foreground/75',
        isExpanded && 'justify-start w-full',
        className
      )}
      onClick={(event) => {
        // prevent the sidebar from toggling the page scroll
        event.preventDefault();
        // toggle the sidebar
        toggleSidebar();
        // call the original onClick function, if it exists
        onClick?.(event);
      }}
      size={buttonSize}
      variant={variant}
    >
      {isExpanded ? (
        <SidebarCloseIcon
          className={cn('h-4 w-4', side === 'right' && 'rotate-180')}
        />
      ) : (
        <SidebarIcon
          className={cn('h-4 w-4', side === 'right' && 'rotate-180')}
        />
      )}
      {
        <span
          className={cn(isExpanded && !hideLabel ? 'not-sr-only' : 'sr-only')}
        >
          {isExpanded ? 'Close' : 'Open'} Sidebar
        </span>
      }
    </Button>
  );
};
CustomSidebarTrigger.displayName = 'CustomSidebarTrigger';
