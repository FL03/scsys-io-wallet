/**
 * Created At: 2025-04-04:18:05:28
 * @author - @FL03
 * @description - the root auth route handler
 * @file - route.ts
 */
'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
// project
import { getDefaultSignInView } from '@/lib/supabase';

export async function GET() {
  const cookieStore = await cookies();
  const preferredSignInView = cookieStore.get('preferredSignInView')?.value;
  const defaultView = getDefaultSignInView(preferredSignInView || null);
  // redirect to the default view
  redirect(`/auth/${defaultView}`);
};

export async function POST(req: NextRequest) {
  const origin = new URL(req.url);
  const view = origin.searchParams.get('view') || 'login';

  if (['signup', 'sign-up'].includes(view) || view.toLowerCase().startsWith('regist')) {
    return redirect(`/auth/register`);
  }
  redirect(`/auth/${view}`);
}