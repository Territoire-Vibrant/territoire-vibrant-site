'use client'

import { useLocale, useTranslations } from 'next-intl'
import { type ChangeEvent, useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

import { useRouter } from '~/i18n/navigation'
import { api } from '~/trpc/react'

const LOCALES = ['en', 'es', 'fr', 'pt'] as const

export type TranslationInput = {
  locale: (typeof LOCALES)[number]
  title: string
  slug: string
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

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function ArticleForm({ mode, initial }: Props) {
  const t = useTranslations()
  const locale = useLocale() as 'en' | 'es' | 'fr' | 'pt'
  const router = useRouter()

  const [status, setStatus] = useState<ArticleFormInitial['status']>(initial?.status ?? 'DRAFT')
  const [activeLocale, setActiveLocale] = useState<(typeof LOCALES)[number]>(locale)
  const [translations, setTranslations] = useState<TranslationInput[]>(
    LOCALES.map(
      (loc) =>
        initial?.translations?.find((tr) => tr.locale === loc) ?? { locale: loc, title: '', slug: '', bodyMd: '' }
    )
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
    },
    []
  )

  const onTitleChange = (loc: (typeof LOCALES)[number]) => (e: ChangeEvent<HTMLInputElement>) => {
    const nextTitle = e.target.value
    onChangeField(loc, 'title', nextTitle)
    // Autogenerate slug if empty
    const current = translations.find((tr) => tr.locale === loc)
    if (current && !current.slug) onChangeField(loc, 'slug', slugify(nextTitle))
  }

  const onSlugChange = (loc: (typeof LOCALES)[number]) => (e: ChangeEvent<HTMLInputElement>) => {
    onChangeField(loc, 'slug', slugify(e.target.value))
  }

  const onBodyChange = (loc: (typeof LOCALES)[number]) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeField(loc, 'bodyMd', e.target.value)
  }

  const disabled = createMutation.isPending || updateMutation.isPending

  const onSubmit = async () => {
    const payload = {
      status,
      translations: translations
        .filter((tr) => tr.title && tr.slug && tr.bodyMd)
        .map((tr) => ({ ...tr, published: status === 'PUBLISHED' })),
    }

    if (mode === 'create') {
      const res = await createMutation.mutateAsync(payload)
      const primary = res.translations.find((tr) => tr.locale === locale) ?? res.translations[0]

      if (primary) {
        router.replace(`/admin/publication/${primary.slug}`, { locale })
      } else {
        router.replace('/admin', { locale })
      }
    } else if (mode === 'edit' && initial?.articleId) {
      await updateMutation.mutateAsync({ articleId: initial.articleId, ...payload })

      router.replace('/admin', { locale })
    }
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
          {LOCALES.map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {loc.toUpperCase()}
            </TabsTrigger>
          ))}
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

                <label className='font-medium text-sm' htmlFor={`slug-${loc}`}>
                  Slug ({loc.toUpperCase()})
                </label>

                <input
                  id={`slug-${loc}`}
                  type='text'
                  value={tr.slug}
                  onChange={onSlugChange(loc)}
                  className='h-9 rounded-md border px-3 text-sm shadow-sm'
                  placeholder='my-article'
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

      <div className='flex items-center gap-2'>
        <Button onClick={onSubmit} disabled={disabled}>
          {mode === 'create' ? t('create') : 'Save'}
        </Button>

        <Button variant='outline' onClick={() => router.replace('/admin', { locale })} disabled={disabled}>
          {(t as unknown as (k: string) => string)('cancel') ?? 'Cancel'}
        </Button>
      </div>
    </div>
  )
}
