import { getTranslations } from 'next-intl/server'

import { ArticleForm, type ArticleFormInitial } from '../../components/ArticleForm'

import { api } from '~/trpc/server'

type RouteParams = { slug: string; locale: string }
type PublicationEditPageProps = { params: RouteParams | Promise<RouteParams> }

export default async function PublicationEditPage({ params }: PublicationEditPageProps) {
  const { slug, locale } = await Promise.resolve(params)

  await getTranslations() // ensure messages available for client form

  const data = await api.article.getArticleForEditBySlug({ slug, locale: locale as 'en' | 'es' | 'fr' | 'pt' })

  const initial: ArticleFormInitial | undefined = data
    ? {
        articleId: data.article.id,
        status: data.article.status as any,
        translations: data.article.translations.map((tr) => ({
          locale: tr.locale as any,
          title: tr.title,
          slug: tr.slug,
          bodyMd: tr.bodyMd,
          published: tr.published ?? false,
        })),
      }
    : undefined

  return (
    <div className='mx-auto max-w-4xl px-6 py-10'>
      <ArticleForm mode='edit' initial={initial} />
    </div>
  )
}
