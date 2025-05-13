import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
//  project
import { cn } from '@/lib/utils';

type ContentHeader = {
  asChild?: boolean;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

export const ContentHeader: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & ContentHeader
> = ({ ref, children, className, description, title, asChild, ...props }) => {
  // if asChild, fallback to the Slot component from Radix UI
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-nowrap gap-4 items-center justify-between w-full',
        className
      )}
    >
      <div className="inline-flex flex-col flex-1 mr-auto">
        {title && (
          <div className="font-semibold text-xl tracking-tight">{title}</div>
        )}
        {description && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="inline-flex gap-2 lg:gap-4 items-center justify-end ml-auto">
        {children}
      </div>
    </Comp>
  );
};
ContentHeader.displayName = 'ContentHeader';

export default ContentHeader;
