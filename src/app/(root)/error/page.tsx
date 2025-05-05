/**
 * Created At: 2025.05.02:23:10:22
 * @author - @FL03
 * @file - page.tsx
 */
'use client';
// hooks
import { useSearchParams } from 'next/navigation';
// components
import { ErrorCard } from '@/components/common/error';


export default function Page() {
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <ErrorCard
        message={searchParams.get('message') ?? 'Something went wrong...'}
      />
    </div>
  );
};
Page.displayName = 'ErrorPage';
