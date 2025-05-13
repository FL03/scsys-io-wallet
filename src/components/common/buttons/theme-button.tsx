/*
  Appellation: theme-button <common>
  Contrib: FL03 <jo3mccain@icloud.com>
*/
'use client';

import * as React from 'react';
// imports
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
// project
import { cn } from '@/lib/utils';
// components
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ThemeButton: React.FC<
  React.ComponentProps<typeof Button> & {
    lightIcon?: React.ReactNode;
    darkIcon?: React.ReactNode;
    showLabel?: boolean;
  }
> = ({
  ref,
  className,
  size = 'icon',
  variant = 'ghost',
  darkIcon = <MoonIcon />,
  lightIcon = <SunIcon />,
  showLabel,
  ...props
}) => {
  // use the theme context hook to get the theme and setTheme function
  const { setTheme, resolvedTheme } = useTheme();
  // declare a state variable to track if the component is mounted
  const [mounted, setMounted] = React.useState(false);
  // returns true if the current theme is dark
  const isDark = () => resolvedTheme === 'dark';
  // resolves the icon based on the current theme
  const icon = (mode?: string) => {
    if (!mode || mode !== 'dark') return lightIcon;
    return darkIcon;
  };
  // this callback is dedicated to handling the click event on the button
  const handleOnClick = (event: React.BaseSyntheticEvent) => {
    // prevent the default action
    event.preventDefault();
    // prevent the event from bubbling up to the parent element
    event.stopPropagation();
    // toggle the theme between light and dark
    setTheme(isDark() ? 'light' : 'dark');
  };
  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, [mounted, setMounted]);
  // return null if the component is not mounted or the theme has not resolved yet
  if (!mounted || !resolvedTheme) return null;
  // render the component
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            {...props}
            ref={ref}
            className={cn('relative w-full', className)}
            onClick={handleOnClick}
            size={showLabel ? size : 'icon'}
            variant={variant}
          >
            {icon(resolvedTheme)}
            <span className={showLabel ? 'not-sr-only' : 'sr-only'}>Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Toggle the theme mode ({resolvedTheme})</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
ThemeButton.displayName = 'ThemeButton';

export default ThemeButton;
