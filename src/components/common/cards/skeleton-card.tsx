/**
 * Created At: 2025-04-07:01:30:26
 * @author - @FL03
 * @description - Skeleton Card Component
 * @file - skeleton-card.tsx
 */
'use client';
// imports
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
// project
import { cn } from "@/lib/utils";
// components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonCard: React.FC<
  React.ComponentProps<typeof Card> & { asChild?: boolean }
> = ({ className, asChild = false, ...props }) => {
  const Comp = asChild ? Slot : Card;
  // render
  return (
    <Comp className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="p-0">
        <CardTitle>
          <Skeleton className="h-48 rounded-none" />
        </CardTitle>
        <CardDescription className="mt-2">
          <Skeleton className="h-6 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </CardFooter>
    </Comp>
  );
};