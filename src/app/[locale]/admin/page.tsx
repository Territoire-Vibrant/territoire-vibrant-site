import { getTranslations } from 'next-intl/server'

import { ArchiveIcon, CheckIcon, NotePencilIcon } from '@phosphor-icons/react/dist/ssr'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { Filters } from './components/Filters'

import { Link } from '~/i18n/navigation'
import { api } from '~/trpc/server'

import type { PublishStatus } from 'generated/prisma'
import { toExcerpt } from '~/lib/utils'

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
        return <NotePencilIcon weight='fill' className='size-7 rounded-full bg-yellow-500 p-1.5 text-background' />
      case 'ARCHIVED':
        return <ArchiveIcon weight='fill' className='size-7 rounded-full bg-neutral-500 p-1.5 text-background' />
      case 'PUBLISHED':
        return <CheckIcon weight='bold' className='size-7 rounded-full bg-primary p-1.5 text-background' />
    }
  }

  return (
    <div className='mt-10 flex w-full max-w-6xl flex-col gap-6 px-6'>
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

            return (
              <div key={article.id} className='flex flex-col rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-lg'>{translation?.title ?? article.id}</p>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>{statusIcon(article.status)}</TooltipTrigger>

                      <TooltipContent>
                        <p>{tx(`publish_status.${article.status}`)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <p className='my-2 text-muted-foreground text-sm'>{toExcerpt(translation?.bodyMd ?? '', 80)}</p>

                <div className='flex items-center justify-between text-xs'>
                  <Link
                    href={`/admin/publication/${article.id}`}
                    className='font-semibold text-primary text-sm hover:underline'
                  >
                    {t('find_out_more')}
                  </Link>

                  <p className='text-muted-foreground italic'>
                    {article.createdAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <p className='text-neutral-500'>{t('no_publications_yet')}</p>
        )}
      </div>
    </div>
  )
}
