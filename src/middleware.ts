import { clerkMiddleware } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import type { NextFetchEvent, NextRequest } from 'next/server'

import { routing } from './i18n/routing'

// Instantiate each middleware once for composition.
const intlMiddleware = createMiddleware(routing)
const clerk = clerkMiddleware()

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Run internationalization first so locale resolution/rewrite happens before auth.
  const intlResponse = intlMiddleware(req)
  if (intlResponse) return intlResponse

  // Then run Clerk auth middleware.
  const authResponse = clerk(req, event)
  if (authResponse) return authResponse
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
