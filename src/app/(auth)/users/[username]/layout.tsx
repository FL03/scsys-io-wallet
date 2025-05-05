// imports
import { PropsWithChildren } from 'react';
// components
import { ProfileProvider } from '@/features/profiles';

export default async function Layout({
  children,
  params,
}: Readonly<PropsWithChildren> & { params: Promise<{ username: string }> }) {
  // const { username } = useParams<{ username: string }>();
  const { username } = await params;

  return (
    <ProfileProvider username={username} className="h-full w-full flex-1">
      {children}
    </ProfileProvider>
  );
}
Layout.displayName = 'UserProfileLayout';
