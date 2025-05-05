/**
 * 2025-04-01
 * @author: @FL03
 * @description: a refresh button component that can be used to refresh the page or a specific component.
 * @file: refresh-button.tsx
 */
'use client';
// imports
import * as React from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
// project
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ButtonProps = {
  description?: React.ReactNode;
  disabled?: boolean;
  isRefreshing?: boolean;
  showLabel?: boolean;
  onRefresh?: () => void;
  onRefreshChange?: (refreshing: boolean) => void;
};

export const RefreshButton: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Button>, 'children'> & ButtonProps
> = ({
  ref,
  description = 'Refresh the content',
  size = 'default',
  variant = 'ghost',
  disabled,
  isRefreshing,
  showLabel,
  onClick,
  onRefresh,
  onRefreshChange,
  ...props
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const router = useRouter();

  // handle the refresh change event
  const handleOnRefreshChange = (refreshing: boolean) => {
    if (onRefreshChange) onRefreshChange(refreshing);
    setIsAnimating(refreshing);
  };
  // handle the refresh action
  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    // prevent the default action
    event.preventDefault();
    // prevent the event from bubbling up
    event.stopPropagation();
    if (!isAnimating) handleOnRefreshChange(true);
    // log the event
    logger.trace('Refreshing...');
    try {
      // call the onClick handler if it exists
      if (onClick) onClick(event);
      // call the onRefresh handler if it exists
      else if (onRefresh) onRefresh();
      else router.refresh();
    } finally {
      // set the refreshing state to true
      handleOnRefreshChange(false);
    }
  };
  // handle the refresh change event
  React.useEffect(() => {
    if (isRefreshing !== undefined && isRefreshing !== isAnimating) {
      handleOnRefreshChange(isRefreshing);
    }
  }, [isRefreshing, isAnimating, setIsAnimating]);

  // render the component
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            ref={ref}
            disabled={disabled || isRefreshing}
            onClick={handleOnClick}
            size={showLabel ? size : 'icon'}
            variant={variant}
          >
            <RefreshCwIcon
              className={cn('h-4 w-4', isAnimating && 'animate-spin')}
            />
            <span
              className={cn(
                showLabel ? 'not-sr-only' : 'sr-only',
                isAnimating && 'animate-pulse'
              )}
            >
              {isAnimating ? 'Refreshing' : 'Refresh'}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
RefreshButton.displayName = 'RefreshButton';

export default RefreshButton;
