/*
  Appellation: terms <page>
  Contrib: @FL03
*/
'use client';
// imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ui/card';

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-center justify-items-center min-h-svh">
      <Card className="m-auto container mx-auto">
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
      </Card>
    </div>
  );
};
Page.displayName = 'TermsPage';
