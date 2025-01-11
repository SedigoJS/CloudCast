import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/music-player']

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is already logged in and tries to access login or register page, redirect to dashboard
  if ((pathname === '/' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/dashboard', '/music-player'],
}