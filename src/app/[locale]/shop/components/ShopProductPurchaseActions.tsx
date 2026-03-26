'use client'

import { useTranslations } from 'next-intl'

import { ArrowSquareOutIcon, EnvelopeIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from '~/components/ui/button'

const ORDER_EMAIL = 'macneves@territoirevibrant.ca'

export type ShopProductPurchaseActionsProps = {
  productName: string
  partnerStoreUrl: string | null
  buttonSize?: 'default' | 'sm' | 'lg'
}

export function ShopProductPurchaseActions({
  productName,
  partnerStoreUrl,
  buttonSize = 'sm',
}: ShopProductPurchaseActionsProps) {
  const t = useTranslations()

  if (partnerStoreUrl) {
    return (
      <Button className='w-full gap-2 bg-primary hover:bg-primary/90' size={buttonSize} asChild>
        <a href={partnerStoreUrl} rel='noopener noreferrer'>
          <ArrowSquareOutIcon className='size-4' />
          {t('shop_buy_at_partner')}
        </a>
      </Button>
    )
  }

  return (
    <Button className='w-full gap-2 bg-primary hover:bg-primary/90' size={buttonSize} asChild>
      <a
        href={`mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(`Order: ${productName}`)}`}
        rel='noopener noreferrer'
      >
        <EnvelopeIcon className='size-4' />
        {t('shop_order_by_email')}
      </a>
    </Button>
  )
}
