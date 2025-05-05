// nav-button.tsx
import * as React from 'react';
import Link from 'next/link';
// project
import { Url } from '@/types';
// components
import { Button } from '@/components/ui/button';

type ButtonProps = {
  href?: Url;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  hideLabel?: boolean;
};

/** 
 * This component extends the `shadcn` button component by using the `Link` component provided by next as a means of creating standardized _navigation_ buttons. 
 * 
*/
export const NavButton: React.FC<
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'asChild' | 'children' | 'label' | 'onClick' | 'title'> & ButtonProps
> = ({
  icon,
  label,
  href,
  size = 'sm',
  variant = 'link',
  disabled,
  hideLabel,
  ...props
}) => {
  // render the component
  return (
    <Button {...props} asChild disabled={disabled || !href} size={size} variant={variant}>
      <Link href={href ?? '#'} className="inline-flex gap-2 items-center flex-nowrap">
        {icon}
        <span className={hideLabel ? 'sr-only' : 'not-sr-only'}>{label}</span>
      </Link>
    </Button>
  );
};
NavButton.displayName = 'NavButton';

export default NavButton;
