import { EnvelopeSimple, InstagramLogo, LinkedinLogo, Phone } from '@phosphor-icons/react/dist/ssr'
import { getLocale, getTranslations } from 'next-intl/server'
import Image from 'next/image'

import { Link } from '~/i18n/navigation'
import { METHOD_ARTICLE_ID } from '~/lib/constants'
import { api } from '~/trpc/server'

type Locale = 'en' | 'es' | 'fr' | 'pt'

export const Footer = async () => {
  const t = await getTranslations()
  const locale = (await getLocale()) as Locale

  const currentYear = new Date().getFullYear()

  const articles = await api.article.getAll()

  const recentArticles = articles
    .filter((article) => article.status === 'PUBLISHED' && article.id !== METHOD_ARTICLE_ID)
    .slice(0, 4)
    .map((article) => {
      const translationForLocale = article.translations.find(
        (translation) => translation.locale === locale && translation.published
      )
      const fallbackTranslation = article.translations.find(
        (translation) => translation.locale === 'en' && translation.published
      )
      const translation = translationForLocale ?? fallbackTranslation

      if (!translation) return null

      return {
        id: article.id,
        title: translation.title,
      }
    })
    .filter((article): article is { id: string; title: string } => article !== null)

  return (
    <footer className='bg-foreground text-background'>
      <div className='mx-auto max-w-6xl px-6 py-12'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4'>
          {/* Logo and description */}
          <div className='flex flex-col gap-4 lg:col-span-1'>
            <Link href='/' prefetch>
              <Image
                src='/images/logotype_no_bg.png'
                alt={t('territoire_vibrant')}
                width={200}
                height={60}
                className='h-10 w-auto object-contain brightness-0 invert'
              />
            </Link>
            <p className='whitespace-pre-line text-background/70 text-sm leading-relaxed'>
              {t('Home.hero.h2.subtext')}
            </p>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col gap-4'>
            <h4 className='font-semibold text-secondary'>{t('Footer.quick_links')}</h4>
            <ul className='flex flex-col gap-2 text-sm'>
              <li>
                <Link href='/' prefetch className='text-background/70 transition-colors hover:text-secondary'>
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href='/method' prefetch className='text-background/70 transition-colors hover:text-secondary'>
                  {t('method')}
                </Link>
              </li>
              <li>
                <Link href='/who-we-are' prefetch className='text-background/70 transition-colors hover:text-secondary'>
                  {t('who_we_are')}
                </Link>
              </li>
              <li>
                <Link
                  href='/publications'
                  prefetch
                  className='text-background/70 transition-colors hover:text-secondary'
                >
                  {t('publications')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Recent Articles */}
          <div className='flex flex-col gap-4'>
            <h4 className='font-semibold text-secondary'>{t('Footer.recent_articles')}</h4>
            <ul className='flex flex-col gap-2 text-sm'>
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/publications/${article.id}`}
                      prefetch
                      className='line-clamp-2 text-background/70 transition-colors hover:text-secondary'
                    >
                      {article.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className='text-background/50 text-xs'>{t('no_publications_yet')}</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className='flex flex-col gap-4'>
            <h4 className='font-semibold text-secondary'>{t('contact')}</h4>
            <ul className='flex flex-col gap-3 text-sm'>
              <li>
                <a
                  href='mailto:contato@territoirevibrant.ca'
                  className='flex items-center gap-2 text-background/70 transition-colors hover:text-secondary'
                >
                  <EnvelopeSimple className='size-4' />
                  <span>contato@territoirevibrant.ca</span>
                </a>
              </li>
              <li>
                <a
                  href='tel:+15141234567'
                  className='flex items-center gap-2 text-background/70 transition-colors hover:text-secondary'
                >
                  <Phone className='size-4' />
                  <span>+1 (514) 123-4567</span>
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div className='mt-2 flex gap-3'>
              <a
                href='https://instagram.com/territoirevibrant'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className='flex size-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-all hover:bg-secondary hover:text-foreground'
              >
                <InstagramLogo className='size-5' />
              </a>
              <a
                href='https://linkedin.com/company/territoirevibrant'
                target='_blank'
                rel='noopener noreferrer'
                aria-label='LinkedIn'
                className='flex size-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-all hover:bg-secondary hover:text-foreground'
              >
                <LinkedinLogo className='size-5' />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-10 flex flex-col items-center justify-between gap-4 border-background/10 border-t pt-6 text-sm md:flex-row'>
          <p className='text-background/50'>
            © {currentYear} {t('territoire_vibrant')}. {t('Footer.all_rights_reserved')}
          </p>
          <div className='flex gap-6'>
            <Link href='/privacy' prefetch className='text-background/50 transition-colors hover:text-secondary'>
              {t('Footer.privacy_policy')}
            </Link>
            <Link href='/terms' prefetch className='text-background/50 transition-colors hover:text-secondary'>
              {t('Footer.terms_of_use')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
