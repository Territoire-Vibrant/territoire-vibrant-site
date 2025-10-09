import { useTranslations } from 'next-intl'

import { Link } from '~/i18n/navigation'

export const Header = () => {
  const t = useTranslations()

  return (
    <header className='flex h-16 items-center justify-center border-b'>
      <nav className='flex w-full max-w-6xl items-center justify-between px-6'>
        <ul className='flex items-center'>
          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/'>{t('territoire_vibrant')}</Link>
          </li>
        </ul>

        <ul className='flex items-center gap-6'>
          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/'>{t('home')}</Link>
          </li>

          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/who_we_are'>{t('who_we_are')}</Link>
          </li>

          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/method'>{t('method')}</Link>
          </li>

          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/projects'>{t('projects')}</Link>
          </li>

          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/services'>{t('services')}</Link>
          </li>

          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/our_network'>{t('our_network')}</Link>
          </li>

          <li className='transition-all ease-in hover:text-green-700'>
            <Link href='/contact'>{t('contact')}</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
