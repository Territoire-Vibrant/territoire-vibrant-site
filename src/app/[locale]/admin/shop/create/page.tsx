import { getTranslations } from 'next-intl/server'

import { ProductForm } from '../components/ProductForm'

export default async function AdminShopCreatePage() {
  const t = await getTranslations()

  return (
    <div className='mx-auto w-full max-w-6xl px-6 py-10'>
      <h1 className='mb-8 font-semibold text-2xl'>{t('admin_shop_new_product')}</h1>
      <ProductForm mode='create' />
    </div>
  )
}
