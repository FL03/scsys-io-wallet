// layout.tsx
import { PropsWithChildren } from 'react';
// components
import { PlatformScaffold } from '@/components/platform';
import { AuthProvider } from '@/features/auth';
/**
 * The base layout for authenticated routes
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 * @param {Readonly<PropsWithChildren>} props - the props for the template; note that children
 * are readonly and required.
 */
export default function Layout({ children }: Readonly<PropsWithChildren>) {
  return (
    <AuthProvider>
      <PlatformScaffold>{children}</PlatformScaffold>
    </AuthProvider>
  );
}
Layout.displayName = 'AuthLayout';
