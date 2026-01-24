import '@uiw/react-markdown-preview/markdown.css'

import { getTranslations } from 'next-intl/server'

import { MarkdownPreview } from '~/components/MarkdownPreview'
import { Section } from '~/layouts/Section'
import { METHOD_ARTICLE_ID } from '~/lib/constants'

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

export default async function MethodPage({
  params,
}: {
  params: Promise<{
    locale: string
  }>
}) {
  const { locale } = await params
  const activeLocale = resolveLocale(locale)

  const t = await getTranslations()
  const article = await api.article.getArticleForEdit({ articleId: METHOD_ARTICLE_ID })

  if (!article || article.article.status !== 'PUBLISHED') {
    return (
      <Section className='px-6 py-12'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-10'>
          <p className='text-muted-foreground'>{t('no_publications_yet')}</p>
        </div>
      </Section>
    )
  }

  const translationForLocale = article.article.translations.find(
    (translation) => translation.locale === activeLocale && translation.published
  )
  const fallbackTranslation = article.article.translations.find(
    (translation) => translation.locale === 'en' && translation.published
  )
  const translation = translationForLocale ?? fallbackTranslation

  if (!translation) {
    return (
      <Section className='px-6 py-12'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-10'>
          <p className='text-muted-foreground'>{t('no_publications_yet')}</p>
        </div>
      </Section>
    )
  }

  const isFallback = translation.locale !== activeLocale
  const publishedLabel = t('Publications.published_on', {
    date: formatDate(activeLocale, article.article.createdAt),
  })
  const languageName = t(LOCALE_LABEL_KEYS[translation.locale as Locale])

  return (
    <Section className='px-6 py-12'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-10'>
        <div className='space-y-3'>
          <h1 className='font-bold text-4xl text-foreground tracking-tight'>{translation.title}</h1>

          <div className='flex flex-wrap items-center gap-3 font-medium text-muted-foreground text-xs'>
            <span>{publishedLabel}</span>

            {isFallback && (
              <span className='rounded-full bg-muted px-2 py-1 font-semibold text-[11px] text-foreground uppercase tracking-wide'>
                {t('Publications.fallback_notice', { language: languageName })}
              </span>
            )}
          </div>
        </div>

        <article className='prose prose-lg dark:prose-invert max-w-none'>
          <MarkdownPreview markdown={translation.bodyMd} />
        </article>
      </div>
    </Section>
  )
}
