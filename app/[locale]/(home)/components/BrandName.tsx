import type { ComponentProps } from 'react'

type BrandNameProps = {
  label: string
} & ComponentProps<'span'>

export function BrandName({ label, className, ...rest }: BrandNameProps) {
  const hasRegistered = label.includes('®')
  const cleanLabel = label.replaceAll('®', '')

  return (
    <span className={className} {...rest}>
      {cleanLabel}
      {hasRegistered && <sup className='ml-0.5 text-[0.6em] leading-none'>®</sup>}
    </span>
  )
}
