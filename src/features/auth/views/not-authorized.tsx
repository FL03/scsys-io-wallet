// not-authorized.tsx
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

type ViewProps = {
  footer?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  asChild?: boolean;
};

export const NotAuthorizedView: React.FC<
  React.PropsWithChildren<Omit<React.ComponentPropsWithRef<'div'>, 'title'>> &
    ViewProps
> = ({
  ref,
  className,
  children,
  footer,
  description = 'User is not authorized to view the content',
  title = 'Not Authorized',
  asChild,
  ...props
}) => {
  const showHeader = () => title || description;

  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp {...props} ref={ref} className={cn('flex flex-col flex-1 w-full', className)}>
      <Card className="m-auto">
        {showHeader() && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </Comp>
  );
};
