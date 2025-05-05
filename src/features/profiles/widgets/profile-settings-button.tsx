/**
 * Created At: 2025.04.22:13:56:25
 * @author - @FL03
 * @file - profile-settings-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Settings2Icon } from 'lucide-react';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// components
import { TooltipButton } from '@/components/common/buttons';

export const ProfileSettingsButton: React.FC<
  React.ComponentProps<typeof Link> & {
    showLabel?: boolean;
    size?: React.ComponentProps<typeof TooltipButton>['size'];
    variant?: React.ComponentProps<typeof TooltipButton>['variant'];
  }
> = ({
  className,
  href,
  about = 'Profile Settings',
  showLabel = false,
  size = 'icon',
  variant = 'ghost',
  ...props
}) => {
  return (
    <TooltipButton
      asChild
      className={cn('my-auto', className)}
      description={about}
      size={size}
      variant={variant}
    >
      <Link
        className="inline-flex flex-nowrap gap-2 items-center"
        href={href}
        about={about}
        {...props}
      >
        <Settings2Icon className="h-4 w-4" />
        <span className={showLabel ? 'not-sr-only' : 'sr-only'}>
          Edit Profile
        </span>
      </Link>
    </TooltipButton>
  );
};
ProfileSettingsButton.displayName = 'ProfileSettingsButton';

export default ProfileSettingsButton;
