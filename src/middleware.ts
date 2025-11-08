import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'
import { isAdminFromSessionClaims } from './lib/utils'

const intlMiddleware = createMiddleware(routing)

// Route matchers for access control (support locale-prefixed paths and non-prefixed fallbacks).
const adminPatterns = ['/admin(.*)', ...routing.locales.map((l) => `/${l}/admin(.*)`)]
const adminLoginPatterns = ['/admin/login(.*)', ...routing.locales.map((l) => `/${l}/admin/login(.*)`)]
const isAdminRoute = createRouteMatcher(adminPatterns)
const isPublicAdminRoute = createRouteMatcher(adminLoginPatterns)

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isAdminRoute(req) && !isPublicAdminRoute(req)) {
    const { userId, redirectToSignIn, sessionClaims } = await auth()
    if (!userId) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }

    const isAdmin = isAdminFromSessionClaims(sessionClaims)

    // Redirect non-admin authenticated users out of /admin
    if (!isAdmin) {
      const url = new URL('/', req.url)
      return NextResponse.redirect(url)
    }
  }

  // Skip next-intl for API and tRPC routes.
  const pathname = req.nextUrl.pathname
  if (pathname.startsWith('/api') || pathname.startsWith('/trpc')) {
    return
  }

  // Apply internationalization for all other routes.
  return intlMiddleware(req)
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!_next|_vercel|.*\\..*).*)',
}
