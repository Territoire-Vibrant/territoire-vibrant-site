import { useTranslations } from 'next-intl'
import Image from 'next/image'

import CommunityImage from '~/assets/images/home/hero/community.jpg'
import LandscapeImage from '~/assets/images/home/intro/landscape.jpg'
import ProjectOneImage from '~/assets/images/projects/project_1.jpg'

import { BrandName } from '~/app/[locale]/(home)/components/BrandName'
import { Section } from '~/layouts/Section'
import { CarouselBox } from './components/CarouselBox'
import { ProjectCard } from './components/ProjectCard'
import { SponsorsMarquee } from './components/SponsorsMarquee'

import { Link } from '~/i18n/navigation'

export default function Home() {
  const t = useTranslations()

  return (
    <>
      <Section className='flex w-full flex-col items-center justify-between gap-24 px-6 py-12 md:flex-row'>
        {/* Hero text */}
        <div className='flex flex-col gap-6 md:w-1/2'>
          <h1 className='flex size-full flex-col text-center font-bold text-3xl md:text-start lg:text-4xl'>
            <BrandName label={t('territoire_vibrant')} />
            <span className='text-primary lg:text-3xl'>{t('Home.hero.h1')}</span>
          </h1>

          <h2 className='size-full text-center text-2xl opacity-80 md:text-start'>{t('Home.hero.h2')}</h2>
        </div>

        {/* Hero grid */}
        <div className='grid size-full gap-4 lg:max-h-[400px] md:w-1/2 md:grid-cols-2 md:grid-rows-3'>
          {/* Box 1 - Green text */}
          <div className='order-1 flex size-full flex-col justify-between space-y-4 rounded-2xl bg-primary/60 p-4 md:row-span-2'>
            <div className='w-3/4 font-bold text-xl'>{t('Home.hero.box1.title')}</div>

            <p className='opacity-80'>{t('Home.hero.box1.subtext')}</p>

            <Link href='#' className='w-fit underline opacity-80'>
              {t('find_out_more')}
            </Link>
          </div>

          {/* Box 2 - Community image */}
          <div className='order-2 size-full rounded-2xl md:col-start-2 md:row-start-1'>
            <Image
              src={CommunityImage}
              alt={t('Home.hero.box2.community_image_alt')}
              className='size-full max-h-36 rounded-2xl object-cover md:max-h-full sm:max-h-40'
            />
          </div>

          {/* Box 3 - Landscape image */}
          <div className='size-full max-h-36 rounded-2xl md:row-start-3'>
            <Image
              src={LandscapeImage}
              alt={t('Home.hero.box2.landscape_image_alt')}
              className='size-full max-h-36 rounded-2xl object-cover md:max-h-full sm:max-h-40'
            />
          </div>

          {/* Box 4 - Carousel */}
          <div className='order-3 size-full select-none rounded-2xl bg-[#4b3223]/75 p-4 text-white md:col-start-2 md:row-span-2 md:row-start-2'>
            <CarouselBox />
          </div>
        </div>
      </Section>

      <Section limitWidth={false} className='flex justify-center bg-foreground'>
        <SponsorsMarquee />
      </Section>

      <Section
        limitWidth={false}
        className='flex flex-col items-center justify-center space-y-8 bg-foreground px-6 py-12'
      >
        <h3 className='font-bold text-2xl text-white'>{t('projects')}</h3>

        <div className='grid max-w-6xl grid-cols-1 place-items-center gap-8 lg:grid-cols-3 md:grid-cols-2 md:gap-4'>
          <ProjectCard
            image={ProjectOneImage}
            title={t('Home.projects.project_1.title')}
            description={t('Home.projects.project_1.description')}
          />
          <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_2.title')}
            description={t('Home.projects.project_2.description')}
          />
          <ProjectCard
            image={ProjectOneImage}
            title={t('Home.projects.project_1.title')}
            description={t('Home.projects.project_1.description')}
          />
          <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_2.title')}
            description={t('Home.projects.project_2.description')}
          />
          <ProjectCard
            image={ProjectOneImage}
            title={t('Home.projects.project_1.title')}
            description={t('Home.projects.project_1.description')}
          />
          <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_2.title')}
            description={t('Home.projects.project_2.description')}
          />
          {/* <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_3.title')}
            description={t('Home.projects.project_3.description')}
          />
          <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_4.title')}
            description={t('Home.projects.project_4.description')}
          />
          <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_5.title')}
            description={t('Home.projects.project_5.description')}
          />
          <ProjectCard
            image={CommunityImage}
            title={t('Home.projects.project_6.title')}
            description={t('Home.projects.project_6.description')}
          /> */}
        </div>
      </Section>
    </>
  )
}
