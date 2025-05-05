// label.tsx
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// feature-specific
import { LoaderVariants, loaderVariants } from './load';

type WidgetProps = {
  asChild?: boolean;
} & LoaderVariants;

export const AnimatedLabel: React.FC<
  React.ComponentPropsWithRef<'span'> & WidgetProps
> = ({
  ref,
  className,
  asChild = false,
  anim = 'pulse',
  flavor = 'default',
  size = 'default',
  variant = 'default',
  ...props
}) => {
  // if asChild is true, use Slot component from Radix UI
  const Comp = asChild ? Slot : 'span';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(loaderVariants({ anim, flavor, size, variant }), className)}
    />
  );
};

export default AnimatedLabel;
