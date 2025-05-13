// imports
import { PropsWithChildren } from 'react';
// import { useParams } from 'next/navigation';
// components
import { ProfileProvider } from '@/features/profiles';

export default async function Layout({ children, params }: Readonly<PropsWithChildren> & { params: Promise<{ username: string }> }) {
  // const { username } = useParams<{ username: string }>();
  const { username } = await params;

  return (
    <ProfileProvider username={username}>
      {children}
    </ProfileProvider>
  );
}
Layout.displayName = 'UserProfileLayout';
