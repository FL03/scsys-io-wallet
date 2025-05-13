/**
 * Created At: 2025.05.03:17:17:52
 * @author - @FL03
 * @file - admin-dashboard.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// components
import {
  DashboardContent,
  DashboardScaffold,
} from '@/components/common/dashboard';
import { PopoverHeader } from '@/components/common/headers';
import { Card, CardContent } from '@/components/ui/card';

type DashboardProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  secondaryClassName?: React.ReactNode;
  username?: string;
  asChild?: boolean;
};

const AdminDashboardPanel: React.FC<
  Omit<React.ComponentPropsWithRef<typeof DashboardContent>, 'children'>
> = ({ ref, ...props }) => {
  return (
    <DashboardContent {...props} ref={ref}>
      Feed
    </DashboardContent>
  );
};

export const AdminDashboardView: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & DashboardProps
> = ({
  ref,
  className,
  description = 'The root-level dashboard for managing your digital experience.',
  title = 'Admin Dashboard',
  secondaryClassName,
  username,
  ...props
}) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn('flex flex-col flex-1 gap-4 w-full', className)}
    >
      <PopoverHeader title={title} description={description} className="mb-4" />
      <Card>
        <CardContent>
          <DashboardScaffold panel={<AdminDashboardPanel />}>
            <span>Welcome {username} to the admin dashboard</span>
          </DashboardScaffold>
        </CardContent>
      </Card>
    </div>
  );
};
AdminDashboardView.displayName = 'AdminDashboardView';

export default AdminDashboardView;
