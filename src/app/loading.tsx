// loading.tsx
import { Spinner } from '@/components/common/loaders';

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center justify-items-center w-full min-h-svh z-40">
      <Spinner showLabel />
    </div>
  );
};
Page.displayName = 'LoadingPage';

