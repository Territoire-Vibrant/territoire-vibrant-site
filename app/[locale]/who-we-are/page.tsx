import type { Metadata } from 'next'
import { type Locale, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

import Community from '~/assets/images/home/hero/community.jpg'
import Landscape from '~/assets/images/home/hero/landscape.png'
import Marco from '~/assets/images/members/marco.jpg'
import Pedro from '~/assets/images/members/pedro.png'

import { Section } from '~/layouts/Section'
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
    <>
      <Section className='flex w-full flex-col items-center gap-10 px-6 py-12 lg:flex-row-reverse lg:py-16'>
        <Image
          src={Community}
          alt={t('Home.hero.box2.community_image_alt')}
          className='aspect-[4/3] w-full rounded-xl object-cover lg:w-1/2'
          priority
        />

        <div className='space-y-6 lg:w-1/2'>
          <h1 className='font-bold text-3xl tracking-tight sm:text-4xl'>{t('who_we_are')}</h1>

          <div className='space-y-4 text-neutral-700'>
            <p>{t('WhoWeAre.intro.p1')}</p>
            <p>{t('WhoWeAre.intro.p2')}</p>
            <p>{t('WhoWeAre.intro.p3')}</p>
          </div>
        </div>
      </Section>

      <Section className='flex w-full flex-col items-center gap-10 px-6 py-12 lg:flex-row lg:py-16'>
        <Image
          src={Landscape}
          alt={t('Home.hero.box2.landscape_image_alt')}
          className='aspect-[4/3] w-full rounded-xl object-cover lg:w-1/2'
        />

        <div className='space-y-6 lg:w-1/2'>
          <h2 className='font-bold text-3xl tracking-tight sm:text-4xl'>{t('WhoWeAre.network.chip')}</h2>

          <div className='space-y-4 text-neutral-700'>
            <p>{t('WhoWeAre.network.p1')}</p>
            <p>{t('WhoWeAre.network.p2')}</p>
          </div>
        </div>
      </Section>

      <Section className='flex w-full flex-col items-center space-y-8 px-6 py-12'>
        <h2 className='font-semibold text-2xl tracking-tight'>{t('WhoWeAre.team.title')}</h2>

        <div className='grid gap-6 lg:grid-cols-3 sm:grid-cols-2'>
          <TeamCard
            name={t('WhoWeAre.team.marco.name')}
            position={t('WhoWeAre.team.marco.role')}
            bio={t('WhoWeAre.team.marco.bio')}
            image={Marco}
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
            image={Pedro}
          />
        </div>
      </Section>

      <Section className='flex w-full flex-col items-center space-y-8 px-6 py-12 lg:py-16'>
        <blockquote className='space-y-2 rounded-xl border border-neutral-200 bg-green-200 p-6 text-green-800'>
          <p>• {t('WhoWeAre.manifesto.p1')}</p>
          <p className='font-medium'>{t('WhoWeAre.manifesto.p2')}</p>
          <p className='italic'>{t('WhoWeAre.highlight')}</p>
        </blockquote>
      </Section>
    </>
  )
}
