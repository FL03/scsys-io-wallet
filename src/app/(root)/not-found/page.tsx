/*
  Appellation: not-found <page>
  Contrib: @FL03
*/
'use client';
// imports
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Page() {
  return (
    <div className="flex flex-col flex-1 w-full">
      <Card className="m-auto flex-flex col">
        <CardHeader className="flex flex-nowrap items-start gap-2 w-full">
          <div className="flex flex-col w-full gap-2 mr-auto">
            <CardTitle className="text-xl font-semibold tracing-tight">Not Found</CardTitle>
            <CardDescription className="text-muted-foreground">Could not find requested resource</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 w-full">
          <Link href="/">Return Home</Link>
        </CardContent>
      </Card>
    </div>
  );
}
Page.displayName = 'NotFound';
