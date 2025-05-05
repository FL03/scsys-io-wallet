/**
 * Created At: 2025.04.17:08:17:01
 * @author - @FL03
 * @file - route.ts
 */
import { NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  // original origin before load balancer or proxy
  const forwardedHost = request.headers.get('x-forwarded-host');
  // get the auth code from the URL
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    logger.error('No auth code provided in the URL.');
    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/error?kind=auth-code-error`);
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    logger.error({ error }, 'Error exchanging auth code for session');
    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/error?kind=auth-code-error`);
  }

  if (forwardedHost) {
    logger.trace({ next }, 'Forwarded host detected:', forwardedHost);
    // handle the case where the request is behind a load balancer or proxy
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    // handle the case where the request is not behind a load balancer or proxy
    return NextResponse.redirect(`${origin}${next}`);
  }
}
