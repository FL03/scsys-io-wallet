/**
 * Created At: 2025-04-02:21:02:55
 * @author - @FL03
 * @description - the page for the auth gate (/auth/[view])
 * @file - page.tsx
 */
'use server';
// imports
import { ResolvingMetadata } from 'next';
// project
import { AuthGate } from '@/features/auth';

type PageParams = { view: string };

export default async function Page(props: { params: Promise<PageParams> }) {
  // extract the view from the params
  const { view } = await props.params;
  // render the auth gate with the view
  return <AuthGate centered view={view} />;
}
Page.displayName = 'AuthPage';

export const generateMetadata = async (
  props: { params: Promise<PageParams> },
  parent: ResolvingMetadata
) => {
  const { view } = await props.params;
  const { openGraph } = await parent;
  const previousImages = openGraph?.images || [];

  const description = 'The authentication page for the application';

  const title = ['forgot-password', 'reset-password'].includes(view)
    ? 'Forgot Password'
    : ['register', 'registration'].includes(view)
      ? 'Register'
      : 'Login';

  return {
    openGraph: {
      ...openGraph,
      images: [...previousImages],
    },
    description,
    title,
  };
};
