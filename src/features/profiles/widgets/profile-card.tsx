/*
  Appellation: profile-card <profile>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// feature-specific
import { ProfileAvatar } from './profile-avatar';
import { Profile } from '../types';

const statusToColor = (status: string): string => {
  if (['available', 'active', 'online'].includes(status)) {
    return 'bg-green-500';
  }
  if (['away', 'idle'].includes(status)) {
    return 'bg-yellow-500';
  }
  if (['busy', 'dnd'].includes(status)) {
    return 'bg-red-500';
  }
  // default color
  return 'bg-gray-500';
};

/** The profile card component */
export const ProfileCard: React.FC<
  React.ComponentPropsWithRef<typeof Card> & {
    showContent?: boolean;
    profile?: Profile | null;
  }
> = ({ ref, children, className, profile, showContent, ...props }) => {
  //  if there is no profile, return null
  if (!profile) return null;

  // destructure the profile object
  const { status, username } = profile;
  return (
    <Card ref={ref} className={cn('w-full', className)} {...props}>
      <CardHeader className="flex flex-row items-center gap-2">
        <ProfileAvatar profile={profile} />
        <div className="inline-block text-nowrap overflow-x-hidden gap-2">
          <CardTitle className="text-sm text-start">@{username}</CardTitle>
        </div>
        {status && (
          <Badge
            variant="outline"
            className="inline-flex flex-row flex-nowrap items-center gap-1 ml-auto"
          >
            <div
              className={cn(
                'rounded-full h-[10px] w-[10px] object-cover',
                statusToColor(status)
              )}
            />
            <span className="text-muted-foreground">{status}</span>
          </Badge>
        )}
      </CardHeader>
      {showContent && (
        <CardContent className="flex flex-col gap-2">{children}</CardContent>
      )}
    </Card>
  );
};
ProfileCard.displayName = 'ProfileCard';

export default ProfileCard;
