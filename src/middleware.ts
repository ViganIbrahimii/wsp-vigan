import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing" // Adjust path as per your project

const publicPages = ["/login"]

// Handle localization with next-intl
const handleI18nRouting = createMiddleware(routing)

// Custom authentication middleware
async function authMiddleware(
  req: NextRequest
): Promise<NextResponse | undefined> {
  const token = req.cookies.get("authToken")?.value

  // Redirect to login page if unauthenticated and accessing protected routes
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", req.url))
  // }

  // Proceed with i18n routing for authenticated users
  return handleI18nRouting(req)
}

// Main middleware function
export default function middleware(req: NextRequest) {
  const locales = routing.locales

  // Regex to match public pages
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  )

  const token = req.cookies.get("authToken")?.value
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)
  const isLoginPage =
    publicPathnameRegex.test(req.nextUrl.pathname) &&
    req.nextUrl.pathname.includes("/login")

  const requestedPage = req.headers.get("next-url") || "/"

  // if (token && isLoginPage) {
  //   // Redirect logged-in users away from the login page
  //   return NextResponse.redirect(new URL("/", req.url)) // Redirect to home or dashboard
  // }

  // Handle public pages
  if (isPublicPage) {
    return handleI18nRouting(req)
  } else {
    return (authMiddleware as any)(req)
  }
}

// Middleware configuration
export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Exclude API and static files
}
