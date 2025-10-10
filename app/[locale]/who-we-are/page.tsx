import type { Metadata } from 'next'
import { type Locale, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import { TeamCard } from './components/TeamCard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale })

  return {
    title: `${t('who_we_are')} - ${t('territoire_vibrant')}`,
  }
}

export default function WhoWeArePage() {
  const t = useTranslations()

  return (
    <div className='px-4 py-12'>
      <header className='mb-10'>
        <h1 className='font-bold text-3xl text-neutral-900 tracking-tight sm:text-4xl'>{t('who_we_are')}</h1>
      </header>

      <section className='max-w-none space-y-4 text-neutral-800 dark:text-neutral-200'>
        <p>{t('WhoWeAre.intro.p1')}</p>
        <p>{t('WhoWeAre.intro.p2')}</p>
        <p>{t('WhoWeAre.intro.p3')}</p>
      </section>

      <section className='mt-14'>
        <div className='mb-4 inline-flex items-center gap-2 bg-neutral-100 px-3 py-1 font-medium text-neutral-700 text-sm'>
          <span aria-hidden>🔸</span>
          {t('WhoWeAre.network.chip')}
        </div>

        <div className='max-w-none space-y-4 text-neutral-800 dark:text-neutral-200'>
          <p>{t('WhoWeAre.network.p1')}</p>
          <p>{t('WhoWeAre.network.p2')}</p>
        </div>
      </section>

      <section className='mt-14'>
        <h2 className='font-semibold text-2xl text-neutral-900 tracking-tight'>{t('WhoWeAre.team.title')}</h2>

        <div className='mt-6 grid gap-6 lg:grid-cols-3 sm:grid-cols-2'>
          <TeamCard
            name={t('WhoWeAre.team.marco.name')}
            position={t('WhoWeAre.team.marco.role')}
            bio={t('WhoWeAre.team.marco.bio')}
          />

          <TeamCard
            name={t('WhoWeAre.team.lilliam.name')}
            position={t('WhoWeAre.team.lilliam.role')}
            bio={t('WhoWeAre.team.lilliam.bio')}
          />

          <TeamCard
            name={t('WhoWeAre.team.pedro.name')}
            position={t('WhoWeAre.team.pedro.role')}
            bio={t('WhoWeAre.team.pedro.bio')}
          />
        </div>
      </section>

      <section className='mt-14 max-w-none space-y-4 text-neutral-800 dark:text-neutral-200'>
        <p>{t('WhoWeAre.manifesto.p1')}</p>
        <p>{t('WhoWeAre.manifesto.p2')}</p>
      </section>

      <section className='mt-12'>
        <div className='rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-6 text-center'>
          <p className='font-semibold text-base text-neutral-900'>{t('WhoWeAre.highlight')}</p>
        </div>
      </section>
    </div>
  )
}
