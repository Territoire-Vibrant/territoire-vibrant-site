import { getTranslations } from 'next-intl/server'

import { ShoppingBagIcon } from '@phosphor-icons/react/dist/ssr'
import { Section } from '~/layouts/Section'
import { ProductCard } from './components/ProductCard'

import { db } from '~/server/db'

export default async function ShopPage() {
  // const { locale } = await params
  const t = await getTranslations()

  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Section limitWidth={false} className='min-h-screen bg-linear-to-b from-amber-50/50 to-stone-100 px-6 py-12'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-10'>
        <div className='space-y-3 text-center'>
          <h1 className='font-bold text-4xl text-stone-800 tracking-tight'>{t('shop_page_title')}</h1>
          <p className='mx-auto max-w-2xl text-base text-stone-600'>{t('shop_page_subtitle')}</p>
        </div>

        {products.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: String(product.price),
                  imageUrl: product.imageUrl,
                  type: product.type,
                  stock: product.stock,
                  amazonUrl: product.amazonUrl,
                }}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='mb-4 rounded-full bg-amber-100 p-6'>
              <ShoppingBagIcon className='size-10' />
            </div>
            <p className='text-lg text-stone-600'>{t('no_products_yet')}</p>
          </div>
        )}
      </div>
    </Section>
  )
}
