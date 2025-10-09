import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { Geist, Geist_Mono } from 'next/font/google'
// biome-ignore lint/nursery/noRestrictedImports: notFound is a Next.js function
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { routing } from '~/i18n/routing'

import '../globals.css'

import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Header } from '~/layouts/Header'

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

// In Next.js typed routes, params can be provided asynchronously; reflect that here so
// the layout matches the expected LayoutConfig type for /[locale].
type RootLayoutProps = Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('territoire_vibrant'),
    description: t('Home_Hero.h1'),
  }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable}${geistMono.variable} antialiased`}>
        <Analytics />
        <SpeedInsights />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className='mx-auto max-w-6xl'>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
