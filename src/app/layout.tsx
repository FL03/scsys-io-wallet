/**
 * Created At: 2025.05.12:23:20:21
 * @author - @FL03
 * @file - layout.tsx
 */
// imports
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';
// stylesheet
import '@/public/styles/globals.css'; // './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

/**
 * The root layout for the application;
 *
 * @param {Readonly<PropsWithChildren>} children - The children to render.
 *
 */
export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const cookieStore = await cookies();

  const defaultTheme = cookieStore.get('theme')?.value ?? 'system';
  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-full z-0`}
      >
        <ThemeProvider
          disableTransitionOnChange
          enableColorScheme
          enableSystem
          attribute="class"
          defaultTheme={defaultTheme}
          storageKey="theme"
          themes={['light', 'dark']}
        >
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  applicationName: 'Wallet',
  authors: [
    {
      name: 'Joe McCain III',
      url: 'https://github.com/FL03',
    },
    {
      name: 'Scattered-Systems, LLC',
      url: 'https://scsys.io',
    },
  ],
  category: 'Technology',
  classification: 'platform',
  creator: 'FL03',
  description: 'A secure digital wallet for managing digital assets, currencies, and identities.',
  icons: [
    {
      url: '/logo.svg',
      sizes: '16x16',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '32x32',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '48x48',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '64x64',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '128x128',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '256x256',
      type: 'image/x-svg',
    },
    {
      url: '/logo.svg',
      sizes: '512x512',
      type: 'image/x-svg',
    },
  ],
  keywords: ['technology', 'network', 'platform', 'virtualization'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  ),
  publisher: 'Scattered-Systems, LLC',
  title: { absolute: 'Reaction', template: 'scsys (%s)' },
  twitter: {
    card: 'summary',
    creator: '@jo3mccain',
    site: '@wallet.scsys.io',
    title: 'Scattered-Systems - Wallet',
  },
  openGraph: {
    description:
      'Empowering the next generation of internet-based experiences.',

    siteName: 'Wallet',
    locale: 'en_US',
    title: 'Scattered-Systems - Wallet',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Scattered-Systems, LLC',
      },
    ],
  },
};
