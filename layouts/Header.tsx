'use client'

import { type Locale, useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

import { Check, ChevronDown, MenuIcon } from 'lucide-react'
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
    <header className='flex h-16 items-center justify-center border-b'>
      <nav className='flex w-full max-w-6xl items-center justify-between px-6'>
        <ul className='flex items-center'>
          <li>
            <Link href='/'>
              <Image
                src='/images/logotype_no_bg.png'
                alt={t('territoire_vibrant')}
                width={500}
                height={500}
                className='size-44'
              />
            </Link>
          </li>
        </ul>

        <div className='flex flex-row-reverse items-center gap-4 md:flex-row'>
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
                    data-current-page={pathname === '/publications'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/publications'>{t('publications')}</Link>
                  </li>

                  <li
                    data-current-page={pathname === '/blog'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/blog'>blog</Link>
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
              data-current-page={pathname === '/who-we-are'}
              className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
            >
              <Link href='/who-we-are'>{t('who_we_are')}</Link>
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
              data-current-page={pathname === '/publications'}
              className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
            >
              <Link href='/publications'>{t('publications')}</Link>
            </li>

            <li
              data-current-page={pathname === '/blog'}
              className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
            >
              <Link href='/blog'>blog</Link>
            </li>

            <li
              data-current-page={pathname === '/contact'}
              className='transition-all ease-in data-[current-page=true]:font-semibold hover:text-green-600'
            >
              <Link href='/contact'>{t('contact')}</Link>
            </li>
          </ul>

          {/* Language switcher */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm' className='flex items-center gap-1'>
                  {localeLabelKey[locale] ? t(localeLabelKey[locale] as any) : locale.toUpperCase()}
                  <ChevronDown className='size-4 opacity-60' />
                  <span className='sr-only'>Language</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align='end'>
                {routing.locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    onClick={() => handleLanguageChange(loc as Locale)}
                    className='cursor-pointer'
                  >
                    <span className='mr-2'>
                      {localeLabelKey[loc] ? t(localeLabelKey[loc] as any) : loc.toUpperCase()}
                    </span>
                    {loc === locale && <Check className='ml-auto size-4 text-green-600' />}
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
