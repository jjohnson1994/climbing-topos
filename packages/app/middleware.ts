import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/app/actions';
import { subjects } from '@/app/auth';
import * as v from 'valibot';

const isAccountSetupComplete = (
  properties: v.InferOutput<typeof subjects.user>,
) => {
  return properties.picture;
};

export async function middleware(request: NextRequest) {
  const isDirectingToSetupPage = request.nextUrl.pathname === '/first-login';

  if (isDirectingToSetupPage) {
    return;
  }

  const subject = await auth();

  if (!subject) {
    return;
  }

  if (!isAccountSetupComplete(subject.properties)) {
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
