'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type ChangeEvent, useCallback, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

import { useRouter } from '~/i18n/navigation'
import { api } from '~/trpc/react'

import { PublicationSchema } from './schema'

const LOCALES = ['en', 'es', 'fr', 'pt'] as const

export type TranslationInput = {
  locale: (typeof LOCALES)[number]
  title: string
  bodyMd: string
  published?: boolean
}

export type ArticleFormInitial = {
  articleId?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  translations: TranslationInput[]
}

type Props = {
  mode: 'create' | 'edit'
  initial?: ArticleFormInitial
}

export const ArticleForm = ({ mode, initial }: Props) => {
  const t = useTranslations()
  const locale = useLocale() as 'en' | 'es' | 'fr' | 'pt'
  const router = useRouter()

  const [status, setStatus] = useState<ArticleFormInitial['status']>(initial?.status ?? 'DRAFT')
  const [activeLocale, setActiveLocale] = useState<(typeof LOCALES)[number]>(locale)
  const [translations, setTranslations] = useState<TranslationInput[]>(
    LOCALES.map(
      (loc) => initial?.translations?.find((tr) => tr.locale === loc) ?? { locale: loc, title: '', bodyMd: '' }
    )
  )
  // Track which locale tabs have been successfully saved (persisted)
  const [savedLocales, setSavedLocales] = useState<Set<string>>(
    () => new Set(initial?.translations?.filter((t) => t.title && t.bodyMd).map((t) => t.locale) ?? [])
  )

  const createMutation = api.article.createArticle.useMutation()
  const updateMutation = api.article.updateArticle.useMutation()

  const onChangeField = useCallback(
    (loc: (typeof LOCALES)[number], key: keyof Omit<TranslationInput, 'locale'>, value: string | boolean) => {
      setTranslations((prev) =>
        prev.map((tr) =>
          tr.locale === loc
            ? {
                ...tr,
                [key]: value,
              }
            : tr
        )
      )

      // Mark locale as unsaved if user edits after save
      setSavedLocales((prev) => {
        if (prev.has(loc)) {
          const next = new Set(prev)
          next.delete(loc)
          return next
        }
        return prev
      })
    },
    []
  )

  const onTitleChange = (loc: (typeof LOCALES)[number]) => (e: ChangeEvent<HTMLInputElement>) => {
    const nextTitle = e.target.value
    onChangeField(loc, 'title', nextTitle)
  }

  const onBodyChange = (loc: (typeof LOCALES)[number]) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeField(loc, 'bodyMd', e.target.value)
  }

  const disabled = createMutation.isPending || updateMutation.isPending

  const validLocales = useMemo(() => {
    return translations.filter((tr) => PublicationSchema.safeParse(tr).success).map((tr) => tr.locale)
  }, [translations])

  const buildPayload = (overrideStatus?: ArticleFormInitial['status']) => ({
    status: overrideStatus ?? status,
    translations: translations
      .filter((tr) => PublicationSchema.safeParse(tr).success)
      .map((tr) => ({ ...tr, published: (overrideStatus ?? status) === 'PUBLISHED' })),
  })

  const persist = async (nextStatus: ArticleFormInitial['status']) => {
    const payload = buildPayload(nextStatus)

    if (mode === 'create') {
      const res = await createMutation.mutateAsync(payload)

      setSavedLocales(new Set(payload.translations.map((t) => t.locale)))

      // After creating, go to the edit page for the primary locale
      if (res?.id) {
        router.replace(`/admin/publication/${res.id}`, { locale })
      } else {
        router.replace('/admin', { locale })
      }
    } else if (mode === 'edit' && initial?.articleId) {
      const res = await updateMutation.mutateAsync({ articleId: initial.articleId, ...payload })

      setSavedLocales(new Set(res?.translations.map((t) => t.locale) ?? []))

      if (nextStatus === 'PUBLISHED') {
        router.replace('/admin', { locale })
      }
    }
  }

  const onSave = async () => {
    await persist(status === 'PUBLISHED' ? 'DRAFT' : status)
  }

  const onPublish = async () => {
    setStatus('PUBLISHED')
    await persist('PUBLISHED')
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <label className='font-medium text-sm' htmlFor='status'>
          {t('status')}
        </label>

        <select
          id='status'
          value={status}
          onChange={(e) => setStatus(e.target.value as ArticleFormInitial['status'])}
          className='h-9 rounded-md border px-2 text-sm shadow-sm'
        >
          <option value='DRAFT'>{t('publish_status.DRAFT')}</option>
          <option value='PUBLISHED'>{t('publish_status.PUBLISHED')}</option>
          <option value='ARCHIVED'>{t('publish_status.ARCHIVED')}</option>
        </select>

        <div className='ml-auto' />
      </div>

      <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as any)}>
        <TabsList>
          {LOCALES.map((loc) => {
            const isValid = validLocales.includes(loc)
            const isSaved = savedLocales.has(loc)
            return (
              <TabsTrigger key={loc} value={loc} className='relative'>
                <span className='flex items-center gap-1'>
                  {loc.toUpperCase()}
                  {isValid && isSaved && (
                    <svg aria-hidden='true' viewBox='0 0 20 20' fill='currentColor' className='size-4 text-green-600'>
                      <path
                        fillRule='evenodd'
                        d='M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.25a1 1 0 0 1-1.414-.006L3.29 8.994a1 1 0 1 1 1.414-1.414l3.05 3.05 6.543-6.543a1 1 0 0 1 1.407.203Z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {LOCALES.map((loc) => {
          const tr = translations.find((x) => x.locale === loc)!

          return (
            <TabsContent key={loc} value={loc}>
              <div className='grid gap-3'>
                <label className='font-medium text-sm' htmlFor={`title-${loc}`}>
                  Title ({loc.toUpperCase()})
                </label>

                <input
                  id={`title-${loc}`}
                  type='text'
                  value={tr.title}
                  onChange={onTitleChange(loc)}
                  className='h-9 rounded-md border px-3 text-sm shadow-sm'
                  placeholder='Title'
                />

                <label className='font-medium text-sm' htmlFor={`body-${loc}`}>
                  Markdown ({loc.toUpperCase()})
                </label>

                <textarea
                  id={`body-${loc}`}
                  value={tr.bodyMd}
                  onChange={onBodyChange(loc)}
                  className='min-h-60 rounded-md border p-3 text-sm shadow-sm'
                  placeholder='# Heading\n\nWrite markdown here...'
                />

                <div className='mt-2 rounded-md border p-3'>
                  <p className='mb-2 font-medium text-sm'>Preview</p>

                  <div className='prose max-w-none prose-ol:my-2 prose-p:my-2 prose-ul:my-2 prose-headings:mt-4 prose-headings:mb-2'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{tr.bodyMd || ''}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      <div className='flex flex-wrap items-center gap-2 pt-2'>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.replace('/admin', { locale })}
          disabled={disabled}
        >
          {(t as unknown as (k: string) => string)('cancel') ?? 'Cancel'}
        </Button>
        <Button type='button' onClick={onSave} disabled={disabled || validLocales.length === 0}>
          Save
        </Button>
        <Button type='button' variant='secondary' onClick={onPublish} disabled={disabled || validLocales.length === 0}>
          Publish
        </Button>
      </div>
    </div>
  )
}
