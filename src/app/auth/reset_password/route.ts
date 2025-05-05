/*
  Appellation: route <reset_password>
  Contrib: @FL03
*/
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import {
  getErrorRedirect,
  getStatusRedirect,
} from '@/lib/supabase/helpers/database';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/forgot_password`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/auth/callback`,
      'You are now signed in.',
      'Please enter a new password for your account.'
    )
  );
}
