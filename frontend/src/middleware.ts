import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value
  const { pathname } = request.nextUrl

  // If accessing protected routes and not authenticated, redirect to login
  if (pathname.startsWith('/dashboard') && !userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/checkout') && !userId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated, allow access
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*', '/'],
}