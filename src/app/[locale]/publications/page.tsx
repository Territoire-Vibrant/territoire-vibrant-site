import { getTranslations } from 'next-intl/server'

import { Button } from '~/components/ui/button'
import { Section } from '~/layouts/Section'

import { Link } from '~/i18n/navigation'
import { toExcerpt } from '~/lib/utils'
import { api } from '~/trpc/server'

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'pt'] as const

type Locale = (typeof SUPPORTED_LOCALES)[number]

const LOCALE_LABEL_KEYS: Record<Locale, 'english' | 'spanish' | 'french' | 'portuguese'> = {
  en: 'english',
  es: 'spanish',
  fr: 'french',
  pt: 'portuguese',
}

const resolveLocale = (value: string): Locale => {
  return SUPPORTED_LOCALES.includes(value as Locale) ? (value as Locale) : 'en'
}

const formatDate = (locale: Locale, date: Date) => {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)
}

type PublishedArticleCard = {
  id: string
  title: string
  excerpt: string
  createdAt: Date
  locale: Locale
  isFallback: boolean
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{
    locale: string
  }>
}) {
  const { locale } = await params
  const activeLocale = resolveLocale(locale)

  const t = await getTranslations()
  const articles = await api.article.getAll()

  const publishedArticles: PublishedArticleCard[] = articles
    .filter((article) => article.status === 'PUBLISHED')
    .map((article) => {
      const translationForLocale = article.translations.find(
        (translation) => translation.locale === activeLocale && translation.published
      )
      const fallbackTranslation = article.translations.find(
        (translation) => translation.locale === 'en' && translation.published
      )
      const translation = translationForLocale ?? fallbackTranslation

      if (!translation) {
        return null
      }

      return {
        id: article.id,
        title: translation.title,
        excerpt: toExcerpt(translation.bodyMd, 220),
        createdAt: article.createdAt,
        locale: translation.locale as Locale,
        isFallback: translation.locale !== activeLocale,
      }
    })
    .filter((articleCard): articleCard is PublishedArticleCard => articleCard !== null)

  return (
    <Section className='px-6 py-12'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-10'>
        <header className='space-y-3'>
          <p className='font-semibold text-primary text-sm uppercase tracking-[0.2em]'>{t('publications')}</p>

          <h1 className='font-bold text-4xl text-foreground tracking-tight'>{t('Publications.title')}</h1>

          <p className='max-w-2xl text-base text-muted-foreground'>{t('Publications.subtitle')}</p>
        </header>

        {publishedArticles.length === 0 ? (
          <p className='text-muted-foreground'>{t('no_publications_yet')}</p>
        ) : (
          <div className='flex flex-col gap-10'>
            {publishedArticles.map((articleCard) => {
              const publishedLabel = t('Publications.published_on', {
                date: formatDate(activeLocale, articleCard.createdAt),
              })
              const languageName = t(LOCALE_LABEL_KEYS[articleCard.locale])

              return (
                <article key={articleCard.id} className='rounded-2xl border border-border/60 p-6 shadow-xs'>
                  <div className='flex flex-col gap-3'>
                    <div className='flex flex-wrap items-center gap-3 font-medium text-muted-foreground text-xs'>
                      <span>{publishedLabel}</span>

                      {articleCard.isFallback ? (
                        <span className='rounded-full bg-muted px-2 py-1 font-semibold text-[11px] text-foreground uppercase tracking-wide'>
                          {t('Publications.fallback_notice', { language: languageName })}
                        </span>
                      ) : null}
                    </div>

                    <h2 className='font-semibold text-2xl text-foreground'>{articleCard.title}</h2>

                    <p className='text-base text-muted-foreground leading-relaxed'>{articleCard.excerpt}</p>

                    <div className='pt-2'>
                      <Button asChild variant='ghost' size='sm'>
                        <Link href={`/publications/${articleCard.id}`}>{t('Publications.read_more')}</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </Section>
  )
}
