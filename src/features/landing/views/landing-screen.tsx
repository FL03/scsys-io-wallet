'use client';
// imports
import * as React from 'react';
// components
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const LandingScreen = () => {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Card className="flex flex-col flex-1 gap-2 my-auto">
        <CardHeader className="flex flex-nowrap items-start gap-2 justify-start">
          <div className="flex flex-col gap-2 mr-auto">
            <CardTitle className="font-semibold text-xl tracking-tight">
              Scattered-Systems, LLC
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              A private company empowering the next generation of internet-based
              experiences
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
LandingScreen.displayName = 'LandingScreen';

export default LandingScreen;
