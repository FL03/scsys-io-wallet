/**
 * Created At: 2025-04-04:22:11:40
 * @author - @FL03
 * @file - middleware.ts
 */
'use server';
// imports
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
// feature-specific
import { supabaseCreds } from './consts';

const authenticationEndpoint = '/auth';

/**
 * The middleware for integrate the application with supabase;
 * @param {NextRequest} request - the initial request object for the current request.
 * @returns {Promise<NextResponse>} - the response object for the current request.
 */
export async function handleUserSession(
  request: NextRequest
): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const { url, anonKey } = supabaseCreds();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const user = await supabase.auth.getUser().then(({ data }) => data.user);

  if (!user && !request.nextUrl.pathname.startsWith(authenticationEndpoint)) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = authenticationEndpoint;
    return NextResponse.redirect(url);
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
