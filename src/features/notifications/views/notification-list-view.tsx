/*
  Appellation: notification-center <module>
  Contrib: @FL03
*/
'use client';
//imports
import * as React from 'react';
import { useRouter } from 'next/navigation';
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
// feature-specific
import { useNotificationsContext } from '../provider';
import { NotificationList } from '../widgets';

export const NotificationListView: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
    description?: React.ReactNode;
    title?: React.ReactNode;
    username?: string | null;
  }
> = ({
  ref,
  className,
  description = 'Manage all your notifications in one place',
  title = 'Notifications',
  ...props
}) => {
  // router
  const router = useRouter();
  
  // use the provider to access the users notifications
  const { notifications } = useNotificationsContext();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div
      {...props}
      ref={ref}
      className={cn('w-full flex flex-1 flex-col gap-2 lg:gap-4', className)}
    >
      <CardHeader className="flex flex-row flex-nowrap items-center">
        <div className="inline-flex flex-col mr-auto">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="inline-flex flex-row flex-nowrap items-center gap-2 ml-auto">
          <RefreshButton onRefresh={handleRefresh} />
        </div>
      </CardHeader>
      <CardContent>
        <Card>
          <NotificationList items={notifications} />
        </Card>
      </CardContent>
    </div>
  );
};
NotificationListView.displayName = 'NotificationListView';

export default NotificationListView;
