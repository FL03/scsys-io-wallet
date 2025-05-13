/**
 * Created At: 2025.05.03:23:56:23
 * @author - @FL03
 * @file - blog-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
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
import { BlogDashboardPanel } from '../widgets/blog-dashboard-panel';

type ViewProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  items?: BlogPostData[];
  asChild?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

/** The screen component rendered directly by the app router at: `/blog` */
export const BlogScreen: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'> & ViewProps
> = ({
  ref,
  className,
  description,
  title,
  asChild,
  isRefreshing = false,
  onRefresh,
  ...props
}) => {
  // initialize a reference to the posts hook
  const posts = usePosts();
  // declare a refreshing state
  const [refreshing, setRefreshing] = React.useState(isRefreshing);

  // handle the refresh action
  const handleOnRefresh = React.useCallback(async () => {
    // ensure the refreshing state is toggled
    if (!refreshing) setRefreshing(true);
    // trace the event
    logger.trace('Refreshing posts...');
    // try refreshing the content
    try {
      // use the callback if it was provided
      if (onRefresh) onRefresh();
      // otherwise, fetch the posts using the hook
      else await posts.getAll();
    } finally {
      // finally change the refreshing state to false
      setRefreshing(false);
    }
  }, [posts, refreshing, setRefreshing, onRefresh]);
  // refreshing-related effects
  React.useEffect(() => {
    // respond to any changes to the refreshing state
    if (refreshing) handleOnRefresh();

    return () => {
      // cleanup function to reset the refreshing state
      setRefreshing(false);
    };
  }, [refreshing, posts, setRefreshing]);
  // ensure the component is in sync with the prop value
  React.useEffect(() => {
    if (isRefreshing !== refreshing) {
      setRefreshing(isRefreshing);
    }
  }, [isRefreshing, refreshing, setRefreshing]);

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
              isRefreshing={refreshing}
            />
          </div>
        </section>
        <DashboardScaffold panel={<BlogDashboardPanel items={posts.data} />}>
          <DashboardContent>
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
