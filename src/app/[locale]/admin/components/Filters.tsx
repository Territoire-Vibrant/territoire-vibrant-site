'use client'

import { useTranslations } from 'next-intl'
import { type ChangeEvent, useEffect, useMemo, useState } from 'react'

import { Button } from '~/components/ui/button'

import { Link, useRouter } from '~/i18n/navigation'

const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const
export type PublishStatusValue = (typeof STATUSES)[number]

type Props = {
  initialQuery: string
  initialSort: string
  initialStatus?: PublishStatusValue
}

export const Filters = ({ initialQuery, initialSort, initialStatus }: Props) => {
  const t = useTranslations()
  const router = useRouter()
  const searchParams =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()

  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState(initialSort || 'newest')
  const [status, setStatus] = useState<PublishStatusValue | ''>(initialStatus ?? '')

  // Helper to write the URL with current state
  const commit = useMemo(() => {
    return (next: Partial<{ q: string; sort: string; status: string | undefined }>) => {
      const params = new URLSearchParams(searchParams?.toString())
      if (next.q !== undefined) {
        const v = next.q.trim()
        if (v) params.set('q', v)
        else params.delete('q')
      }
      if (next.sort !== undefined) {
        if (next.sort) params.set('sort', next.sort)
        else params.delete('sort')
      }
      if (next.status !== undefined) {
        const v = next.status
        if (v) params.set('status', v)
        else params.delete('status')
      }
      const qs = params.toString()
      router.replace(qs ? `?${qs}` : '?', { scroll: false })
    }
  }, [router, searchParams.toString()])

  // Debounce query updates for responsiveness without spamming navigation
  useEffect(() => {
    const id = setTimeout(() => {
      commit({ q: query })
    }, 300)
    return () => clearTimeout(id)
  }, [query, commit])

  // Immediate update for sort and status
  useEffect(() => {
    commit({ sort })
  }, [sort])

  useEffect(() => {
    commit({ status: status || undefined })
  }, [status])

  const onChangeQuery = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)
  const onChangeSort = (e: ChangeEvent<HTMLSelectElement>) => setSort(e.target.value)
  const onChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => setStatus((e.target.value as PublishStatusValue) || '')

  return (
    <div className='flex w-full flex-col items-center gap-2 md:flex-row'>
      <input
        type='text'
        name='q'
        value={query}
        onChange={onChangeQuery}
        placeholder={t('publications_search_placeholder')}
        className='h-9 w-full rounded-md border px-3 text-sm shadow-sm'
      />

      <div className='flex w-full items-center gap-2 md:w-auto'>
        <select
          name='sort'
          value={sort}
          onChange={onChangeSort}
          className='h-9 rounded-md border px-2 text-sm shadow-sm'
        >
          <option value='newest'>{t('newest')}</option>
          <option value='oldest'>{t('oldest')}</option>
        </select>

        <select
          name='status'
          value={status}
          onChange={onChangeStatus}
          className='h-9 rounded-md border px-2 text-sm shadow-sm'
        >
          <option value=''>{t('all_statuses')}</option>

          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`publish_status.${s}`)}
            </option>
          ))}
        </select>

        <Button variant='outline'>
          <Link href='/admin/publication/create'>{t('create')}</Link>
        </Button>
      </div>
    </div>
  )
}
