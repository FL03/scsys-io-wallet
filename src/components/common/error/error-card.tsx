// error-card.tsx
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { cn } from '@/lib/utils';

type ErrorCardProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: string;
  asChild?: boolean;
};

export const ErrorCard: React.FC<
  React.PropsWithChildren<
    Omit<React.ComponentPropsWithRef<typeof Card>, 'title'>
  > &
    ErrorCardProps
> = ({
  ref,
  className,
  children,
  description = 'An unexpected error occurred; please try again later.',
  title = 'Error',
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : Card;
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn('flex flex-col flex-1 w-full', className)}
    >
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Comp>
  );
};
