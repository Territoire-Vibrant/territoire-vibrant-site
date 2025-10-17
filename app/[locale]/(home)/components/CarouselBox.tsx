'use client'

import Autoplay from 'embla-carousel-autoplay'
import { useTranslations } from 'next-intl'

import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel'

import { Link } from '~/i18n/navigation'

export const CarouselBox = () => {
  const t = useTranslations()

  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
      className='flex size-full'
    >
      <CarouselContent className='size-full'>
        <CarouselItem className='flex flex-col justify-between space-y-4 '>
          <div className='w-3/4 font-bold text-xl'>{t('Home.hero.box4_slide1.title')}</div>

          <p className='opacity-80'>{t('Home.hero.box4_slide1.subtext')}</p>

          <Link href='#' className='w-fit underline opacity-80'>
            {t('find_out_more')}
          </Link>
        </CarouselItem>

        <CarouselItem className='flex flex-col justify-between space-y-4 '>
          <div className='w-3/4 font-bold text-xl'>{t('Home.hero.box4_slide2.title')}</div>

          <p className='opacity-80'>{t('Home.hero.box4_slide2.subtext')}</p>

          <Link href='#' className='w-fit underline opacity-80'>
            {t('find_out_more')}
          </Link>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
