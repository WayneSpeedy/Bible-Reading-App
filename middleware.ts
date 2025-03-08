import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define which paths require authentication
const protectedPaths = ["/", "/profile", "/achievements", "/welcome", "/onboarding"]

// Define which paths are for non-authenticated users
const authPaths = ["/auth/login", "/auth/signup", "/auth/forgot-password"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("session_id")

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  const isAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // If the path requires authentication and there's no session cookie, redirect to login
  if (isProtectedPath && !sessionCookie) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // If the path is for non-authenticated users and there's a session cookie, redirect to home
  if (isAuthPath && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

