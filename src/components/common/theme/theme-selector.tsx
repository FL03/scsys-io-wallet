/*
  Appellation: theme_selector <module>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// ThemeSelector
export const ThemeSelector = React.forwardRef<
  HTMLSelectElement,
  React.HTMLAttributes<HTMLSelectElement>
>(({ children, className, ...props }, ref) => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <select
      ref={ref}
      className={cn(
        'rounded-lg shadow-inner text-foreground bg-accent',
        className
      )}
      onChange={(e) => setTheme(e.target.value)}
      value={theme}
      {...props}
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
      {children}
    </select>
  );
});
ThemeSelector.displayName = 'ThemeSelector';

// ThemeSelectorOption
export const ThemeSelectorOption = React.forwardRef<
  HTMLOptionElement,
  React.HTMLAttributes<HTMLOptionElement>
>(({ ...props }, ref) => <option ref={ref} {...props} />);
ThemeSelectorOption.displayName = 'ThemeSelectorOption';

export default ThemeSelector;
