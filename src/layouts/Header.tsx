'use client'

import { type Locale, useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

import { CaretDownIcon, CheckIcon, ListIcon } from '@phosphor-icons/react/dist/ssr'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

import { Link, usePathname, useRouter } from '~/i18n/navigation'
import { routing } from '~/i18n/routing'

export const Header = () => {
  const t = useTranslations()
  const locale = useLocale()

  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const localeLabelKey: Record<string, string> = {
    en: 'english',
    pt: 'portuguese',
    es: 'spanish',
    fr: 'french',
  }

  const handleLanguageChange = (newLocale: Locale) => {
    router.replace(pathname, {
      locale: newLocale,
    })
  }

  return (
    <header className='sticky top-0 z-30 flex select-none items-center justify-center bg-background/70 backdrop-blur-xl'>
      <nav className='flex h-16 w-full max-w-6xl items-center justify-between px-6'>
        <ul className='flex items-center'>
          <li>
            <Link href='/' prefetch>
              <Image
                src='/images/logotype_no_bg.png'
                alt={t('territoire_vibrant')}
                width={500}
                height={500}
                className='h-10 w-auto object-contain'
              />
            </Link>
          </li>
        </ul>

        <div className='flex flex-row-reverse items-center gap-4 md:flex-row'>
          {/* Mobile links */}
          <div className='flex md:hidden'>
            <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
              <DialogTrigger className='cursor-pointer transition-all ease-in hover:text-primary'>
                <ListIcon />
              </DialogTrigger>

              <DialogContent className='flex h-screen w-screen max-w-screen flex-col items-center justify-center rounded-none border-none bg-black/50 text-background shadow-none sm:max-w-screen'>
                <DialogHeader className='sr-only'>
                  <DialogTitle />
                  <DialogDescription />
                </DialogHeader>

                <ul className='flex flex-col items-center gap-6 text-2xl'>
                  <li
                    data-current-page={pathname === '/'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/' prefetch onClick={() => setOpen(false)}>
                      {t('home')}
                    </Link>
                  </li>

                  <li
                    data-current-page={pathname === '/who-we-are'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/who-we-are' prefetch onClick={() => setOpen(false)}>
                      {t('who_we_are')}
                    </Link>
                  </li>

                  <li className='transition-all ease-in'>
                    <Link href='/#projects' prefetch onClick={() => setOpen(false)}>
                      {t('projects')}
                    </Link>
                  </li>

                  <li
                    data-current-page={pathname.includes('services')}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/#services' prefetch onClick={() => setOpen(false)}>
                      {t('services')}
                    </Link>
                  </li>

                  <li
                    data-current-page={pathname === '/publications'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/publications' prefetch onClick={() => setOpen(false)}>
                      {t('publications')}
                    </Link>
                  </li>

                  <li
                    data-current-page={pathname === '/blog'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/blog' prefetch onClick={() => setOpen(false)}>
                      Blog
                    </Link>
                  </li>

                  <li className='transition-all ease-in'>
                    <Link href='/#contact' prefetch onClick={() => setOpen(false)}>
                      {t('contact')}
                    </Link>
                  </li>
                </ul>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop links */}
          <ul className='hidden items-center gap-6 md:flex'>
            <li
              data-current-page={pathname === '/who-we-are'}
              className='transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/who-we-are' prefetch>
                {t('who_we_are')}
              </Link>
            </li>

            <li className='transition-all ease-in hover:scale-105 hover:text-primary'>
              <Link href='/#projects' prefetch>
                {t('projects')}
              </Link>
            </li>

            <li
              data-current-page={pathname.includes('services')}
              className='transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/#services' prefetch>
                {t('services')}
              </Link>
            </li>

            <li
              data-current-page={pathname === '/publications'}
              className='transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/publications' prefetch>
                {t('publications')}
              </Link>
            </li>

            <li
              data-current-page={pathname === '/blog'}
              className='transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/blog' prefetch>
                Blog
              </Link>
            </li>

            <li className='transition-all ease-in hover:scale-105 hover:text-primary'>
              <Link href='/#contact' prefetch>
                {t('contact')}
              </Link>
            </li>
          </ul>

          {/* Language switcher */}
          <div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1 rounded-none border-none bg-background/50 hover:bg-primary hover:text-background'
                >
                  {localeLabelKey[locale] ? t(localeLabelKey[locale] as any) : locale.toUpperCase()}
                  <CaretDownIcon className='size-4 opacity-60' />
                  <span className='sr-only'>Language</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end'>
                {routing.locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    className='group transition-all ease-in focus:bg-primary/50 focus:text-background'
                    onClick={() => handleLanguageChange(loc as Locale)}
                  >
                    <span className='mr-2'>
                      {localeLabelKey[loc] ? t(localeLabelKey[loc] as any) : loc.toUpperCase()}
                    </span>
                    {loc === locale && (
                      <CheckIcon className='ml-auto size-4 text-primary group-hover:text-background' />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  )
}
