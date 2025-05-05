/*
  Appellation: list_tile <module>
  Contrib: @FL03
*/
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const listVariants = cva('w-full px-4 py-2', {
  defaultVariants: {
    flavor: 'default',
    variant: 'default',
  },
  variants: {
    flavor: {
      default: 'bg-background text-foreground',
      accent: 'bg-accent text-accent-foreground',
      card: 'bg-card text-card-foreground',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
    },
    variant: {
      default: 'flex flex-col',
      horizontal: 'flex flex-row flex-nowrap items-center',
    },
  },
});

const listTileVariants = cva('px-1 py-2 w-full', {
  defaultVariants: {
    border: 'default',
    variant: 'default',
  },
  variants: {
    border: {
      default: 'border-none',
      inBetween: 'border-b last:border-0',
    },
    variant: {
      default: 'inline-flex flex-nowrap items-center gap-2',
      
    },
  },
});

export const OList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement> &
    VariantProps<typeof listVariants> & { asChild?: boolean }
>(
  (
    {
      className,
      asChild = false,
      flavor = 'default',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'ol';
    // render the component
    return (
      <Comp
        ref={ref}
        className={cn(listVariants({ flavor, variant }), className)}
        {...props}
      />
    );
  }
);
OList.displayName = 'OList';

export const UList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> &
    VariantProps<typeof listVariants> & { asChild?: boolean }
>(
  (
    {
      className,
      asChild = false,
      flavor = 'default',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'ul';
    // render the component
    return (
      <Comp
        ref={ref}
        className={cn(listVariants({ flavor, variant }), className)}
        {...props}
      />
    );
  }
);
UList.displayName = 'UList';

type ListTileProps = {
  asChild?: boolean;
  expanded?: boolean;
} & VariantProps<typeof listTileVariants>;

// ListTile
export const ListTile = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & ListTileProps
>(
  (
    {
      asChild,
      className,
      expanded = false,
      border = 'inBetween',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    // render as Slot if asChild is true
    const Comp = asChild ? Slot : 'li';
    // return the component
    return (
      <Comp
        ref={ref}
        className={cn(
          listTileVariants({ border, variant }),
          'inline-flex flex-nowrap items-center gap-2 w-full px-1 py-2',
          'duration-200 ease-in-out transition-colors ',
          'hover:backdrop-opacity-75 hover:cursor-pointer',
          'last:rounded-b-lg first:rounded-t-lg',
          expanded && '',
          className
        )}
        {...props}
      />
    );
  }
);
ListTile.displayName = 'ListTile';

// TileContent
export const TileContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn('w-full flex flex-1 flex-col gap-2 lg:gap-4', className)}
      {...props}
    />
  );
});
TileContent.displayName = 'TileContent';

// Tile Leading
export const TileLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, ...props }, ref) => {
  const Comp = props.asChild ? Slot : 'div';
  // return the component
  return (
    <Comp
      ref={ref}
      className={cn('mr-auto items-center w-full max-w-[75px]', className)}
      {...props}
    />
  );
});
TileLeading.displayName = 'TileLeading';

// Tile Trailing
export const TileTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  // render
  return (
    <Comp
      ref={ref}
      className={cn(
        'inline-flex items-center justify-end max-w-[75px] ml-auto',
        className
      )}
      {...props}
    />
  );
});
TileTrailing.displayName = 'TileTrailing';

// Tile Header
export const TileHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean; inline?: boolean }
>(({ className, asChild = false, inline = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-full flex mb-2 gap-2',
        inline && 'flex-row flex-nowrap items-center',
        !inline && 'flex-col',
        className
      )}
      {...props}
    />
  );
});
TileHeader.displayName = 'TileHeader';

// TileFooter
export const TileFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      ref={ref}
      className={cn(
        'w-full inline-flex flex-row flex-nowrap gap-2 lg:gap-4',
        className
      )}
      {...props}
    />
  );
});
TileFooter.displayName = 'TileFooter';

// TileTitle
export const TileTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h3';
  // render the component
  return (
    <Comp ref={ref} className={cn('font-semibold', className)} {...props} />
  );
});
TileTitle.displayName = 'TileTitle';

// TileDescription
export const TileDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
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
TileDescription.displayName = 'TileDescription';

export default ListTile;
