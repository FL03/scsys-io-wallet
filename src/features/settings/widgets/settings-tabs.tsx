/*
  Appellation: settings-tabs <settings>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
// project
import { AuthProviderButtons } from '@/features/auth';
import {
  useProfile,
  AvatarPicker,
  ProfileData,
  ProfileForm,
} from '@/features/profiles';
import { cn } from '@/lib/utils';
// components
import { Spinner } from '@/components/common/loaders';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// feature-specific
import { SettingsForm } from './settings-form';

type SettingsTabsProps = {
  defaultTab?: string;
};

const ProfileSettingsTab: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & {
    isLoading?: boolean;
    profile?: ProfileData | null;
  }
> = ({ ref, className, profile, isLoading, ...props }) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner showLabel />
      </div>
    );
  }
  return (
    <div
      {...props}
      ref={ref}
      className="relative h-full flex flex-1 flex-col items-center gap-4 w-full"
    >
      <AvatarPicker showPreview defaultFileUrl={profile?.avatar_url} />
      <AuthProviderButtons mode="link" className="flex w-full items-center" />
      <ProfileForm values={profile} />
    </div>
  );
};

export const SettingsTabs: React.FC<
  React.ComponentPropsWithRef<typeof Tabs> & SettingsTabsProps
> = ({ className, ref, defaultTab = 'profile', ...props }) => {
  const [tab, setTab] = React.useState(defaultTab);

  const { profile, state } = useProfile();

  return (
    <Tabs
      ref={ref}
      className={cn(
        'h-full',
        'relative flex flex-1 flex-col lg:flex-row gap-2 lg:gap-4',
        className
      )}
      orientation="horizontal"
      onValueChange={setTab}
      value={tab}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-2 lg:gap-4">
        <TabsList className="h-full w-full items-start flex-1">
          <div className="flex flex-1 flex-row gap-2 items-center">
            <TabsTrigger
              asChild
              value="system"
              className="hover:underline focus:underline data-[state=active]:bg-primary/10  data-[state=active]:hover:bg-primary/20"
            >
              <Button
                className="w-full"
                variant="link"
                onClick={() => setTab('system')}
              >
                <span>System</span>
              </Button>
            </TabsTrigger>
            <TabsTrigger
              asChild
              className=" hover:underline focus:underline data-[state=active]:bg-primary/10  data-[state=active]:hover:bg-primary/20"
              value="profile"
            >
              <Button className="w-full" variant="link">
                <span>Profile</span>
              </Button>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="system" className="h-full w-full ">
          <div className="h-full flex flex-1 flex-col items-center">
            <SettingsForm />
          </div>
        </TabsContent>
        <TabsContent value="profile" className="h-full w-full">
          <ProfileSettingsTab isLoading={state.isLoading} profile={profile} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
SettingsTabs.displayName = 'SettingsTabs';
