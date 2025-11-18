import { ClerkProvider } from '@clerk/nextjs'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { type Locale, NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Geist, Geist_Mono } from 'next/font/google'
// biome-ignore lint/nursery/noRestrictedImports: notFound is a Next.js helper we intentionally use here
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import '../globals.css'

import { routing } from '~/i18n/routing'
import { Header } from '~/layouts/Header'
import { db } from '~/server/db'
import { TRPCReactProvider } from '~/trpc/react'

export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type RootLayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale })

  return {
    title: `${t('territoire_vibrant')} | ${t.markup('Home.hero.h1', { v: (chunks: string) => chunks })}`,
    description: t('Home.hero.h2'),
  }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  // Ensure the authenticated user exists in the database (mirrors TRPC context logic)
  try {
    const { userId } = await auth()
    if (userId) {
      const client = await clerkClient()

      const user = await client.users.getUser(userId)
      const primaryEmail = user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)?.emailAddress

      await db.user.upsert({
        where: { id: userId },
        update: {
          email: primaryEmail ?? undefined,
          name: user.fullName ?? undefined,
          imageUrl: user.imageUrl ?? undefined,
        },
        create: {
          id: userId,
          email: primaryEmail ?? undefined,
          name: user.fullName ?? undefined,
          imageUrl: user.imageUrl ?? undefined,
        },
      })
    }
  } catch (err) {
    // Swallow errors to not block layout rendering.
    console.error('[RootLayout ensureUser] failed:', err)
  }

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className={`${geistSans.variable}${geistMono.variable} relative antialiased`}>
          <Analytics />
          <SpeedInsights />

          <NextIntlClientProvider locale={locale} messages={messages}>
            <TRPCReactProvider>
              <Header />
              <main className='mx-auto'>{children}</main>
            </TRPCReactProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
