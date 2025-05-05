/*
  Appellation: profile_details <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// feature-specific
import { useProfile } from '../provider';
import { ProfileAvatar } from './profile-avatar';
import { ProfileSettingsButton } from './profile-settings-button';

type WidgetProps = {
  asChild?: boolean;
};
/** This component renders a view of the user's profile providing a detailed summary of their activities and contributions.*/
export const ProfileDetails: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'children'> & WidgetProps
> = ({ ref, className, ...props }) => {
  // providers
  const { username, profile, isOwner } = useProfile();

  if (!profile) return null;

  // get the component type
  const Comp = props.asChild ? Slot : 'div';
  // get the component type
  return (
    <Comp
      ref={ref}
      className={cn('w-full flex flex-1 flex-col', className)}
      {...props}
    >
      <CardHeader className="border-b">
        <div className="w-full inline-flex flex-row flex-nowrap items-center gap-2  ">
          <ProfileAvatar profile={profile} />
          <div className="flex flex-col flex-shrink gap-2 mr-auto w-full">
            <CardTitle className="text-lg">@{username}</CardTitle>
            {profile?.bio && <CardDescription>{profile?.bio}</CardDescription>}
          </div>
          {isOwner && (
            <ProfileSettingsButton
              href={{
                pathname: `/${username}/settings`,
                query: { defaultTab: 'profile' },
              }}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="relative font-sans h-full w-full pt-2">
        <div className="flex flex-col flex-1 gap-2">
          <div className="inline-flex flex-row flex-nowrap gap-2">
            <span className="font-semibold">Name</span>
            <span>{profile?.display_name}</span>
          </div>
          {profile?.email && profile?.email.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Emails</span>
              <ul className="inline-flex flex-wrap gap-2">
                {profile?.email.map((e, index) => <li key={index}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Comp>
  );
};
ProfileDetails.displayName = 'ProfileDetails';

export default ProfileDetails;
