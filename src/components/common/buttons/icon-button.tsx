/**
 * 2025-04-02
 * @author: @FL03
 * @description: retrofits the shadcn button with a tooltip and optional label
 * @file: icon-button.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// feature-specific
import { TooltipButton } from './tooltip-button';

type IconButtonProps = {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  showLabel?: boolean;
};

export const IconButton: React.FC<
  React.ComponentProps<typeof TooltipButton> & IconButtonProps
> = ({
  children,
  description = 'trigger a closing action',
  label = 'Close',
  size = 'icon',
  variant = 'ghost',
  onClick,
  showLabel = false,
  ...props
}) => {
  // return the button with a tooltip
  return (
    <TooltipButton
      description={description}
      onClick={onClick}
      size={showLabel ? size : 'icon'}
      variant={variant}
      {...props}
    >
      {children}
      <span className={cn(showLabel ? 'not-sr-only' : 'sr-only')}>{label}</span>
    </TooltipButton>
  );
};
IconButton.displayName = 'IconButton';

export default IconButton;
