import '@uiw/react-markdown-preview/markdown.css'

import { getTranslations } from 'next-intl/server'

import { MarkdownPreview } from '~/components/MarkdownPreview'
import { Button } from '~/components/ui/button'
import { Section } from '~/layouts/Section'
import { METHOD_ARTICLE_ID } from '~/lib/constants'

import { Link } from '~/i18n/navigation'
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

const buildPreviewMarkdown = (md: string, maxParagraphs = 2, maxChars = 600) => {
  const trimmed = md.trim()
  if (!trimmed) return ''

  const paragraphs = trimmed.split(/\n{2,}/)
  let preview = paragraphs.slice(0, maxParagraphs).join('\n\n')

  if (preview.length > maxChars) {
    preview = `${preview.slice(0, maxChars).trimEnd()}…`
  }

  return preview
}

const HIGHLIGHT_START = '‹‹HL››'
const HIGHLIGHT_END = '‹‹/HL››'

const highlightText = (text: string, query: string) => {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, `${HIGHLIGHT_START}$1${HIGHLIGHT_END}`)
}

const renderHighlightedText = (text: string, query: string, keyPrefix: string) => {
  const highlighted = highlightText(text, query)
  const parts: React.ReactNode[] = []
  let remaining = highlighted
  let partIndex = 0

  while (remaining.length > 0) {
    const startIdx = remaining.indexOf(HIGHLIGHT_START)
    if (startIdx === -1) {
      parts.push(remaining)
      break
    }

    if (startIdx > 0) {
      parts.push(remaining.slice(0, startIdx))
    }

    const afterStart = remaining.slice(startIdx + HIGHLIGHT_START.length)
    const endIdx = afterStart.indexOf(HIGHLIGHT_END)

    if (endIdx === -1) {
      parts.push(remaining)
      break
    }

    const highlightedPart = afterStart.slice(0, endIdx)
    parts.push(
      <mark key={`${keyPrefix}-${partIndex}`} className='bg-primary/20 text-foreground'>
        {highlightedPart}
      </mark>
    )
    partIndex++

    remaining = afterStart.slice(endIdx + HIGHLIGHT_END.length)
  }

  return parts
}

type SearchResultCard = {
  id: string
  title: string
  createdAt: Date
  locale: Locale
  isFallback: boolean
  previewMd: string
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}) {
  const { locale } = await params
  const { q: query = '' } = await searchParams
  const activeLocale = resolveLocale(locale)

  const t = await getTranslations()

  let searchResults: SearchResultCard[] = []

  if (query.trim()) {
    const articles = await api.article.search({ query: query.trim(), locale: activeLocale })

    searchResults = articles
      .filter((article) => article.id !== METHOD_ARTICLE_ID)
      .map((article) => {
        const translationForLocale = article.translations.find((translation) => translation.locale === activeLocale)
        const fallbackTranslation = article.translations.find((translation) => translation.locale === 'en')
        const translation = translationForLocale ?? fallbackTranslation

        if (!translation) {
          return null
        }

        return {
          id: article.id,
          title: translation.title,
          createdAt: article.createdAt,
          locale: translation.locale as Locale,
          isFallback: translation.locale !== activeLocale,
          previewMd: buildPreviewMarkdown(highlightText(translation.bodyMd, query)),
        }
      })
      .filter((result): result is SearchResultCard => result !== null)
  }

  return (
    <Section className='px-6 py-12'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-10'>
        <div className='space-y-3'>
          <h1 className='font-bold text-4xl text-foreground tracking-tight'>{t('Search.title')}</h1>

          {query.trim() ? (
            <p className='max-w-2xl text-base text-muted-foreground'>
              {t('Search.results_for', { query })}
              {searchResults.length > 0 && (
                <span className='ml-2 font-medium text-foreground'>
                  ({t('Search.results_count', { count: searchResults.length })})
                </span>
              )}
            </p>
          ) : (
            <p className='max-w-2xl text-base text-muted-foreground'>{t('Search.enter_query')}</p>
          )}
        </div>

        {query.trim() && searchResults.length > 0 ? (
          <div className='flex flex-col gap-10'>
            {searchResults.map((result) => {
              const publishedLabel = t('Publications.published_on', {
                date: formatDate(activeLocale, result.createdAt),
              })
              const languageName = t(LOCALE_LABEL_KEYS[result.locale])

              return (
                <article key={result.id} className='rounded-2xl border border-border/60 p-6 shadow-xs'>
                  <div className='flex flex-col gap-3'>
                    <div className='flex flex-wrap items-center gap-3 font-medium text-muted-foreground text-xs'>
                      <span>{publishedLabel}</span>

                      {!!result.isFallback && (
                        <span className='rounded-full bg-muted px-2 py-1 font-semibold text-[11px] text-foreground uppercase tracking-wide'>
                          {t('Publications.fallback_notice', { language: languageName })}
                        </span>
                      )}
                    </div>

                    <h2 className='font-semibold text-2xl text-foreground'>
                      {renderHighlightedText(result.title, query, result.id)}
                    </h2>

                    <div className='text-base text-muted-foreground leading-relaxed [&_a]:underline'>
                      <MarkdownPreview markdown={result.previewMd} highlightMode />
                    </div>

                    <div className='pt-2'>
                      <Link href={`/publications/${result.id}`}>
                        <Button size='sm' className='cursor-pointer'>
                          {t('Publications.read_more')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : query.trim() ? (
          <div className='flex flex-col items-center gap-4 py-16 text-center'>
            <p className='text-lg text-muted-foreground'>{t('Search.no_results')}</p>
            <Link href='/publications'>
              <Button variant='outline' className='cursor-pointer'>
                {t('Search.browse_publications')}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </Section>
  )
}
