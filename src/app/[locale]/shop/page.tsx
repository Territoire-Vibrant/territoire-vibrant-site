import { getLocale, getTranslations } from 'next-intl/server'

import { Section } from '~/layouts/Section'
import { LOCALE_CURRENCY, getPriceByCurrency } from '~/lib/currency'
import { formatPrice } from '~/lib/format-price'
import { db } from '~/server/db'

import { EbookCard } from './components/EbookCard'
import { ProductCard } from './components/ProductCard'

export default async function ShopPage() {
  const [t, locale] = await Promise.all([getTranslations(), getLocale()])

  const currency = LOCALE_CURRENCY[locale] ?? 'CAD'
  const products = await db.product.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } })

  return (
    <Section limitWidth={false} className='bg-linear-to-b from-amber-50/50 to-stone-100 px-6 py-12'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-10'>
        <div className='space-y-3 text-center'>
          <h1 className='font-bold text-4xl text-stone-800 tracking-tight'>{t('shop_page_title')}</h1>
          <p className='mx-auto max-w-2xl text-base text-stone-600'>{t('shop_page_subtitle')}</p>
        </div>

        {/* Grid always renders — EbookCard ensures there's always at least one item */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {/* Free e-book download — always first */}
          <EbookCard />

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                formattedPrice: formatPrice(getPriceByCurrency(currency), locale, currency),
                imageUrl: product.imageUrl,
                type: product.type,
                partnerStoreUrl: product.partnerStoreUrl,
              }}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
