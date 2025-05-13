/*
  Appellation: sidebar <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as Lucide from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// project
import { AuthButton } from '@/features/auth';
import { ProfileAvatar, ProfileCard } from '@/features/profiles';
import { useUserProfile } from '@/hooks/use-profile';
import { LinkAttributes } from '@/types';
import { cn } from '@/lib/utils';
// components
import { DialogTitle } from '@/components/ui/dialog';
import {
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
// feature-specific
import { CustomSidebarTrigger } from './platform-sidebar-trigger';

export type PlatformSidebarProps = {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
};

type LinkProps = LinkAttributes & {
  description?: React.ReactNode;
  disabled?: boolean;
  name?: React.ReactNode;
};
const SidebarLink: React.FC<
  React.ComponentProps<typeof SidebarMenuItem> & LinkProps
> = ({ className, description, disabled, href, icon, name, ...props }) => {
  const { openMobile, toggleSidebar } = useSidebar();
  return (
    <SidebarMenuItem
      className={cn('inline-flex flex-row flex-1', className)}
      {...props}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild disabled={disabled || !href}>
              <Link
                href={href ?? '#'}
                onClick={() => {
                  // close the sidebar on mobile
                  if (openMobile) toggleSidebar();
                }}
              >
                {icon}
                <span className="text-foreground">{name}</span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent>
            {description ?? `Navigate to ${name}`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  );
};

const _renderLinks = (...links: LinkProps[]) => {
  return (
    <>
      {links.map((link, idx) => (
        <SidebarLink key={idx} {...link} />
      ))}
    </>
  );
};

const _SidebarNavGroup: React.FC<
  React.ComponentProps<typeof SidebarGroup> & {
    title?: React.ReactNode;
    links?: LinkProps[];
  }
> = ({ className, links = [], title = 'Profile', ...props }) => {
  return (
    <SidebarGroup className={cn('flex flex-col w-full', className)} {...props}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>{_renderLinks(...links)}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export const PlatformSidebar: React.FC<
  React.ComponentProps<typeof Sidebar>
> = ({
  children,
  className,
  collapsible = 'icon',
  side = 'left',
  variant = 'inset',
  ...props
}) => {
  // get the router
  const router = useRouter();
  // get the user profile
  const { profile, username } = useUserProfile();
  // setup the sidebar context
  const { open, openMobile, state, toggleSidebar } = useSidebar();
  // determine if the sidebar is open or not
  const isOpen = open || openMobile || state === 'expanded';
  // render the sidebar
  return (
    <Sidebar
      {...props}
      className={cn('h-full bg-secondary/90', className)}
      collapsible={collapsible}
      side={side}
      variant={variant}
    >
      <SidebarHeader className="bg-secondary/90">
        <Link
          href={{
            pathname: `/${username}`,
            query: {
              view: 'details',
            },
          }}
        >
          {isOpen ? (
            <ProfileCard profile={profile} />
          ) : (
            <ProfileAvatar profile={profile} />
          )}
        </Link>
        {openMobile && (
          <VisuallyHidden>
            <DialogTitle>Sidebar</DialogTitle>
          </VisuallyHidden>
        )}
      </SidebarHeader>
      {/* Sidebar Content */}
      <SidebarContent className="bg-secondary/90 overflow-x-clip flex flex-col flex-1 h-full w-full justify-end">
        {/* trailing menu */}
        {username && (
          <>
            <_SidebarNavGroup
              className="flex-1"
              title="Apps"
              links={[
                {
                  name: 'Blog',
                  icon: <Lucide.RssIcon />,
                  href: '/blog',
                },
                {
                  name: 'Editor',
                  icon: <Lucide.LucideEdit2 />,
                  href: {
                    pathname: `/${username}/content`,
                    query: { view: 'editor' },
                  },
                },
                {
                  name: 'Dashboard',
                  icon: <Lucide.LayoutDashboardIcon />,
                  href: {
                    pathname: `/${username}/admin`,
                    query: { view: 'dashboard' },
                  },
                },
              ]}
            />
            <_SidebarNavGroup
              className="flex-shrink-0 mt-auto"
              title="Platform"
              links={[
                {
                  name: 'Profile',
                  icon: <Lucide.User2Icon />,
                  href: {
                    pathname: `/users/${username}`,
                    query: { view: 'details' },
                  },
                },
                {
                  name: 'Notifications',
                  icon: <Lucide.BellIcon />,
                  href: {
                    pathname: `/${username}/notifications`,
                    query: { filter: 'all', sortBy: 'newest' },
                  },
                },
                {
                  name: 'Settings',
                  icon: <Lucide.SettingsIcon />,
                  href: {
                    pathname: `/${username}/settings`,
                    query: { defaultTab: 'profile' },
                  },
                },
              ]}
            />
          </>
        )}
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="bg-secondary/90">
        {/* Actions */}
        <SidebarMenuButton asChild>
          <CustomSidebarTrigger
            showLabel={collapsible === 'icon' ? !isOpen : true}
          />
        </SidebarMenuButton>
        <SidebarMenuButton asChild>
          <AuthButton
            inline={isOpen && collapsible === 'icon'}
            variant="outline"
            onSuccess={() => {
              // close the sidebar on mobile
              if (isOpen) toggleSidebar();
              // redirect to the login page
              router.push('/auth/login');
            }}
          />
        </SidebarMenuButton>
        {children}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
PlatformSidebar.displayName = 'PlatformSidebar';

export default PlatformSidebar;
