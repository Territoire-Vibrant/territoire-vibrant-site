'use client'

import { useTranslations } from 'next-intl'

import { MenuIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

import { Link, usePathname } from '~/i18n/navigation'

export const Header = () => {
  const t = useTranslations()

  const pathname = usePathname()

  return (
    <header className='flex h-16 items-center justify-center border-b'>
      <nav className='flex w-full max-w-6xl items-center justify-between px-6'>
        <ul className='flex items-center'>
          <li className='transition-all ease-in hover:text-green-600'>
            <Link href='/'>{t('territoire_vibrant')}</Link>
          </li>
        </ul>

        {/* Mobile links */}
        <div className='flex md:hidden'>
          <Dialog>
            <DialogTrigger className='cursor-pointer transition-all ease-in hover:text-green-600'>
              <MenuIcon />
            </DialogTrigger>

            <DialogContent className='flex h-screen w-screen max-w-screen flex-col items-center justify-center rounded-none border-none bg-black/50 text-white shadow-none sm:max-w-screen'>
              <DialogHeader className='sr-only'>
                <DialogTitle />
                <DialogDescription />
              </DialogHeader>

              <ul className='flex flex-col items-center gap-6 text-2xl'>
                <li
                  data-current-page={pathname === '/'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/'>{t('home')}</Link>
                </li>

                <li
                  data-current-page={pathname === '/who-we-are'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/who-we-are'>{t('who_we_are')}</Link>
                </li>

                <li
                  data-current-page={pathname === '/method'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/method'>{t('method')}</Link>
                </li>

                <li
                  data-current-page={pathname === '/projects'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/projects'>{t('projects')}</Link>
                </li>

                <li
                  data-current-page={pathname === '/services'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/services'>{t('services')}</Link>
                </li>

                <li
                  data-current-page={pathname === '/our-network'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/our-network'>{t('our_network')}</Link>
                </li>

                <li
                  data-current-page={pathname === '/contact'}
                  className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                >
                  <Link href='/contact'>{t('contact')}</Link>
                </li>
              </ul>
            </DialogContent>
          </Dialog>
        </div>

        {/* Desktop links */}
        <ul className='hidden items-center gap-6 md:flex'>
          <li
            data-current-page={pathname === '/'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/'>{t('home')}</Link>
          </li>

          <li
            data-current-page={pathname === '/who-we-are'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/who-we-are'>{t('who_we_are')}</Link>
          </li>

          <li
            data-current-page={pathname === '/method'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/method'>{t('method')}</Link>
          </li>

          <li
            data-current-page={pathname === '/projects'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/projects'>{t('projects')}</Link>
          </li>

          <li
            data-current-page={pathname === '/services'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/services'>{t('services')}</Link>
          </li>

          <li
            data-current-page={pathname === '/our-network'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/our-network'>{t('our_network')}</Link>
          </li>

          <li
            data-current-page={pathname === '/contact'}
            className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
          >
            <Link href='/contact'>{t('contact')}</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
