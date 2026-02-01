import { getTranslations } from 'next-intl/server'

import { ArchiveIcon, BookOpenIcon, CheckIcon, NotePencilIcon } from '@phosphor-icons/react/dist/ssr'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Filters } from './components/Filters'

import { MarkdownPreview } from '~/components/MarkdownPreview'
import { Link } from '~/i18n/navigation'
import { METHOD_ARTICLE_ID } from '~/lib/constants'
import { api } from '~/trpc/server'

import type { PublishStatus } from 'generated/prisma/client'

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const [{ locale: routeLocale }, sp] = await Promise.all([
    params,
    searchParams ?? Promise.resolve<Record<string, string | string[] | undefined> | undefined>(undefined),
  ])
  const rawQuery = sp?.q
  const rawStatus = sp?.status
  const rawSort = sp?.sort
  const rawLocale = sp?.locale

  const query = typeof rawQuery === 'string' ? rawQuery.trim() : ''
  const status = typeof rawStatus === 'string' ? (rawStatus as PublishStatus) : undefined
  const sort = typeof rawSort === 'string' ? rawSort : 'newest'

  const t = await getTranslations()
  // Helper to allow dynamic keys without TS complaints
  const tx = (key: string) => (t as unknown as (k: string) => string)(key)

  const articles = await api.article.getAll()
  const locale = typeof rawLocale === 'string' ? rawLocale : routeLocale
  const normalizedLocale = locale?.toLowerCase()
  const queryNormalized = query.toLocaleLowerCase()
  const filtered = articles
    .filter((a) => (status ? a.status === status : true))
    .filter((a) => {
      if (!queryNormalized) {
        return true
      }

      const idMatches = a.id.toLocaleLowerCase().includes(queryNormalized)
      if (idMatches) {
        return true
      }

      return a.translations.some((tr) => {
        const content = `${tr.title ?? ''} ${tr.bodyMd ?? ''}`
        return content.toLocaleLowerCase().includes(queryNormalized)
      })
    })
    .sort((a, b) => {
      if (sort === 'newest') return b.createdAt.getTime() - a.createdAt.getTime()
      if (sort === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime()
      return 0
    })

  const statusIcon = (status: PublishStatus) => {
    switch (status) {
      case 'DRAFT':
        return (
          <NotePencilIcon weight='fill' className='size-7 shrink-0 rounded-full bg-yellow-500 p-1.5 text-background' />
        )
      case 'ARCHIVED':
        return (
          <ArchiveIcon weight='fill' className='size-7 shrink-0 rounded-full bg-neutral-500 p-1.5 text-background' />
        )
      case 'PUBLISHED':
        return <CheckIcon weight='bold' className='size-7 shrink-0 rounded-full bg-primary p-1.5 text-background' />
    }
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

  return (
    <div className='mt-10 flex w-full max-w-6xl flex-col gap-6 px-6 pb-10'>
      <div className='flex flex-wrap items-center gap-4'>
        <Filters initialQuery={query} initialSort={sort} initialStatus={status} />
      </div>

      <h2 className='font-semibold text-2xl'>{t('publications')}</h2>

      <div className='grid gap-4 md:grid-cols-3'>
        {filtered.length ? (
          filtered.map((article) => {
            const translation =
              article.translations.find((tr) => tr.locale.toLowerCase() === normalizedLocale) ??
              article.translations.find((tr) => tr.locale === 'en') ??
              article.translations[0]

            const isMethodArticle = article.id === METHOD_ARTICLE_ID

            return (
              <article
                key={article.id}
                className={`flex h-full flex-col rounded-lg border p-4 ${isMethodArticle ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/20' : ''}`}
              >
                <div className='flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='font-semibold text-lg'>{translation?.title ?? article.id}</p>

                    {isMethodArticle && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <BookOpenIcon weight='fill' className='size-5 text-primary' />
                          </TooltipTrigger>

                          <TooltipContent>
                            <p>{t('method')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>{statusIcon(article.status)}</TooltipTrigger>

                      <TooltipContent>
                        <p>{tx(`publish_status.${article.status}`)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <MarkdownPreview
                  markdown={buildPreviewMarkdown(translation?.bodyMd ?? '')}
                  className='my-2 text-muted-foreground text-sm'
                />

                <div className='mt-auto flex items-center justify-between text-xs'>
                  <Link
                    href={`/admin/publication/${article.id}`}
                    className='font-semibold text-primary text-sm hover:underline'
                  >
                    {t('view')}
                  </Link>

                  <p className='text-muted-foreground italic'>
                    {article.createdAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                  </p>
                </div>
              </article>
            )
          })
        ) : (
          <p className='text-neutral-500'>{t('no_publications_yet')}</p>
        )}
      </div>
    </div>
  )
}
