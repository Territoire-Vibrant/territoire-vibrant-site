import { useTranslations } from 'next-intl'

import HomeBanner1 from '~/assets/images/home/home_banner_1.png'
import HomeBanner2 from '~/assets/images/home/home_banner_2.png'
import ProjectOneImage from '~/assets/images/projects/project_1.png'
import ProjectTwoImage from '~/assets/images/projects/project_2.png'
import ProjectThreeImage from '~/assets/images/projects/project_3.png'

import { Section } from '~/layouts/Section'
import { BannerCarousel } from './components/BannerCarousel'
import { HomeHero } from './components/HomeHero'
import { ProjectCard } from './components/ProjectCard'
import { ServicesSection } from './components/ServicesSection'
import { SponsorsMarquee } from './components/SponsorsMarquee'

import { Link } from '~/i18n/navigation'

export default function HomePage() {
  const t = useTranslations()

  return (
    <>
      <Section className='flex w-full flex-col items-center justify-between gap-24 px-6 py-12 md:flex-row'>
        <HomeHero />
      </Section>

      <Section limitWidth={false} className='flex flex-col items-center bg-foreground'>
        <div className='relative w-full max-w-6xl'>
          <p className='absolute top-0 left-12 z-10 bg-secondary px-4 py-2 font-medium text-foreground text-sm lg:left-4'>
            {t('partners')}
          </p>
        </div>

        <SponsorsMarquee />
      </Section>

      <Section
        id='projects'
        limitWidth={false}
        className='flex flex-col items-center justify-center space-y-8 bg-foreground px-12 pb-12'
      >
        <div className='flex w-full max-w-4xl flex-col items-center justify-between space-y-8 px-4 text-center md:flex-row md:space-y-0'>
          <h3 className='font-bold text-2xl text-background'>{t('featured_projects')}</h3>

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

      <Section id='contact' className='relative px-6 py-12'>
        Contact
      </Section>
    </>
  )
}
