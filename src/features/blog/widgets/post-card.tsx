/**
 * Created At: 2025.05.03:23:56:15
 * @author - @FL03
 * @file - post-card.tsx
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
import { Separator } from '@/components/ui/separator';

type WidgetProps = {
  asChild?: boolean;
  description?: React.ReactNode;
  title?: React.ReactNode;
  updatedAt?: string;
  creator?: string;
};

export const PostCard: React.FC<
  React.PropsWithChildren<Omit<React.ComponentPropsWithRef<'div'>, 'title'>> &
    WidgetProps
> = ({
  ref,
  className,
  children,
  creator,
  description,
  title,
  updatedAt,
  asChild,
  ...props
}) => {
  // determine if the card header should be shown
  const showHeader = !!(title || description);
  // fallback to a Slot component if asChild is true
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp {...props} ref={ref} className={className}>
      <Card className="flex flex-col flex-1 w-full gap-2">
        {
          <CardHeader
            className={cn(
              'flex flex-nowrap items-start gap-2',
              !showHeader && 'hidden'
            )}
          >
            <div className="flex flex-col mr-auto">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
        }
        <CardContent className="flex flex-col flex-1 w-full h-full gap-2">
          {children}
        </CardContent>
        <CardFooter className="flex flex-nowrap items-center justify-start w-full px-2 py-1 text-sm text-muted-foreground">
          <div className="inline-flex flex-col gap-2 mr-auto">
            {creator && <span>Author: {creator}</span>}
          </div>
          <div className="inline-flex flex-col flex-1 gap-2 mx-auto">
            <Separator className="w-full" decorative />
          </div>
          <div className="inline-flex flex-col gap-2 ml-auto">
            {updatedAt && <span>Last updated: {updatedAt}</span>}
          </div>
        </CardFooter>
      </Card>
    </Comp>
  );
};
PostCard.displayName = 'PostCard';

export default PostCard;
