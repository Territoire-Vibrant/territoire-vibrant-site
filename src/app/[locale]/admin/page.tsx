import { getTranslations } from 'next-intl/server'

import { Filters } from './components/Filters'

import { Link } from '~/i18n/navigation'
import { api } from '~/trpc/server'

import type { PublishStatus } from 'generated/prisma'

export default async function AdminPage({
  searchParams,
}: { searchParams?: Record<string, string | string[] | undefined> }) {
  const sp = await searchParams
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
  const locale = typeof rawLocale === 'string' ? rawLocale : undefined
  const filtered = articles
    .filter((a) => (status ? a.status === status : true))
    .filter((a) => (query ? a.id.includes(query) : true))
    .sort((a, b) => {
      if (sort === 'newest') return b.createdAt.getTime() - a.createdAt.getTime()
      if (sort === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime()
      return 0
    })

  return (
    <div className='mt-10 flex w-full max-w-6xl flex-col gap-6 px-6'>
      <div className='flex flex-wrap items-center gap-4'>
        <Filters initialQuery={query} initialSort={sort} initialStatus={status} />
      </div>

      <h2 className='font-semibold text-2xl'>{t('publications')}</h2>

      <div className='grid gap-4 md:grid-cols-3'>
        {filtered.length ? (
          filtered.map((article) => {
            const translation = article.translations.find((tr) => tr.locale === locale) ?? article.translations[0]
            return (
              <div key={article.id} className='my-4 rounded border p-4'>
                <h3 className='font-semibold text-lg'>{translation?.title ?? article.id}</h3>

                {translation?.slug && (
                  <Link
                    href={`/admin/publication/${translation.slug}`}
                    className='text-blue-600 text-sm underline underline-offset-2'
                  >
                    {t('find_out_more')}
                  </Link>
                )}

                <p className='mt-2 text-muted-foreground text-xs'>
                  {t('status')}: {tx(`publish_status.${article.status}`)}
                </p>

                <p className='mt-1 text-muted-foreground text-xs'>
                  {t('created')}: {article.createdAt.toISOString()}
                </p>
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
