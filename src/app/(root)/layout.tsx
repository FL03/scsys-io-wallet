// layout.tsx
import { PlatformScaffold } from '@/components/platform/platform-scaffold';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return <PlatformScaffold>{children}</PlatformScaffold>;
}
Layout.displayName = 'AppLayout';
