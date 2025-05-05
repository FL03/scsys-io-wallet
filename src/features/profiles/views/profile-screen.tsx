// profile-screen.tsx
'use client';
// imports
import * as React from 'react';
import dynamic from 'next/dynamic';
// components
import { Spinner } from '@/components/common/loaders';
// feature-specific
import { ProfileProvider } from '../provider';

type ScreenProps = {
  username?: string;
  view?: string;
  asChild?: boolean;
};
export const ProfileScreen: React.FC<ScreenProps> = ({
  username,
  view = 'dashboard',
}) => {
  // dynamically import the dashboard view
  const Dashboard = dynamic(
    async () => await import('../widgets/profile-dashboard'),
    {
      ssr: false,
      loading: () => <Spinner showLabel className="m-auto" />,
    }
  );
  // dynamically import the details view
  const Details = dynamic(
    async () => await import('../widgets/profile-details'),
    {
      ssr: false,
      loading: () => <Spinner showLabel className="m-auto" />,
    }
  );
  // a functional render method that resolves the view to be displayed
  // based on the view prop passed to the component
  const renderView = () => {
    switch (view) {
      case 'details':
        return <Details />;
      default:
        return <Dashboard />;
    }
  };
  // render the component
  return (
    // wrap the view with the corresponding provider to provide the necessary context
    <ProfileProvider username={username}>{renderView()}</ProfileProvider>
  );
};
ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
