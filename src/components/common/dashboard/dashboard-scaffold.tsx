// dashboard.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
// hooks
// import { useIsMobile } from '@/hooks/use-mobile';
// project
import { cn } from '@/lib/utils';

/**
 * A collection of classNames that are passed to their corresponding components within the `DashboardScaffold` component.
 * @param {string} contentClassName - pass a className to the content wrapper
 * @param {string} panelClassName - pass a className to the panel wrapper
 */
export type DashboardClassNames = {
  contentClassName?: string;
  panelClassName?: string;
};

/**
 * @param {DashboardClassNames} classes - the props for the `DashboardScaffold` component
 * @param {React.ReactNode} panel - the smaller, optional _panel_ used to display additional content
 */
type DashboardContentProps = {
  classes?: DashboardClassNames;
  panel?: React.ReactNode;
  asChild?: boolean;
};
/** This component defines the scaffolding used to manage the dynamics of the various dashboard views. */
export const DashboardScaffold: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> &
    React.PropsWithChildren &
    DashboardContentProps
> = ({ ref, className, children, panel, asChild, classes = {}, ...props }) => {
  // destructure the classNames object
  const { contentClassName, panelClassName } = classes;
  // fallback onto a Slot component if asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'relative flex flex-1 flex-wrap overflow-hidden h-full w-full',
        'gap-4 lg:gap-6 mt-2 lg:mt-4 z-0',
        className
      )}
    >
      {/* Secondary */}
      {panel && (
        <DashboardPanel
          asChild={asChild}
          className={cn(
            'flex flex-col w-full h-full gap-4 lg:gap-6',
            panelClassName
          )}
        >
          {panel}
        </DashboardPanel>
      )}
      {/* Primary View */}
      <DashboardDisplay
        withSecondary={!!panel}
        className={cn(
          'flex flex-col flex-1 w-full h-full gap-4 lg:gap-6',
          contentClassName
        )}
      />
    </Comp>
  );
};

/** This component streamlines the implementation of various views, ensuring the widget expands to fill the bounds of its parent element. */
export const DashboardContent: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-1 w-full gap-4 lg:gap-6',
        'overflow-auto rounded-2xl border-none ring-none',
        className
      )}
    />
  );
};
DashboardContent.displayName = 'DashboardContent';

/** The primary display for the dashboard */
export const DashboardDisplay: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & {
    asChild?: boolean;
    withSecondary?: boolean;
    side?: 'left' | 'right';
  }
> = ({ ref, className, asChild, withSecondary, side = 'right', ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-1 h-full w-full overflow-auto gap-4 lg:gap-6',
        side && `${side}-0`,
        withSecondary && 'lg:max-w-2/3',
        className
      )}
    />
  );
};
DashboardDisplay.displayName = 'DashboardDisplay';

/** The `DashboardPanel` describes the optional, dynamic secondary display often used when constructing dashboards. */
export const DashboardPanel: React.FC<
  Omit<React.ComponentPropsWithRef<'div'>, 'title'> & { asChild?: boolean }
> = ({ ref, className, asChild, ...props }) => {
  // render as a Slot component as a fallback whenever asChild is true
  const Comp = asChild ? Slot : 'div';
  // render the Sidebar component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        'flex flex-col flex-shrink-0 px-4 py-2',
        'gap-4 lg:gap-6 h-fit lg:h-full w-full lg:max-w-1/3',
        className
      )}
    />
  );
};
DashboardPanel.displayName = 'DashboardPanel';
