/*
  Appellation: page <notifications>
  Contrib: @FL03
*/
import { ResolvingMetadata } from 'next';
// project
import {
  NotificationCenter,
  NotificationProvider,
} from '@/features/notifications';

type PageParams = { username: string };

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { username } = await params;
  return (
    <NotificationProvider username={username}>
      <NotificationCenter />
    </NotificationProvider>
  );
}
Page.displayName = 'NotificationsPage';

export const generateMetadata = async (
  { params }: { params: Promise<PageParams> },
  parent: ResolvingMetadata
) => {
  const { username } = await params;
  const previousMetadata = await parent;
  return {
    ...previousMetadata,
    description: `Notifications for ${username}`,
    title: 'Notifications',
  };
};
