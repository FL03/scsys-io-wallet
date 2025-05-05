/*
  Appellation: details_scaffold <module>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
// project
import { cn } from '@/lib/utils';
// components
import { BackButton } from '@/components/common/buttons';
import { DetailHeader } from './detail-header';

// DetailScaffold
export const DetailSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
      description?: React.ReactNode;
      title?: React.ReactNode;
    }
>(
  (
    { className, children,  description, title, ...props },
    ref
  ) => {
    const showHeader = title || description;
    return (
      <div
        ref={ref}
        className={cn('relative h-full w-full', className)}
        {...props}
      >
        <div className="inset-0 bg-background text-foreground h-1/12 w-full flex flex-row flex-nowrap items-center justify-start">
          <div className="inline-flex flex-row flex-nowrap items-center gap-2 max-w-sm mr-auto">
            <BackButton />
          </div>
        </div>
        <section className="h-full w-full flex flex-1 flex-col">
          {showHeader && (
            <DetailHeader title={title} description={description} />
          )}
          <div className="h-full w-full flex flex-1 flex-col gap-2">
            {children}
          </div>
        </section>
      </div>
    );
  }
);
DetailSkeleton.displayName = 'DetailSkeleton';

export default DetailSkeleton;
