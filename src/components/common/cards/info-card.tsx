/**
 * Created At: 2025.05.04:18:23:49
 * @author - @FL03
 * @file - info-card.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type WidgetProps = {
  description?: React.ReactNode;
  footer?: React.ReactNode;
  title?: React.ReactNode;
  message?: string;
  asChild?: boolean;
};

export const InfoCard: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Card>, 'title'> &
    React.PropsWithChildren<WidgetProps>
> = ({
  ref,
  className,
  children,
  footer,
  description = 'An unexpected error occurred; please try again later.',
  title = 'Error',
  asChild,
  ...props
}) => {
  const withHeader = !!(title || description);
  // revert to a Slot if asChild is true
  const Comp = asChild ? Slot : Card;
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn('flex flex-col flex-1 w-full', className)}
    >
      {withHeader && (
        <CardHeader className="flex flex-nowrap items-start justify-between gap-2">
          <div className="inline-flex flex-col flex-1 mr-auto">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Comp>
  );
};
InfoCard.displayName = 'InfoCard';

export default InfoCard;
