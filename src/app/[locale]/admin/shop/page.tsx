import { getTranslations } from 'next-intl/server'

import { Button, buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import { Link } from '~/i18n/navigation'
import { api } from '~/trpc/server'

export default async function AdminShopPage() {
  const t = await getTranslations()
  const products = await api.product.list()

  return (
    <div className='mt-10 flex w-full max-w-6xl flex-col gap-6 px-6 pb-10'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='font-semibold text-2xl'>{t('admin_shop_title')}</h1>

        <Link href='/admin/shop/create' className={cn(buttonVariants({ variant: 'default' }))}>
          {t('admin_shop_new_product')}
        </Link>
      </div>

      {products.length === 0 ? (
        <p className='text-muted-foreground'>{t('admin_shop_no_products')}</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {products.map((product) => {
            const price = Number(product.price)
            const formattedPrice = new Intl.NumberFormat('en-CA', {
              style: 'currency',
              currency: 'CAD',
            }).format(price)

            return (
              <article
                key={product.id}
                className='flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm'
              >
                <div className='relative aspect-4/3 w-full shrink-0 overflow-hidden bg-amber-50'>
                  {product.imageUrl ? (
                    // biome-ignore lint/performance/noImgElement: admin list must support any image host (not only next.config remotePatterns)
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className='absolute inset-0 size-full object-cover'
                    />
                  ) : (
                    <div className='absolute inset-0 flex items-center justify-center bg-linear-to-br from-amber-100 to-orange-100 px-2'>
                      <span className='text-center font-semibold text-amber-800/50 text-xs leading-tight sm:text-sm'>
                        {t('territoire_vibrant')}
                      </span>
                    </div>
                  )}
                </div>

                <div className='flex flex-1 flex-col gap-2 p-4'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold text-xs uppercase ${
                        product.type === 'PHYSICAL' ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-900'
                      }`}
                    >
                      {product.type === 'PHYSICAL' ? t('admin_shop_type_physical') : t('admin_shop_type_digital')}
                    </span>

                    {!product.isActive && (
                      <span className='rounded-full bg-stone-200 px-2 py-0.5 font-medium text-stone-700 text-xs'>
                        {t('admin_shop_inactive')}
                      </span>
                    )}
                  </div>

                  <h2 className='font-semibold text-lg leading-tight'>{product.name}</h2>
                  <p className='font-medium text-stone-800'>{formattedPrice}</p>

                  <div className='mt-auto flex flex-wrap gap-2 pt-2'>
                    <Link href={`/admin/shop/${product.id}`}>
                      <Button variant='default' className='cursor-pointer'>
                        {t('admin_shop_view')}
                      </Button>
                    </Link>

                    <Link href={`/admin/shop/${product.id}/edit`}>
                      <Button variant='outline' className='cursor-pointer'>
                        {t('admin_shop_edit')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
