import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'pt'],
  defaultLocale: 'en',
  localeDetection: true,
  localePrefix: 'always',
  localeCookie: {
    name: 'locale',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
  alternateLinks: true,
})
