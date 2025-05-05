// load.tsx
'use client';
// project
import { cva, VariantProps } from 'class-variance-authority';

export const loaderVariants = cva('m-auto inline-block', {
  defaultVariants: {
    anim: 'default',
    flavor: 'default',
    size: 'default',
    variant: 'default',
  },
  variants: {
    anim: {
      default: 'animate-spin',
      pulse: 'animate-pulse',
    },
    flavor: {
      default: 'text-foreground',
      accent: 'text-accent-foreground',
      destructive: 'text-destructive-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      success: 'text-green-400',
      warning: 'text-yellow-400',
    },
    size: {
      default: 'h-5 w-5 text-normal',
      sm: 'h-4 w-4 text-sm',
      lg: 'h-6 w-6  text-lg',
      xl: 'h-8 w-8  text-xl',
      '2xl': 'h-10 w-10 text-2xl',
      '3xl': 'h-12 w-12  text-3xl',
    },
    variant: {
      default: 'border-none',
    },
  },
});

export type LoaderVariants = VariantProps<typeof loaderVariants>;
