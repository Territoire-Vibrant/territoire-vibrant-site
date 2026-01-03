import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '~/i18n/navigation'

import CommunityImage from '~/assets/images/home/hero/community.jpg'
import LandscapeImage from '~/assets/images/home/intro/landscape.jpg'

import { CarouselBox } from '../CarouselBox'
import { HeroTextCarousel } from './components/HeroTextCarousel'

export const HomeHero = () => {
  const t = useTranslations()

  return (
    <>
      <HeroTextCarousel />

      {/* Hero grid */}
      <div className='grid size-full gap-4 lg:max-h-102.5 md:w-1/2 md:grid-cols-2 md:grid-rows-3'>
        {/* Box 1 - Green text */}
        <div className='order-1 flex size-full flex-col justify-between space-y-4 rounded-2xl bg-primary/60 p-4 md:row-span-2'>
          <div className='w-3/4 font-bold text-xl'>{t('Home.hero.box1.title')}</div>

          <p className='opacity-80'>{t('Home.hero.box1.subtext')}</p>

          <Link href='/#projects' className='w-fit text-xs underline opacity-80'>
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
        <div className='order-3 size-full select-none rounded-2xl bg-[#4b3223]/75 p-4 text-background md:col-start-2 md:row-span-2 md:row-start-2'>
          <CarouselBox />
        </div>
      </div>
    </>
  )
}
