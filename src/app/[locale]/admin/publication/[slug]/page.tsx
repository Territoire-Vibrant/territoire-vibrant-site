import { getTranslations } from 'next-intl/server'

import { redirect } from '~/i18n/navigation'
import { api } from '~/trpc/server'

type Props = {
  params: { slug: string; locale: string }
}

export default async function PublicationDetailsPage({ params }: Props) {
  const t = await getTranslations()
  const { slug, locale } = params

  const data = await api.article.getArticleBySlug({ slug, locale: locale as 'en' | 'es' | 'fr' | 'pt' })

  if (!data) {
    redirect({ href: '/admin', locale: locale as 'en' | 'es' | 'fr' | 'pt' })
  }

  return (
    <div className='mx-auto max-w-2xl px-6 py-10'>
      {data && (
        <>
          <h1 className='font-bold text-3xl'>{data.title}</h1>

          <p className='mt-2 text-muted-foreground text-xs'>
            {t('status')}: {(t as unknown as (k: string) => string)(`publish_status.${data.article.status}`)}
          </p>

          <article className='prose mt-6'>
            {data.bodyMd.split('\n').map((paragraph: string) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </article>
        </>
      )}
    </div>
  )
}
