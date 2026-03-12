'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useState } from 'react'

import { ArrowSquareOutIcon, CreditCardIcon, EnvelopeIcon } from '@phosphor-icons/react/dist/ssr'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'

import { api } from '~/trpc/react'

type ProductType = 'PHYSICAL' | 'DIGITAL'

type Product = {
  id: string
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  type: ProductType
  stock: number
  amazonUrl: string | null
}

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)

  const checkoutMutation = api.shop.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url
      }
    },
    onError: (_err) => {
      toast.error('Erro ao iniciar checkout')
      setLoading(false)
    },
  })

  const handleBuyNow = async () => {
    setLoading(true)
    checkoutMutation.mutate({ productId: product.id })
  }

  const isOutOfStock = product.stock <= 0 && product.type === 'PHYSICAL'
  const price = Number(product.price)
  const formattedPrice = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price)

  const contactEmail = 'macneves@territoirevibrant.ca'

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'>
      <div className='relative aspect-4/3 overflow-hidden bg-amber-50'>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-linear-to-br from-amber-100 to-orange-100'>
            <span className='font-bold text-4xl text-amber-800/40'>TV</span>
          </div>
        )}

        <div className='absolute top-3 left-3'>
          <span
            className={`rounded-full px-3 py-1 font-semibold text-xs uppercase tracking-wide ${
              product.type === 'PHYSICAL' ? 'bg-amber-700 text-amber-50' : 'bg-green-700 text-green-50'
            }`}
          >
            {product.type === 'PHYSICAL' ? t('product_physical') : t('product_digital')}
          </span>
        </div>
      </div>

      <div className='flex flex-1 flex-col p-5'>
        <h3 className='mb-2 line-clamp-2 font-semibold text-lg text-stone-800'>{product.name}</h3>

        {product.description && (
          <p className='mb-4 line-clamp-3 flex-1 text-sm text-stone-600'>{product.description}</p>
        )}

        <div className='mt-auto flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <span className='font-bold text-amber-800 text-xl'>{formattedPrice}</span>
            {isOutOfStock && <span className='font-medium text-red-600 text-sm'>{t('out_of_stock')}</span>}
          </div>

          <div className='flex flex-col gap-2'>
            {product.amazonUrl && (
              <a href={product.amazonUrl} target='_blank' rel='noopener noreferrer' className='w-full'>
                <Button className='w-full gap-2 bg-primary hover:bg-primary/90' size='sm'>
                  <ArrowSquareOutIcon className='size-4' />
                  {t('buy_on_amazon')}
                </Button>
              </a>
            )}

            {!isOutOfStock && !product.amazonUrl && (
              <Button
                className='w-full gap-2 bg-primary hover:bg-primary/90'
                size='sm'
                onClick={handleBuyNow}
                disabled={loading}
              >
                <CreditCardIcon className='size-4' />
                {loading ? 'Processando...' : t('buy_now' as any)}
              </Button>
            )}

            {!isOutOfStock && (
              <a href={`mailto:${contactEmail}?subject=Order: ${encodeURIComponent(product.name)}`} className='w-full'>
                <Button
                  className='w-full gap-2 border-stone-200 text-stone-600 hover:bg-stone-50'
                  variant='outline'
                  size='sm'
                >
                  <EnvelopeIcon className='size-4' />
                  {t('contact_us')}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
