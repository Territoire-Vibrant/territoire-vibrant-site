import { getTranslations } from 'next-intl/server'
import { z } from 'zod'

import { ProductForm } from '../../components/ProductForm'

import { notFound } from '~/i18n/navigation'
import { api } from '~/trpc/server'

export default async function AdminShopEditPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params
  const t = await getTranslations()

  if (!z.string().uuid().safeParse(productId).success) {
    notFound()
  }

  const product = await api.product.getById({ id: productId })
  if (!product) {
    notFound()
  }

  const defaultValues = {
    name: product.name,
    description: product.description ?? '',
    price: Number(product.price),
    type: product.type,
    imageUrl: product.imageUrl ?? '',
    isActive: product.isActive,
    partnerStoreUrl: product.partnerStoreUrl ?? '',
  }

  return (
    <div className='mx-auto w-full max-w-6xl px-6 py-10'>
      <div className='mx-auto mb-8 max-w-3xl'>
        <h1 className='font-semibold text-2xl text-foreground tracking-tight'>{t('admin_shop_edit_product')}</h1>
      </div>
      <ProductForm mode='edit' productId={product.id} defaultValues={defaultValues} />
    </div>
  )
}
