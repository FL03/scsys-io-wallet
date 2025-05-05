// admin/page.tsx
'use server';
import { ResolvingMetadata } from 'next';
// project
import { logger } from '@/lib/logger';
// components
import { AdminDashboardView } from '@/features/admin';

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { view } = await searchParams;

  // logger
  logger.trace(`Rendering the profile ${view} screen for ${username}`);
  return <AdminDashboardView username={username} />;
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
    alternates: {
      canonical: `/admin/${username}`,
    },
    description: 'The admin dashboard for the application',
    title: `Admin`,
  };
}
Page.displayName = 'AdminUserScreen';
