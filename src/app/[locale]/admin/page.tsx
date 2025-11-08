import { UserButton } from '@clerk/nextjs'
import { getTranslations } from 'next-intl/server'

import { Button } from '~/components/ui/button'
import { Filters } from './components/Filters'

import { api } from '~/trpc/server'

import type { PublishStatus } from 'generated/prisma'

export default async function AdminPage({
  searchParams,
}: { searchParams?: Record<string, string | string[] | undefined> }) {
  const sp = await searchParams
  const rawQuery = sp?.q
  const rawStatus = sp?.status
  const rawSort = sp?.sort

  const query = typeof rawQuery === 'string' ? rawQuery.trim() : ''
  const status = typeof rawStatus === 'string' ? (rawStatus as PublishStatus) : undefined
  const sort = typeof rawSort === 'string' ? rawSort : 'newest'

  const t = await getTranslations()
  // Helper to allow dynamic keys without TS complaints
  const tx = (key: string) => (t as unknown as (k: string) => string)(key)

  const articles = await api.article.getAll()
  const filtered = articles
    .filter((a) => (status ? a.status === status : true))
    .filter((a) => (query ? a.id.includes(query) : true))
    .sort((a, b) => {
      if (sort === 'newest') return b.createdAt.getTime() - a.createdAt.getTime()
      if (sort === 'oldest') return a.createdAt.getTime() - b.createdAt.getTime()
      return 0
    })

  return (
    <div className='flex flex-col items-center'>
      <header className='flex h-16 w-full items-center justify-center bg-yellow-200'>
        <nav className='flex w-full max-w-6xl items-center justify-between px-6'>
          <h1 className='font-semibold'>Admin</h1>

          <UserButton />
        </nav>
      </header>

      <div className='mt-10 flex w-full max-w-6xl flex-col gap-6 px-6'>
        <div className='flex flex-wrap items-center gap-4'>
          <Filters initialQuery={query} initialSort={sort} initialStatus={status} />

          <Button size='sm' variant='outline' className='ml-auto'>
            {t('create')}
          </Button>
        </div>

        <h2 className='font-semibold text-2xl'>{t('publications')}</h2>

        <div>
          {filtered.length ? (
            filtered.map((article) => (
              <div key={article.id} className='my-4 rounded border p-4'>
                <h3 className='font-semibold text-lg'>{article.id}</h3>

                <p className='text-muted-foreground text-xs'>
                  {t('status')}: {tx(`publish_status.${article.status}`)}
                </p>

                <p className='text-muted-foreground text-xs'>
                  {t('created')}: {article.createdAt.toISOString()}
                </p>
              </div>
            ))
          ) : (
            <p>{t('no_publications_yet')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
