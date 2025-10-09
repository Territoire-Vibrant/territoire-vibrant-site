import { useTranslations } from 'next-intl'
import Image from 'next/image'

import CommunityImage from '~/assets/images/community.jpg'
import LandscapeImage from '~/assets/images/landscape.png'

import { CarouselBox } from './components/CarouselBox'

import { Link } from '~/i18n/navigation'

export const Hero = () => {
  const t = useTranslations()

  return (
    <section className='flex w-full flex-col items-center justify-between gap-10 px-6 py-12 md:flex-row lg:py-16'>
      {/* Hero text */}
      <div className='flex flex-col gap-6 md:w-1/2'>
        <h1 className='size-full text-center font-bold text-3xl md:text-start lg:text-4xl'>{t('Hero.h1')}</h1>

        <h2 className='size-full text-center text-2xl text-neutral-600 md:text-start'>{t('Hero.h2')}</h2>
      </div>

      {/* Hero grid */}
      <div className='grid size-full gap-4 lg:max-h-[450px] md:w-1/2 md:grid-cols-2 md:grid-rows-3'>
        {/* Box 1 - Green text */}
        <div className='flex size-full flex-col justify-between space-y-4 rounded-2xl bg-green-200 p-4 text-green-800 md:row-span-2'>
          <div className='w-3/4 font-bold text-xl'>{t('Hero.box1.title')}</div>

          <p className='opacity-80'>{t('Hero.box1.subtext')}</p>

          <Link href='#' className='w-fit underline opacity-80'>
            {t('find_out_more')}
          </Link>
        </div>

        {/* Box 2 - Community image */}
        <div className='size-full rounded-2xl md:col-start-2 md:row-start-1'>
          <Image
            src={CommunityImage}
            alt='Beautiful community'
            className='size-full max-h-36 rounded-2xl object-cover md:max-h-full sm:max-h-40'
          />
        </div>

        {/* Box 3 - Landscape image */}
        <div className='size-full max-h-36 rounded-2xl md:row-start-3'>
          <Image
            src={LandscapeImage}
            alt='Beautiful landscape'
            className='size-full max-h-36 rounded-2xl object-cover md:max-h-full sm:max-h-40'
          />
        </div>

        {/* Box 4 - Carousel */}
        <div className='size-full select-none rounded-2xl bg-neutral-200 p-4 text-neutral-800 md:col-start-2 md:row-span-2 md:row-start-2'>
          <CarouselBox />
        </div>
      </div>
    </section>
  )
}
