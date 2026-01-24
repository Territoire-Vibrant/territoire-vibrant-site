'use client'

import { type Locale, useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { CheckIcon, GlobeIcon, ListIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

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

        <div className='flex flex-row-reverse items-center gap-4 lg:flex-row'>
          {/* Mobile links */}
          <div className='flex lg:hidden'>
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
                    data-current-page={pathname === '/method'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/method' prefetch onClick={() => setOpen(false)}>
                      {t('method')}
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
                    data-current-page={pathname === '/magazine'}
                    className='transition-all ease-in data-[current-page=true]:font-semibold data-[current-page=true]:text-neutral-400'
                  >
                    <Link href='/magazine' prefetch onClick={() => setOpen(false)}>
                      {t('magazine')}
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
          <ul className='ml-6 hidden items-center gap-6 lg:flex'>
            <li
              data-current-page={pathname === '/method'}
              className='whitespace-nowrap transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/method' prefetch>
                {t('method')}
              </Link>
            </li>

            <li
              data-current-page={pathname === '/who-we-are'}
              className='whitespace-nowrap transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
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
              className='whitespace-nowrap transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/#services' prefetch>
                {t('services')}
              </Link>
            </li>

            <li
              data-current-page={pathname === '/publications'}
              className='whitespace-nowrap transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/publications' prefetch>
                {t('publications')}
              </Link>
            </li>

            <li
              data-current-page={pathname === '/magazine'}
              className='whitespace-nowrap transition-all ease-in hover:scale-105 data-[current-page=true]:font-semibold hover:text-primary'
            >
              <Link href='/magazine' prefetch>
                {t('magazine')}
              </Link>
            </li>

            <li className='transition-all ease-in hover:scale-105 hover:text-primary'>
              <Link href='/#contact' prefetch>
                {t('contact')}
              </Link>
            </li>
          </ul>

          <div className='ml-6 flex items-center gap-1'>
            {/* Search */}
            <div className='relative flex items-center'>
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                  searchOpen ? 'w-48 md:w-64' : 'w-0'
                }`}
              >
                <form onSubmit={handleSearch} className='flex w-full items-center'>
                  <input
                    ref={searchInputRef}
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search')}
                    className='h-9 w-full border-primary/30 border-b bg-transparent px-2 text-sm outline-none focus:border-primary placeholder:text-muted-foreground'
                  />
                </form>
              </div>

              <Button
                variant='ghost'
                size='icon'
                className='rounded-none hover:bg-primary hover:text-background'
                onClick={() => {
                  if (searchOpen && searchQuery) {
                    setSearchQuery('')
                  }
                  setSearchOpen(!searchOpen)
                }}
              >
                {searchOpen ? <XIcon className='size-5' /> : <MagnifyingGlassIcon className='size-5' />}
                <span className='sr-only'>{searchOpen ? 'Close search' : 'Open search'}</span>
              </Button>
            </div>

            {/* Language switcher */}
            <div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='rounded-none hover:bg-primary hover:text-background'>
                    <GlobeIcon className='size-5' />
                    <span className='sr-only'>Language</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                  {routing.locales.map((loc) => (
                    <DropdownMenuItem
                      key={loc}
                      className='group transition-all ease-in focus:bg-primary focus:text-background'
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
        </div>
      </nav>
    </header>
  )
}
