// middleware.ts
'use server';
// imports
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
// project
import { handleUserSession } from '@/lib/supabase/middleware';

/**
 * The middleware for the application; currently integrates each request with supabase related metadata and cookies.
 * @param {NextRequest} request - The request object for the current request.
 * @returns {Promise<NextResponse>} The response object for the current request.
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware for more information on middleware.
 */
export const middleware = async (
  request: NextRequest
): Promise<NextResponse> => {
  // extend the request
  const next = await handleUserSession(request);
  // return a modified request object
  return next;
};

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/admin/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
