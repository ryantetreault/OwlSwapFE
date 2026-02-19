import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/listings'];
const authRoutes = ['/signin', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('owl_swap_auth_token')?.value;

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/listings', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/listings/:path*', '/signin', '/signup'],
};
