import { useTranslations } from 'next-intl'
import Image from 'next/image'

import LandscapeImage from '~/assets/images/home/intro/landscape.jpg'

import { Button } from '~/components/ui/button'

import { Link } from '~/i18n/navigation'

export const Intro = () => {
  const t = useTranslations()

  return (
    <section className='w-full px-6 py-12 md:py-16'>
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
    </section>
  )
}
