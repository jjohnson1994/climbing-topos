'use server';

import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/app/actions';

export async function middleware(request: NextRequest) {
  const user = await auth();

  if (!user) {
    return;
  }

  const isAccountSetupComplete = !!user?.properties?.picture;
  const isPendingUser = user?.properties.status === 'pending';

  const isDirectingToSignupConfirmPage =
    request.nextUrl.pathname === '/signup-confirm';
  const isDirectingToSetupPage = request.nextUrl.pathname === '/first-login';

  if (isDirectingToSignupConfirmPage) {
    return;
  }

  if (isPendingUser) {
    return NextResponse.redirect(new URL('/signup-confirm', request.url));
  }

  if (!isAccountSetupComplete && !isDirectingToSetupPage) {
    return NextResponse.redirect(new URL('/first-login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
