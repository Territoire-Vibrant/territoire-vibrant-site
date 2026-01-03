'use client'

import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import { useTranslations } from 'next-intl'

import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel'

export const HeroTextCarousel = () => {
  const t = useTranslations()

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: (scrollSnaps) => scrollSnaps.map((_, i) => (i === 0 ? 20000 : 10000)),
          stopOnInteraction: false,
        }),
        Fade(),
      ]}
      className='max-w-115 select-none md:w-1/2'
    >
      <CarouselContent>
        <CarouselItem className='flex items-center justify-center'>
          <div className='flex flex-col gap-6'>
            <h1 className='flex size-full flex-col gap-2 text-center font-bold text-2xl md:flex-row md:flex-wrap md:items-start md:text-start lg:text-3xl'>
              {t.rich('Home.hero.h1.title', {
                v: (chunks) => (
                  <span className='tv-vibrate-5s text-3xl text-primary leading-8 lg:text-4xl'>{chunks}</span>
                ),
              })}
            </h1>

            <p className='size-full whitespace-pre-line text-center opacity-80 md:text-start md:text-xl'>
              {t('Home.hero.h1.subtext')}
            </p>
          </div>
        </CarouselItem>

        <CarouselItem className='flex items-center justify-center'>
          <div className='flex flex-col gap-6'>
            <h2 className='flex size-full flex-col gap-2 text-center font-bold text-2xl md:flex-row md:flex-wrap md:items-start md:text-start lg:text-3xl'>
              {t.rich('Home.hero.h2.title', {
                v: (chunks) => (
                  <span className='tv-vibrate-5s text-3xl text-primary leading-8 lg:text-4xl'>{chunks}</span>
                ),
              })}
            </h2>

            <p className='size-full whitespace-pre-line text-center opacity-80 md:text-start md:text-xl'>
              {t('Home.hero.h2.subtext')}
            </p>
          </div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
