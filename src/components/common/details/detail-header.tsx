/**
 * Created At: 2025-04-16:09:48:06
 * @author - @FL03
 * @description - Detail Header Component
 * @file - detail-header.tsx
 */
'use client';
// imports
import { InfoIcon } from 'lucide-react';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// hooks
import { useIsMobile } from '@/hooks/use-mobile';
// components
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type DetailProps = {
  description?: React.ReactNode;
  title?: React.ReactNode;
  breakpoint?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  hideDescription?: boolean;
  showLabel?: boolean;
};

export const DetailHeader: React.FC<
  React.PropsWithChildren<DetailProps> &
    Omit<React.ComponentPropsWithRef<'div'>, 'children' | 'title'>
> = ({
  ref,
  breakpoint = 'md',
  children,
  className,
  description,
  title,
  asChild = false,
  hideDescription = false,
  showLabel = false,
  ...props
}) => {
  // check if the screen size is mobile using the custom hook
  const isMobile = useIsMobile();
  // if asChild is true, use Slot component from Radix UI
  const Comp = asChild ? Slot : 'div';
  // determine if description should be shown based on the screen size and hideDescription prop
  const showDescription = !hideDescription && !isMobile;
  return (
    <Comp
      className={cn('flex flex-nowrap gap-4 items-center w-full', className)}
      {...props}
    >
      <div className="w-full inline-flex flex-col flex-1 mr-auto">
        {title && <span className="font-semibold text-nowrap">{title}</span>}
        {description && (
          <span
            className={cn(
              'text-sm text-muted-foreground',
              showDescription ? 'not-sr-only' : 'sr-only'
            )}
          >
            {description}
          </span>
        )}
      </div>
      {/* Informative Popover */}
      <div
        className={cn(
          'ml-auto items-center justify-end inline-flex',
          !showDescription && `${breakpoint}:hidden`
        )}
      >
        {!showDescription && (
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <InfoIcon />
                <span className={showLabel ? 'not-sr-only' : 'sr-only'}>
                  {title}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              {description && <span className="text-sm">{description}</span>}
            </PopoverContent>
          </Popover>
        )}
        {/* actions */}
        {children}
      </div>
    </Comp>
  );
};
DetailHeader.displayName = 'DetailHeader';
