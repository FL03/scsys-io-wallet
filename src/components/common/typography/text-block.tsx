// text-block.tsx
import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
// project
import { cn } from '@/lib/utils';

export const typographyVariants = cva('inline-flex items-center gap-2', {
  defaultVariants: {
    bold: 'default',
    casing: 'default',
    flavor: 'default',
    decoration: 'default',
    position: 'default',
    size: 'default',
    variant: 'default',
  },
  variants: {
    bold: {
      default: 'font-normal',
      bold: 'font-bold',
      bolder: 'font-extrabold',
      semibold: 'font-semibold',
    },
    casing: {
      default: 'normal-case',
      capitalize: 'capitalize',
      lowercase: 'lowercase',
      uppercase: 'uppercase',
    },
    flavor: {
      default: 'text-foreground',
      inherit: 'inherit',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      success: 'text-green-400',
      warning: 'text-amber-400',
    },
    position: {
      default: 'text-center',
      left: 'text-left',
      right: 'text-right',
    },
    size: {
      default: 'text-normal',
      sm: 'text-sm',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
    },
    decoration: {
      default: 'no-underline',
      overline: 'overline',
      strikethrough: 'line-through',
      underline: 'underline',
    },
    variant: {
      default: '',
      title: 'font-bold text-2xl tracking-tight',
      subtitle: 'font-semibold text-xl tracking-tight',
      body: 'font-normal text-base',
      caption: 'font-normal text-sm',
      description: 'font-normal text-sm text-muted-foreground',
      link: 'font-semibold text-sm underline-offset-4 hover:underline hover:text-foreground/85',
    },
  },
});

export const TextBlock: React.FC<
  React.ComponentPropsWithRef<'div'> &
    VariantProps<typeof typographyVariants> & { asChild?: boolean }
> = ({
  ref,
  className,
  asChild,
  bold = 'bold',
  casing = 'default',
  flavor = 'default',
  position = 'default',
  size = 'default',
  decoration: textEffect = 'default',
  variant = 'default',
  ...props
}) => {
  // fallback to a slot component if asChild
  const Comp = asChild ? Slot : 'div';
  // render the component
  return (
    <Comp
      {...props}
      ref={ref}
      className={cn(
        typographyVariants({
          bold,
          casing,
          flavor,
          position,
          size,
          decoration: textEffect,
          variant,
        }),
        className
      )}
    />
  );
};
