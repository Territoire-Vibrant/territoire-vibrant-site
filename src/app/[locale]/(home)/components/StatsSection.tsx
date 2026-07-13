import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { HandshakeIcon, LeafIcon, MapPinIcon, QuotesIcon, UsersThreeIcon } from '@phosphor-icons/react/dist/ssr'

import StatsBranchIllustration from '~/assets/images/home/stats-branch.svg'

export const StatsSection = () => {
  const t = useTranslations()

  const stats = [
    {
      icon: <UsersThreeIcon size={28} weight='duotone' className='text-primary' />,
      value: t('Home.stats.communities'),
      label: t('Home.stats.communities_label'),
    },
    {
      icon: (
        <span className='flex size-10 items-center justify-center rounded-full border border-primary/30'>
          <MapPinIcon size={22} weight='duotone' className='text-primary' />
        </span>
      ),
      value: t('Home.stats.territories'),
      label: t('Home.stats.territories_label'),
    },
    {
      icon: <HandshakeIcon size={28} weight='duotone' className='text-primary' />,
      value: t('Home.stats.partnerships'),
      label: t('Home.stats.partnerships_label'),
    },
    {
      icon: (
        <span className='flex size-10 items-center justify-center rounded-full border border-primary/30'>
          <LeafIcon size={22} weight='duotone' className='text-primary' />
        </span>
      ),
      value: t('Home.stats.impact'),
      label: t('Home.stats.impact_label'),
    },
  ] as const

  return (
    <div className='flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-0'>
      <div className='hidden shrink-0 self-stretch lg:flex lg:items-center lg:pr-7'>
        <Image
          src={StatsBranchIllustration}
          alt=''
          width={72}
          height={140}
          className='h-auto w-[5rem] object-contain'
          aria-hidden
        />
      </div>

      <div className='grid min-w-0 flex-1 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:items-stretch lg:gap-0'>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              index > 0
                ? 'flex min-w-0 items-stretch lg:border-foreground/15 lg:border-l'
                : 'flex min-w-0 items-stretch'
            }
          >
            <StatItem icon={stat.icon} value={stat.value} label={stat.label} />
          </div>
        ))}

        <blockquote className='relative flex min-w-0 flex-col justify-center sm:col-span-2 lg:col-span-1 lg:border-foreground/15 lg:border-l lg:px-7'>
          <QuotesIcon size={26} weight='fill' className='mb-1 text-primary' aria-hidden />
          <p className='font-medium text-foreground text-sm leading-snug'>{t('Home.quote')}</p>
          <div className='mt-4 h-px w-14 bg-primary' aria-hidden />
        </blockquote>
      </div>
    </div>
  )
}

const StatItem = ({ icon, value, label }: { icon: ReactNode; value: string; label: string }) => (
  <div className='flex min-w-0 flex-1 items-start justify-center gap-3 px-5'>
    <div className='mt-0.5 shrink-0'>{icon}</div>
    <div className='min-w-0'>
      <p className='font-bold text-2xl text-foreground'>{value}</p>
      <p className='text-muted-foreground text-sm leading-snug'>{label}</p>
    </div>
  </div>
)
