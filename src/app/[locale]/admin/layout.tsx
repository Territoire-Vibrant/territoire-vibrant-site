import { UserButton } from '@clerk/nextjs'
import type { ReactNode } from 'react'

import { Toaster } from '~/components/ui/sonner'

import { Link } from '~/i18n/navigation'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className='flex flex-col items-center'>
      <header className='flex h-16 w-full items-center justify-center bg-yellow-200'>
        <nav className='flex w-full max-w-6xl items-center justify-between px-6'>
          <Link href='/admin' className='font-semibold hover:underline'>
            Admin
          </Link>

          <UserButton />
        </nav>
      </header>

      <Toaster richColors />

      {children}
    </div>
  )
}
