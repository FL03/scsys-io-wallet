'use client';
// imports
import * as React from 'react';
// components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// feature-specific
import { Profile } from '../types';

export const ProfileAvatar: React.FC<
  React.ComponentProps<typeof Avatar> & { profile?: Profile | null }
> = ({ profile, ...props }) => {
  // if there is no profile, return null
  if (!profile) return null;
  // render the avatar
  return (
    <Avatar {...props}>
      <AvatarImage
        className="object-cover"
        src={profile.avatar_url ?? ''}
        alt={profile.username}
      />
      <AvatarFallback>{profile.username}</AvatarFallback>
    </Avatar>
  );
};
ProfileAvatar.displayName = 'ProfileAvatar';

export default ProfileAvatar;
