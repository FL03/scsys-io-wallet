/**
 * Created At: 2025.05.05:09:59:14
 * @author - @FL03
 * @file - platform-navbar.tsx
 */
'use client';
// imports
import * as React from 'react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// hooks
import { useAuth } from '@/hooks/use-supabase';
// components
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
} from '@/ui/navigation-menu';
import { linktree } from '@/lib';

const NavLink: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Link>, 'title'> &
    React.PropsWithChildren<{
      label?: React.ReactNode;
      asTrigger?: boolean;
    }>
> = ({ ref, children, label, asTrigger, ...props }) => {
  return (
    <Link {...props} legacyBehavior passHref ref={ref}>
      <NavigationMenuLink
        className={cn('', asTrigger && navigationMenuTriggerStyle())}
      >
        <div className="text-sm font-medium leading-none">{label}</div>
        <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </span>
      </NavigationMenuLink>
    </Link>
  );
};
NavLink.displayName = 'NavLink';

const ListItem: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Link>, 'title'> &
    React.PropsWithChildren<{
      id?: string | number;
      key?: React.Key;
      label?: React.ReactNode;
    }>
> = ({ ref, id, key, ...props }) => {
  return (
    <li id={id} key={key}>
      <NavLink ref={ref} {...props} />
    </li>
  );
};
ListItem.displayName = 'ListItem';

export const PlatformNavbar: React.FC<
  Omit<React.ComponentPropsWithRef<typeof NavigationMenu>, 'children'>
> = ({ ref, className, ...props }) => {
  // render the component
  return (
    <NavigationMenu
      {...props}
      ref={ref}
      className={cn(
        'inline-flex flex-nowrap items-center justify-start gap-2 lg:gap-4',
        className
      )}
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavLink href="/" label="Home" />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink href="/blog" label="Blog" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
PlatformNavbar.displayName = 'PlatformNavbar';

export default PlatformNavbar;
