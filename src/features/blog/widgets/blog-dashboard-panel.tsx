/**
 * Created At: 2025.05.03:23:56:23
 * @author - @FL03
 * @file - blog-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
import { compareAsc } from 'date-fns';
// project
import { cn } from '@/lib/utils';
// components
import { RefreshButton } from '@/components/common/buttons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardContent } from '@/components/common/dashboard/dashboard-scaffold';
// feature-specific
import { BlogPostData } from '../types';
import { ActionGroup, ActionGroupItem } from '@/components/common/actions';

type WidgetProps = {
  items?: BlogPostData[];
  limitFeatured?: number;
};

export const BlogDashboardPanel: React.FC<
  React.ComponentPropsWithRef<typeof Card> & WidgetProps
> = ({ ref, className, children, items = [], limitFeatured = 3, ...props }) => {
  const featuredPosts = React.useMemo(() => {
    return items
      .filter((post) => post?.is_featured)
      .sort((a, b) => {
        return compareAsc(a.updated_at, b.updated_at);
      })
      .slice(0, limitFeatured > 3 ? 3 : undefined);
  }, [items, limitFeatured]);
  // render the dashboard panel
  return (
    <DashboardContent>
      {/* Panel Header */}
      <Card
        {...props}
        ref={ref}
        className={cn('flex flex-col flex-1 w-full', className)}
      >
        <CardContent className="flex flex-row flex-nowrap items-center gap-2 justify-between">
          <CardHeader className="flex-1 mr-auto">
            <CardTitle className="text-xl">Blog</CardTitle>
            <CardDescription>Welcome to the blog!</CardDescription>
          </CardHeader>
          <ActionGroup variant="inline" className="ml-auto flex-shrink-0">
            <ActionGroupItem>
              <RefreshButton />
            </ActionGroupItem>
          </ActionGroup>
        </CardContent>
      </Card>
      {/* Panel Display */}
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
            {featuredPosts.map((item, index) => (
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
BlogDashboardPanel.displayName = 'BlogDashboardPanel';

export default BlogDashboardPanel;
