/**
 * 2025-04-02
 * @author: @FL03
 * @description: a button component equipped with a tooltip
 * @file: tooltip-button.tsx
 */
'use client';
// imprts
import * as React from 'react';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TooltipButtonProps = {
  description?: React.ReactNode;
};

export const TooltipButton: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<typeof Button>> &
    TooltipButtonProps
> = ({
  children,
  ref,
  description,
  size = 'icon',
  variant = 'ghost',
  onClick,
  ...props
}) => {
  // return the button with a tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={ref}
            onClick={onClick}
            size={size}
            variant={variant}
            {...props}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
TooltipButton.displayName = 'TooltipButton';

export default TooltipButton;
