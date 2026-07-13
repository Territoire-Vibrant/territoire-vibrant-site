import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'

import HomeBanner1 from '~/assets/images/home/home_banner_1.png'
import HomeBanner2 from '~/assets/images/home/home_banner_2.png'
import ProjectOneImage from '~/assets/images/projects/project_1.png'
import ProjectTwoImage from '~/assets/images/projects/project_2.png'
import ProjectThreeImage from '~/assets/images/projects/project_3.png'

import { Section } from '~/layouts/Section'
import { BannerCarousel } from './components/BannerCarousel'
import { ContactSection } from './components/ContactSection'
import { HomeHero } from './components/HomeHero'
import { ProjectCard } from './components/ProjectCard'
import { ServicesSection } from './components/ServicesSection'
import { SponsorsMarquee } from './components/SponsorsMarquee'
import { StatsSection } from './components/StatsSection'

import { Link } from '~/i18n/navigation'

export const metadata: Metadata = {
  title: 'Territoire Vibrant',
  description: 'Territoire Vibrant creates cultural and territorial projects.',
}

export default function HomePage() {
  const t = useTranslations()

  return (
    <>
      <Section className='max-w-[1180px]! px-6 py-12 lg:py-14'>
        <HomeHero />
      </Section>

      <Section limitWidth={false} className='bg-[#f1f4ec] px-6 py-8'>
        <div className='mx-auto w-full max-w-[1240px]'>
          <StatsSection />
        </div>
      </Section>

      <Section className='max-w-[1180px]! border-border/50 border-t px-6 py-5'>
        <div className='flex flex-col items-center gap-6 md:flex-row md:justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-xl'>🌐</span>
            <p className='max-w-sm text-muted-foreground text-sm leading-snug'>{t('Home.developed_between')}</p>
          </div>

          <SponsorsMarquee className='max-w-xl' />
        </div>
      </Section>

      <Section
        id='projects'
        limitWidth={false}
        className='flex flex-col items-center justify-center gap-y-8 bg-foreground px-12 pt-6 pb-12'
      >
        <div className='flex w-full max-w-4xl flex-col items-center justify-between gap-y-8 px-4 text-center md:flex-row'>
          <h3 className='font-semibold text-2xl text-background'>{t('featured_projects')}</h3>

          <div className='transition-all ease-in hover:-mt-1'>
            <Link
              href='/more-projects'
              prefetch
              className='bg-background px-4 py-3 font-semibold text-foreground text-sm transition-all ease-in hover:bg-primary hover:text-background'
            >
              {t('more_projects')}
            </Link>
          </div>
        </div>

        <div className='grid max-w-6xl grid-cols-1 place-items-center gap-8 md:grid-cols-2 md:gap-4 lg:grid-cols-3'>
          <ProjectCard
            image={ProjectOneImage}
            title={t('Home.projects.project_1.title')}
            description={t('Home.projects.project_1.description')}
          />
          <ProjectCard
            image={ProjectTwoImage}
            title={t('Home.projects.project_2.title')}
            description={t('Home.projects.project_2.description')}
          />
          <ProjectCard
            image={ProjectThreeImage}
            title={t('Home.projects.project_3.title')}
            description={t('Home.projects.project_3.description')}
          />
        </div>
      </Section>

      <ServicesSection />

      <Section className='px-6 py-12'>
        <BannerCarousel
          slides={[
            {
              src: HomeBanner1,
              alt: 'Banner 1',
              topSentence: t('Home.banner_sentence_1'),
              bottomSentence: `Mac Neves | ${t('territoire_vibrant')} ${t('founder')}`,
            },
            {
              src: HomeBanner2,
              alt: 'Banner 2',
              topSentence: t('Home.banner_sentence_2'),
              bottomSentence: `Mac Neves | ${t('territoire_vibrant')} ${t('architect_of_Territories')}`,
            },
          ]}
        />
      </Section>

      <ContactSection />
    </>
  )
}
