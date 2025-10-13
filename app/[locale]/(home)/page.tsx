import { useTranslations } from 'next-intl'
import Image from 'next/image'

import CommunityImage from '~/assets/images/home/hero/community.jpg'
import LandscapeImage from '~/assets/images/home/intro/landscape.jpg'

import { Button } from '~/components/ui/button'
import { Section } from '~/layouts/Section'
import { CarouselBox } from './components/CarouselBox'

import { Link } from '~/i18n/navigation'

export default function Home() {
  const t = useTranslations()

  return (
    <>
      <Section className='flex w-full flex-col items-center justify-between gap-10 px-6 py-12 md:flex-row lg:py-16'>
        {/* Hero text */}
        <div className='flex flex-col gap-6 md:w-1/2'>
          <h1 className='size-full text-center font-bold text-3xl md:text-start lg:text-4xl'>{t('Home_Hero.h1')}</h1>

          <h2 className='size-full text-center text-2xl text-neutral-600 md:text-start'>{t('Home_Hero.h2')}</h2>
        </div>

        {/* Hero grid */}
        <div className='grid size-full gap-4 lg:max-h-[450px] md:w-1/2 md:grid-cols-2 md:grid-rows-3'>
          {/* Box 1 - Green text */}
          <div className='order-1 flex size-full flex-col justify-between space-y-4 rounded-2xl bg-green-200 p-4 text-green-800 md:row-span-2'>
            <div className='w-3/4 font-bold text-xl'>{t('Home_Hero.box1.title')}</div>

            <p className='opacity-80'>{t('Home_Hero.box1.subtext')}</p>

            <Link href='#' className='w-fit underline opacity-80'>
              {t('find_out_more')}
            </Link>
          </div>

          {/* Box 2 - Community image */}
          <div className='order-2 size-full rounded-2xl md:col-start-2 md:row-start-1'>
            <Image
              src={CommunityImage}
              alt={t('Home_Hero.box2.community_image_alt')}
              className='size-full max-h-36 rounded-2xl object-cover md:max-h-full sm:max-h-40'
            />
          </div>

          {/* Box 3 - Landscape image */}
          <div className='size-full max-h-36 rounded-2xl md:row-start-3'>
            <Image
              src={LandscapeImage}
              alt={t('Home_Hero.box2.landscape_image_alt')}
              className='size-full max-h-36 rounded-2xl object-cover md:max-h-full sm:max-h-40'
            />
          </div>

          {/* Box 4 - Carousel */}
          <div className='order-3 size-full select-none rounded-2xl bg-neutral-200 p-4 text-neutral-800 md:col-start-2 md:row-span-2 md:row-start-2'>
            <CarouselBox />
          </div>
        </div>
      </Section>

      <Section className='w-full px-6 py-12 md:py-16'>
        <div className='mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2'>
          <div className='overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 md:order-none'>
            <Image
              src={LandscapeImage}
              alt={t('Home_Intro.image_alt')}
              className='h-64 w-full object-cover md:h-[360px]'
              priority
            />
          </div>

          <div className='flex flex-col items-center gap-6 text-center md:items-start md:text-left'>
            <p className='max-w-prose text-balance text-lg text-neutral-700 md:text-2xl'>{t('Home_Intro.p')}</p>

            <Button asChild size='lg'>
              <Link href='/who-we-are'>{t('Home_Intro.cta_label')}</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
