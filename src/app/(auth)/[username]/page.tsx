'use server';
// imports
import { ResolvingMetadata } from 'next';
// project
import { logger } from '@/lib/logger';
// components
import { ProfileScreen } from '@/features';

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { view } = await searchParams;

  // logger
  logger.trace(`Viewing profile dashboard for ${username}`);
  return <ProfileScreen username={username} view={view} />;
}
Page.displayName = 'ProfileDetailsPage';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
) {
  const { username } = await params;
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  return {
    openGraph: {
      ...parentMetadata.openGraph,
      images: [...previousImages],
    },
    description: `The user-profile for ${username}`,
    title: `Profile (@${username})`,
  };
}
