import Image from 'next/image'

import Inflorescence from '~/assets/images/partners/inflorescence.png'
import MonCarrefourWeb from '~/assets/images/partners/mon-carrefour-web.png'
import SoAndCo from '~/assets/images/partners/so&co.png'
import { cn } from '~/lib/utils'

export const SponsorsMarquee = ({ className }: { className?: string }) => (
  <div className={cn('grid w-full grid-cols-3 items-center gap-5', className)}>
    <span className='relative mx-auto block h-12 w-28 overflow-hidden'>
      <Image
        src={SoAndCo}
        alt='SO&CO'
        className='absolute top-1/2 left-1/2 size-[210px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70 brightness-0'
      />
    </span>
    <span className='relative mx-auto block h-12 w-32 overflow-hidden'>
      <Image
        src={Inflorescence}
        alt='Inflorescence Clinique'
        className='absolute top-1/2 left-1/2 size-[145px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70 brightness-0'
      />
    </span>
    <span className='relative mx-auto block h-12 w-28 overflow-hidden'>
      <Image
        src={MonCarrefourWeb}
        alt='Mon Carrefour Web'
        className='absolute top-1/2 left-1/2 size-[130px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70 brightness-0'
      />
    </span>
  </div>
)
