import { getTranslations } from 'next-intl/server'
import { z } from 'zod'

import { notFound } from '~/i18n/navigation'
import { api } from '~/trpc/server'

import { ProductForm } from '../components/ProductForm'

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
    stock: product.stock,
    isActive: product.isActive,
    amazonUrl: product.amazonUrl ?? '',
  }

  return (
    <div className='mx-auto w-full max-w-6xl px-6 py-10'>
      <h1 className='mb-8 font-semibold text-2xl'>{t('admin_shop_edit_product')}</h1>
      <ProductForm mode='edit' productId={product.id} defaultValues={defaultValues} />
    </div>
  )
}
