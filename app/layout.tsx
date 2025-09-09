import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

import { Header } from '~/layouts/Header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Territoire Vibrant',
  description:
    "Nous transformons les territoires en projets durables qui allient tourisme, innovation sociale et économie créative à partir de la conception d'expériences communautaires.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable}${geistMono.variable} antialiased`}>
        <NextIntlClientProvider>
          <Header />

          <main className='mx-auto max-w-6xl'>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
