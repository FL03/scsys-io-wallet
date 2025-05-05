/**
 * Created At: 2025-04-12:17:41:53
 * @author - @FL03
 * @file - section.tsx
 */
'use client';
// imports
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VariantProps, cva } from 'class-variance-authority';
// project
import { cn } from '@/lib/utils';
// components
import { Skeleton } from '@/components/ui/skeleton';

const sectionVariants = cva('w-full', {
  defaultVariants: {
    flavor: 'default',
    variant: 'default',
  },
  variants: {
    flavor: {
      default: 'bg-background text-foreground border-transparent',
      accent: 'bg-accent text-accent-foreground border-accent',
      primary: 'bg-primary text-primary-foreground border-primary',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
      card: 'bg-card text-card-foreground border-card',
      ghost: 'bg-transparent text-foreground border-transparent',
    },
    variant: {
      default: '',
      outline: 'border rounded-xl shadow-inner drop-shadow-sm',
    },
  },
});

type SectionProps = VariantProps<typeof sectionVariants> & {
  asChild?: boolean;
};

export const Section = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SectionProps
>(
  (
    { asChild, className, flavor = 'default', variant = 'default', ...props },
    ref
  ) => {
    // use a slot on asChild in-place of div
    const Comp = asChild ? Slot : 'div';
    // render the component
    return (
      <Comp
        ref={ref}
        className={cn(
          sectionVariants({ flavor, variant }),
          'relative flex flex-col flex-1 w-full px-4 py-2 gap-2',
          className
        )}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';

export const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn('flex flex-col gap-4 w-full', className)}
      {...props}
    />
  );
});
SectionContent.displayName = 'SectionContent';

/** The section header component  */
export const SectionHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
    inline?: boolean; // display the header inline (row)
  }
>(({ className, asChild, inline, ...props }, ref) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'flex top-0 w-full gap-2',
        inline && 'flex-row flex-nowrap items-start',
        !inline && 'flex-col',
        className
      )}
      {...props}
    />
  );
});
SectionHeader.displayName = 'SectionHeader';

export const SectionFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'bottom-0 w-full flex flex-row flex-nowrap gap-2 items-center',
        className
      )}
      {...props}
    />
  );
});
SectionFooter.displayName = 'SectionFooter';

export const SectionTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  // use a slot on asChild in-place of div
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp ref={ref} className={cn('font-semibold tracking-tight text-lg', className)} {...props} />
  );
});
SectionTitle.displayName = 'SectionTitle';

export const SectionDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  // use a slot on asChild in-place of span
  const Comp = asChild ? Slot : 'span';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn('text-muted-foreground', className)}
      {...props}
    />
  );
});
SectionDescription.displayName = 'SectionDescription';

export const SectionSkeleton: React.FC<
  React.PropsWithChildren<React.ComponentPropsWithRef<typeof Section>>
> = ({ ref, children, className, ...props }) => {
  // render the component
  return (
    <Section
      {...props}
      ref={ref}
      className={cn('relative flex flex-1 flex-col w-full', className)}
    >
      <SectionHeader className="flex flex-col gap-2">
        <SectionTitle>
          <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
        </SectionTitle>
        <Skeleton className="h-3 bg-gray-200 rounded w-1/3" />
      </SectionHeader>
      <SectionContent>{children}</SectionContent>
      <SectionFooter>
        <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
        <Skeleton className="h-3 bg-gray-200 rounded w-1/3" />
      </SectionFooter>
    </Section>
  );
};
SectionSkeleton.displayName = 'SectionSkeleton';
