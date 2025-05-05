// toolbar.tsx
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toolbarVariants = cva(
  'w-full flex flex-row flex-nowrap gap-2 lg:gap-4 items-center mt-4 px-4 py-2 transform inset-1',
  {
    variants: {
      variant: {
        default: 'sticky top-0',
        top: 'sticky top-0 mt-4',
        topCenter: 'sticky top-0 container mx-auto mt-4',
        bottom: 'sticky bottom-0',
        bottomCenter: 'sticky bottom-0 container mx-auto rounded-full -translate-y-1/4 max-w-[90%]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type ToolbarContext = {
  centerTitle: boolean;

} & Partial<VariantProps<typeof toolbarVariants>>;

const ToolbarContext = React.createContext<ToolbarContext>({
  centerTitle: false,
});

export const useToolbar = () => {
  const ctx = React.useContext(ToolbarContext);
  if (!ctx) {
    throw new Error('useToolbar must be used within a ToolbarProvider');
  }
  return ctx;
};

export const ToolbarProvider: React.FC<
  React.PropsWithChildren<Partial<ToolbarContext>>
> = ({ centerTitle = false,  variant, children }) => {
  const ctx = React.useMemo(() => ({ centerTitle, variant, }), [centerTitle, variant,]);
  return (
    <ToolbarContext.Provider value={ctx}>{children}</ToolbarContext.Provider>
  );
};
// Toolbar
export const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toolbarVariants> & { centerTitle?: boolean }
>(
  (
    {
      centerTitle = false,
      className,
      variant,
      ...props
    },
    ref
  ) => {


    return (
      <ToolbarProvider centerTitle={centerTitle} variant={variant}>
        <div
          ref={ref}
          className={cn(
            toolbarVariants({ variant }),
            'focus:outline-none',
            'mx-auto',
            className
          )}
          {...props}
        />
      </ToolbarProvider>
    );
  }
);
Toolbar.displayName = 'Toolbar';

export const ToolbarWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof toolbarVariants> & { centerTitle?: boolean }
>(
  (
    {
      className,
      variant,
      ...props
    },
    ref
  ) => {

    return (
        <div
          ref={ref}
          className={cn(
            toolbarVariants({ variant }),
            'mx-auto',
            className
          )}
          {...props}
        />
    );
  }
);
ToolbarWrapper.displayName = 'ToolbarWrapper';

// Toolbar Action
export const ToolbarAction = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn('text-center hover:italic transition-colors', className)}
      {...props}
    />
  );
});
ToolbarAction.displayName = 'ToolbarAction';

// Toolbar Action
export const ToolbarActionGroup = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn('inline-flex flex-row flex-nowrap', className)}
      {...props}
    />
  );
});
ToolbarActionGroup.displayName = 'ToolbarActionGroup';

// Toolbar Content
export const ToolbarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex flex-row flex-nowrap flex-1 items-center justify-start w-full',
        className
      )}
      {...props}
    />
  );
});
ToolbarContent.displayName = 'ToolbarContent';

export const ToolbarLeading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex flex-row flex-nowrap gap-2 items-center justify-items-center mr-auto',
      className
    )}
    {...props}
  />
));
ToolbarLeading.displayName = 'ToolbarLeading';

export const ToolbarTrailing = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex flex-row flex-nowrap gap-2 items-center justify-items-center ml-auto',
      className
    )}
    {...props}
  />
));
ToolbarTrailing.displayName = 'ToolbarTrailing';

export const ToolbarTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const { centerTitle } = useToolbar();
  return (
    <h1
      ref={ref}
      className={cn(
        'text-lg font-semibold',
        centerTitle && 'absolute left-1/2 transform -translate-x-1/2',
        className
      )}
      {...props}
    />
  );
});
ToolbarTitle.displayName = 'ToolbarTitle';

type ToolbarInputProps = {
  key?: string;
  placeholder?: string;
};

// ToolbarInput
export const ToolbarInput = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement> & ToolbarInputProps
>(({ className, key, placeholder, ...props }, ref) => {
  return (
    <input
      key={key}
      ref={ref}
      className={cn(
        'bg-primary-foreground text-primary rounded-md transition-colors',
        'h-fit max-w-xs my-auto px-2 py-1',
        'hover:bg-blend-color hover:border-accent focus:border-accent',
        className
      )}
      placeholder={placeholder ?? 'Search...'}
      {...props}
    />
  );
});
ToolbarInput.displayName = 'ToolbarInput';
