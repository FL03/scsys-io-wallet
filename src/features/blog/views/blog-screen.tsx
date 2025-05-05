/**
 * Created At: 2025.05.03:23:56:23
 * @author - @FL03
 * @file - blog-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { compareAsc } from 'date-fns';
import { toast } from 'sonner';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// hooks
import { usePosts } from '@/hooks/use-posts';
// components
import { RefreshButton } from '@/components/common/buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DashboardContent,
  DashboardScaffold,
} from '@/components/common/dashboard';
// feature-specific
import { BlogPostData } from '../types';

type ViewProps = {
  asChild?: boolean;
  description?: React.ReactNode;
  title?: React.ReactNode;
  feed?: React.ReactNode;
  featured?: BlogPostData[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

const BlogDashboardPanel: React.FC<
  React.ComponentPropsWithRef<typeof DashboardContent> & {
    items?: BlogPostData[];
  }
> = ({ ref, className, children, items = [], ...props }) => {
  return (
    <DashboardContent {...props} ref={ref} className={cn('', className)}>
      <Card className="flex flex-col flex-1 w-full">
        <CardContent>
          <CardHeader>
            <CardTitle className="text-xl">Blog</CardTitle>
            <CardDescription>Welcome to the blog!</CardDescription>
          </CardHeader>
        </CardContent>
      </Card>
      {/* Info Container */}
      <Card className="flex flex-col flex-1 w-full">
        <CardHeader className="flex flex-row flex-nowrap items-center gap-2 justify-between">
          <div className="mr-auto flex flex-wrap gap-2 items-center justify-items-start">
            <CardTitle className="inline-flex gap-2">Featured</CardTitle>
            <CardDescription className="text-sm inline-flex flex-nowrap gap-2">
              View the latest featured posts from your network.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col px-2 py-1 w-full list-none">
            {items.map((item, index) => (
              <li
                key={index}
                className="inline-flex flex-nowrap flex-1 items-center w-full gap-2 lg:gap-4 transition-colors hover:bg-blend-darken"
              >
                <div className="flex flex-col flex-1 mr-auto">
                  <span className="font-lg font-semibold tracking-tight">
                    {item?.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item?.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {children}
    </DashboardContent>
  );
};

export const BlogScreen: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> & ViewProps
> = ({
  ref,
  className,
  description,
  featured = [],
  feed,
  title,
  asChild,
  isRefreshing: isRefreshingProp = false,
  onRefresh,
  ...props
}) => {
  // hooks
  const posts = usePosts();
  // declare a refreshing state
  const [isRefreshing, setIsRefreshing] = React.useState(isRefreshingProp);

  // handle the refresh action
  const handleOnRefresh = React.useCallback(async () => {
    // ensure the refreshing state is toggled
    if (!isRefreshing) setIsRefreshing(true);
    // trace the event
    logger.trace('Refreshing posts...');
    // try refreshing the content
    try {
      // use the callback if it was provided
      if (onRefresh) onRefresh();
      // otherwise, fetch the posts using the hook
      else await posts.fetch();
    } finally {
      // finally change the refreshing state to false
      setIsRefreshing(false);
    }
  }, [posts, isRefreshing, setIsRefreshing, onRefresh]);
  // refreshing-related effects
  React.useEffect(() => {
    // respond to any changes to the refreshing state
    if (isRefreshing) handleOnRefresh();

    return () => {
      // cleanup function to reset the refreshing state
      setIsRefreshing(false);
    };
  }, [isRefreshing, posts, setIsRefreshing]);
  // ensure the component is in sync with the prop value
  React.useEffect(() => {
    if (isRefreshingProp !== isRefreshing) {
      setIsRefreshing(isRefreshingProp);
    }
  }, [isRefreshingProp, isRefreshing, setIsRefreshing]);

  const filterFeatured = React.useCallback(() => {
    const nPosts = posts.data.length;
    return posts.data
      .filter((post) => post?.is_featured)
      .sort((a, b) => {
        return compareAsc(a.updated_at, b.updated_at);
      })
      .slice(0, nPosts > 3 ? 3 : undefined);
  }, [posts.data]);

  // fallback to a Slot component when asChild
  const Comp = asChild ? Slot : 'div';
  // render the screen
  return (
    <Comp {...props} ref={ref} className={className}>
      <div
        {...props}
        ref={ref}
        className={cn('relative h-full w-full', className)}
      >
        {/* dashboard header */}
        <section className="flex flex-row flex-nowrap items-center gap-2 justify-between">
          <div className="inline-flex flex-col flex-1 mr-auto">
            {title && (
              <span className="font-semibold text-lg tracking-tight">
                {title}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground text-sm">
                {description}
              </span>
            )}
          </div>
          <div className="inline-flex flex-row flex-nowrap ml-auto items-center gap-4">
            <RefreshButton
              onRefresh={async () => {
                toast.promise(handleOnRefresh(), {
                  loading: 'Refreshing...',
                  success: 'Refreshed successfully!',
                  error: (err) => {
                    logger.error('Error refreshing posts', err);
                    return 'Error refreshing posts';
                  },
                });
              }}
              isRefreshing={isRefreshing}
            />
          </div>
        </section>
        <DashboardScaffold
          panel={<BlogDashboardPanel items={filterFeatured()} />}
        >
          <DashboardContent
            className={cn(
              'flex flex-col flex-1 w-full min-h-full overflow-hidden'
            )}
          >
            <Card className="flex flex-col flex-1 w-full">
              <CardHeader className="flex flex-row flex-nowrap items-center gap-2 justify-between">
                <div className="mr-auto flex flex-wrap gap-2 items-center justify-items-start">
                  <CardTitle className="inline-flex gap-2">Feed</CardTitle>
                  <CardDescription className="text-sm inline-flex flex-nowrap gap-2">
                    View the latest posts from your network.
                  </CardDescription>
                </div>
                <CardDescription className="text-sm inline-flex flex-nowrap gap-2">
                  {posts.data.length} posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col w-full list-none">
                  {posts.data.map((item, index) => (
                    <li
                      key={index}
                      className="inline-flex flex-nowrap flex-1 items-center w-full gap-2 lg:gap-4"
                    >
                      {item?.title}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </DashboardContent>
        </DashboardScaffold>
      </div>
    </Comp>
  );
};
BlogScreen.displayName = 'BlogScreen';

export default BlogScreen;
