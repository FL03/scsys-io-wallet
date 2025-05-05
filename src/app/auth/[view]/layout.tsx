// AuthLayout
'use client';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return (
    <main className="relative flex flex-1 flex-col min-h-svh w-full">
        {children}
    </main>
  );
};
Layout.displayName = 'AuthLayout';