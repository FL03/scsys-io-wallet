/**
 * Created At: 2025-04-09:23:14:47
 * @author - @FL03
 * @file - links.tsx
 */
import { LinkAttributes } from '@/types/links';
import * as Lucide from 'lucide-react';

export type DynamicLink = (
  endpoint: string,
  params?: Record<string, string>,
  searchParams?: Record<string, string> | URLSearchParams | string[][]
) => string;

export type EndpointProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  showIcon?: boolean;
};

export type Href =
  | string
  | import('@/types').Url
  | DynamicLink
  | (() => string);

export type EndpointBuilder<P> = (
  endpoint: string,
  params?: P
) => EndpointProps;

export const platformLinks = (username: string) => {
  return {
    profile: (u?: string | null) => ({
      basePath: {
        href: {
          pathname: `/${username}`,
          query: { username, view: 'dashboard' },
        },
        icon: <Lucide.HomeIcon className="h-4 w-4" />,
        label: 'Dashboard',
        description: 'Go to your dashboard',
        showIcon: false,
      },
      links: [
        {
          href: {
            pathname: `/${username}/notifications`,
            query: { username, view: 'dashboard' },
          },
          icon: <Lucide.BellIcon className="h-4 w-4" />,
          label: 'Notifications',
          description: 'Stay updated with notifications',
          showIcon: false,
        },
      ],
    }),
    blog: () => ({
      basePath: {
        href: {
          pathname: '/blog',
          query: { username, view: 'dashboard' },
        },
        icon: <Lucide.PenBoxIcon className="h-4 w-4" />,
        label: 'Blog',
        description: 'Navigate to Blog',
        showIcon: false,
      },
      links: [],
    }),
    fitness: () => ({
      basePath: {
        href: {
          pathname: '/fitness',
          query: { username, view: 'dashboard' },
        },
        icon: <Lucide.DumbbellIcon className="h-4 w-4" />,
        label: 'Fitness',
        description: 'Navigate to Fitness',
        showIcon: false,
      },
      links: [],
    }),
  };
};

type LinkTreeStaticLink =
  | LinkAttributes
  | (() => Record<string, LinkAttributes>);

type LinkTreeDynamicLink<
  TParams extends { [key: string]: any } = Record<string, string>,
> = (
  params: TParams,
  searchParams?: URLSearchParams
) => Record<string, LinkAttributes>;

type LinkTreeValue =
  | (() => Record<string, LinkAttributes>)
  | LinkTreeDynamicLink<{ [key: string]: any }>;

type LinkTree = Record<string, LinkTreeValue>;

export const linktree: LinkTree = {
  root: () => ({
    home: {
      href: '/',
      label: 'Home',
    },
    blog: {
      href: '/blog',
      label: 'Blog',
    },
    error: {
      href: '/error',
      label: 'Error',
    },
    'not-found': {
      href: '/not-found',
      label: 'Not Found',
    },
    privacy: {
      href: '/privacy',
      label: 'Privacy Policy',
    },
    terms: {
      href: '/terms',
      label: 'Terms of Service',
    },
  }),
  auth: (params?: { username: string }) => ({
    profile: {
      href: `/${params?.username}`,
      label: 'Profile',
    },
    admin: {
      href: `/${params?.username}/admin`,
      label: 'Dashboard',
    },
    notifications: {
      href: `/${params?.username}/notifications`,
      label: 'Notifications',
    },
    settings: {
      href: `/${params?.username}/settings`,
      label: 'Settings',
    },
    users: {
      href: `/users/${params?.username}`,
      label: 'Users',
    },
  }),
};
