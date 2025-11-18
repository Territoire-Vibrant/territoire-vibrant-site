'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import z from 'zod'

import { CheckIcon, ClockIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

import { useRouter } from '~/i18n/navigation'
import { api } from '~/trpc/react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { PublicationSchema } from './schema'

const LOCALES = ['en', 'es', 'fr', 'pt'] as const
const LOCALE_LABEL_KEYS = {
  en: 'english',
  es: 'spanish',
  fr: 'french',
  pt: 'portuguese',
} as const

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

type ArticleFormProps = {
  mode: 'create' | 'edit'
  defaultValues?: ArticleFormInitial
}

const ArticleFormSchema = z.object({
  translations: z.array(PublicationSchema),
})

type ArticleFormValues = z.infer<typeof ArticleFormSchema>

export const ArticleForm = ({ mode, defaultValues }: ArticleFormProps) => {
  const t = useTranslations()
  const locale = useLocale() as 'en' | 'es' | 'fr' | 'pt'
  const router = useRouter()

  const [status, setStatus] = useState<ArticleFormInitial['status']>(defaultValues?.status ?? 'DRAFT')
  const [activeLocale, setActiveLocale] = useState<(typeof LOCALES)[number]>(locale)
  // Track which locale tabs have been successfully saved (persisted)
  const [savedLocales, setSavedLocales] = useState<Set<string>>(
    () => new Set(defaultValues?.translations?.filter((t) => t.title && t.bodyMd).map((t) => t.locale) ?? [])
  )

  const createMutation = api.article.createArticle.useMutation()
  const updateMutation = api.article.updateArticle.useMutation()

  const defaultTranslations: TranslationInput[] = LOCALES.map(
    (loc) => defaultValues?.translations?.find((tr) => tr.locale === loc) ?? { locale: loc, title: '', bodyMd: '' }
  )

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleFormSchema),
    defaultValues: { translations: defaultTranslations },
    mode: 'onChange',
  })

  const disabled = createMutation.isPending || updateMutation.isPending || isSubmitting

  const watchTranslations = watch('translations') ?? []

  const validLocales = useMemo(() => {
    return watchTranslations
      .filter((tr: TranslationInput) => PublicationSchema.safeParse(tr).success)
      .map((tr: TranslationInput) => tr.locale)
  }, [watchTranslations])

  const buildPayload = (values: ArticleFormValues, overrideStatus?: ArticleFormInitial['status']) => ({
    status: overrideStatus ?? status,
    translations: (values.translations ?? [])
      .filter((tr) => PublicationSchema.safeParse(tr).success)
      .map((tr) => ({ ...tr, published: (overrideStatus ?? status) === 'PUBLISHED' })),
  })

  const persist = async (nextStatus: ArticleFormInitial['status'], values: ArticleFormValues) => {
    const payload = buildPayload(values, nextStatus)

    if (mode === 'create') {
      const res = await createMutation.mutateAsync(payload)

      setSavedLocales(new Set(payload.translations.map((t) => t.locale)))

      // After creating, go to the edit page for the primary locale
      if (res?.id) {
        router.replace(`/admin/publication/${res.id}`, { locale })
      } else {
        router.replace('/admin', { locale })
      }
    } else if (mode === 'edit' && defaultValues?.articleId) {
      const res = await updateMutation.mutateAsync({ articleId: defaultValues.articleId, ...payload })

      setSavedLocales(new Set(res?.translations.map((t) => t.locale) ?? []))

      if (nextStatus === 'PUBLISHED') {
        router.replace('/admin', { locale })
      }
    }
  }

  const onSave = handleSubmit(async (values: ArticleFormValues) => {
    await persist(status === 'PUBLISHED' ? 'DRAFT' : status, values)
  })

  const onPublish = handleSubmit(async (values: ArticleFormValues) => {
    setStatus('PUBLISHED')
    await persist('PUBLISHED', values)
  })

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <label htmlFor='status' className='font-medium text-sm'>
          {t('status')}
        </label>

        <Select value={status} onValueChange={(value) => setStatus(value as ArticleFormInitial['status'])}>
          <SelectTrigger size='sm' className='w-fit'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='DRAFT'>{t('publish_status.DRAFT')}</SelectItem>
            <SelectItem value='PUBLISHED'>{t('publish_status.PUBLISHED')}</SelectItem>
            <SelectItem value='ARCHIVED'>{t('publish_status.ARCHIVED')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeLocale} onValueChange={(v) => setActiveLocale(v as (typeof LOCALES)[number])}>
        <TabsList className='w-full'>
          {LOCALES.map((loc) => {
            const isValid = validLocales.includes(loc)
            const isSaved = savedLocales.has(loc)
            const localeLabelKey = LOCALE_LABEL_KEYS[loc]

            return (
              <TabsTrigger key={loc} value={loc} className='flex w-full items-center gap-1'>
                {isValid && isSaved ? (
                  <CheckIcon className='mt-0.5 size-4 text-primary' />
                ) : (
                  <ClockIcon className='mt-0.5' />
                )}
                {localeLabelKey ? t(localeLabelKey) : loc.toUpperCase()}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {LOCALES.map((loc) => {
          const tr = (watchTranslations[LOCALES.indexOf(loc)] as TranslationInput) ?? {
            locale: loc,
            title: '',
            bodyMd: '',
          }

          return (
            <TabsContent key={loc} value={loc} className='mt-4 flex w-full flex-col gap-6 lg:flex-row'>
              <div className='flex w-full flex-col gap-3'>
                <label className='font-medium text-sm' htmlFor={`title-${loc}`}>
                  Title ({loc.toUpperCase()})
                </label>

                <input
                  id={`title-${loc}`}
                  type='text'
                  className='h-9 rounded-md border px-3 text-sm shadow-sm'
                  placeholder='Title'
                  {...register(`translations.${LOCALES.indexOf(loc)}.title`, {
                    onChange: () =>
                      setSavedLocales((prev) => {
                        if (prev.has(loc)) {
                          const next = new Set(prev)
                          next.delete(loc)
                          return next
                        }
                        return prev
                      }),
                  })}
                />

                {errors.translations?.[LOCALES.indexOf(loc)]?.title && (
                  <p className='text-destructive text-xs'>
                    {String(errors.translations?.[LOCALES.indexOf(loc)]?.title?.message)}
                  </p>
                )}

                <div className='flex flex-col gap-3'>
                  <label className='font-medium text-sm' htmlFor={`body-${loc}`}>
                    Markdown ({loc.toUpperCase()})
                  </label>

                  <textarea
                    id={`body-${loc}`}
                    className='min-h-60 resize-none rounded-md border p-3 text-sm shadow-sm'
                    placeholder='Write markdown here...'
                    {...register(`translations.${LOCALES.indexOf(loc)}.bodyMd`, {
                      onChange: () =>
                        setSavedLocales((prev) => {
                          if (prev.has(loc)) {
                            const next = new Set(prev)
                            next.delete(loc)
                            return next
                          }
                          return prev
                        }),
                    })}
                  />

                  {errors.translations?.[LOCALES.indexOf(loc)]?.bodyMd && (
                    <p className='text-destructive text-xs'>
                      {String(errors.translations?.[LOCALES.indexOf(loc)]?.bodyMd?.message)}
                    </p>
                  )}
                </div>
              </div>

              <div className='mt-8 w-full rounded-md border p-3'>
                <p className='mb-2 font-medium text-sm'>Preview</p>

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {(getValues(`translations.${LOCALES.indexOf(loc)}.bodyMd`) as string) || ''}
                </ReactMarkdown>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      <div className='flex items-center gap-2 pt-2'>
        <Button
          type='button'
          variant='outline'
          disabled={disabled}
          onClick={() => router.replace('/admin', { locale })}
        >
          <XIcon />
          {t('cancel')}
        </Button>

        <Button type='button' disabled={disabled || validLocales.length === 0} onClick={onSave}>
          <ClockIcon /> {t('save')}
        </Button>

        <Button type='button' disabled={disabled || validLocales.length === 0} onClick={onPublish}>
          <CheckIcon /> {t('publish')}
        </Button>
      </div>
    </div>
  )
}
