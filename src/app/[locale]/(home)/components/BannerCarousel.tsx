'use client'

import Autoplay from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import Image, { type StaticImageData } from 'next/image'

import { Carousel, CarouselContent, CarouselItem } from '~/components/ui/carousel'

export type BannerSlide = {
  src: StaticImageData | string
  alt?: string
  topSentence: string
  bottomSentence: string
}

export function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnInteraction: false,
          stopOnMouseEnter: false,
        }),
        Fade(),
      ]}
      className='w-full'
    >
      <CarouselContent className='ml-0 grid grid-cols-1 *:pl-0'>
        {slides.map((slide, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <CarouselItem key={i} className='col-start-1 row-start-1'>
            <div className='flex flex-col'>
              <p className='py-3 text-center font-medium md:text-2xl'>{slide.topSentence}</p>

              <div className='relative aspect-21/9 w-full overflow-hidden rounded-xl'>
                <Image
                  src={slide.src}
                  alt={slide.alt ?? `Banner ${i + 1}`}
                  fill
                  sizes='100vw'
                  priority={i === 0}
                  className='object-cover'
                />
              </div>

              <p className='py-3 text-center text-sm md:text-xl'>{slide.bottomSentence}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
