'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import Image from 'next/image'

import Inflorescence from '~/assets/images/partners/inflorescence.png'
import SoAndCo from '~/assets/images/partners/so&co.png'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'

import { cn } from '~/lib/utils'

export const SponsorsMarquee = ({
  className,
}: {
  className?: string
}) => {
  const items = [
    { id: 1, label: 'So&Co', logo: SoAndCo, url: 'https://www.soetco.ca/' },
    { id: 2, label: 'Inflorescence', logo: Inflorescence, url: 'http://www.cliniqueinflorescence.com/' },
  ]

  // Repeat the items to create a longer track so autoplay feels continuous even with few sponsors.
  const repeat = Math.max(12, items.length * 4)
  const track = Array.from({ length: repeat }, (_, i) => {
    const src = items[i % items.length]!
    return { ...src, key: `s-${i}-${src.id}` }
  })

  return (
    <Carousel
      className={cn('marquee-mask w-full max-w-7xl select-none overflow-x-clip px-12', className)}
      opts={{ loop: true, align: 'start', dragFree: true }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          speed: 1.3,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          stopOnFocusIn: false,
          startDelay: 0,
        }),
      ]}
    >
      <CarouselContent className='py-3'>
        {track.map((item, idx) => (
          <CarouselItem
            key={item.key ?? `${item.id}-${idx}`}
            className='basis-1/2 lg:basis-1/5 md:basis-1/4 sm:basis-1/3'
          >
            <a href={item.url} target='_blank' rel='noopener noreferrer'>
              <div className='flex h-full items-center justify-center'>
                <Image src={item.logo} alt={item.label} draggable={false} className='size-28 object-contain' />
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className='hidden' />
      <CarouselNext className='hidden' />
    </Carousel>
  )
}
