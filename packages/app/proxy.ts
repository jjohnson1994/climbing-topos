import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/app/actions';

export async function proxy(request: NextRequest) {
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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
