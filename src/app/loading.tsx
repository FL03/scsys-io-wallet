/**
 * Created At: 2025.05.12:23:20:32
 * @author - @FL03
 * @file - loading.tsx
 */
import { Spinner } from '@/components/common/loaders';

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center h-full w-full z-auto">
      <Spinner showLabel className="z-50"/>
    </div>
  );
};
Page.displayName = 'LoadingPage';

