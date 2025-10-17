'use client'

import { cn } from '~/lib/utils'

export const SponsorsMarquee = ({
  className,
}: {
  className?: string
}) => {
  const items = Array.from({ length: 10 }, (_, i) => ({ id: `s${i + 1}`, label: `sponsor${i + 1}` }))

  return (
    <div className={cn('marquee-mask relative w-full overflow-hidden', className)}>
      <div className='flex w-max animate-marquee items-center gap-12 py-6'>
        {[0, 1].flatMap((repeat) =>
          items.map((item) => (
            <div
              key={`${item.id}-${repeat}`}
              className='shrink-0 rounded-xl bg-background px-6 py-3 text-foreground/80 shadow-sm ring-1 ring-border'
            >
              {item.label}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
