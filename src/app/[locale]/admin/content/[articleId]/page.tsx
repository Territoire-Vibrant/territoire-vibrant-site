import { getTranslations } from 'next-intl/server'

import { ArticleForm, type ArticleFormInitial } from '../components/ArticleForm'

import { api } from '~/trpc/server'

export default async function PublicationEditPage({
  params,
}: {
  params: Promise<{
    articleId: string
    locale: string
  }>
}) {
  const { articleId } = await params

  await getTranslations() // ensure messages available for client form

  const data = await api.article.getArticleForEdit({ articleId })

  const defaultValues: ArticleFormInitial | undefined = data
    ? {
        articleId: data.article.id,
        status: data.article.status,
        translations: data.article.translations.map((tr) => ({
          locale: tr.locale,
          title: tr.title,
          bodyMd: tr.bodyMd,
          published: tr.published ?? false,
        })),
      }
    : undefined

  return (
    <div className='mx-auto w-full max-w-6xl px-6 py-10'>
      <ArticleForm mode='edit' defaultValues={defaultValues} />
    </div>
  )
}
