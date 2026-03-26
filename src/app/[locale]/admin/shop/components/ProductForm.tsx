'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

import { Button } from '~/components/ui/button'

import { Link, useRouter } from '~/i18n/navigation'
import { productAdminUpsertSchema } from '~/lib/product-admin-schema'
import { api } from '~/trpc/react'

export type ProductFormDefaults = {
  name: string
  description: string
  price: number
  type: 'PHYSICAL' | 'DIGITAL'
  imageUrl: string
  stock: number
  isActive: boolean
  amazonUrl: string
}

type ProductFormProps = {
  mode: 'create' | 'edit'
  productId?: string
  defaultValues?: ProductFormDefaults
}

const defaultEmpty: ProductFormDefaults = {
  name: '',
  description: '',
  price: 9.99,
  type: 'PHYSICAL',
  imageUrl: '',
  stock: 0,
  isActive: true,
  amazonUrl: '',
}

type FormValues = z.infer<typeof productAdminUpsertSchema>

export function ProductForm({ mode, productId, defaultValues }: ProductFormProps) {
  const t = useTranslations()
  const router = useRouter()

  const createMutation = api.product.create.useMutation({
    onSuccess: () => {
      toast.success(t('admin_shop_save_success'))
      router.push('/admin/shop')
    },
    onError: () => {
      toast.error(t('admin_shop_save_error'))
    },
  })

  const updateMutation = api.product.update.useMutation({
    onSuccess: () => {
      toast.success(t('admin_shop_save_success'))
      router.push('/admin/shop')
    },
    onError: () => {
      toast.error(t('admin_shop_save_error'))
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(productAdminUpsertSchema),
    defaultValues: defaultValues ?? defaultEmpty,
  })

  const pending = createMutation.isPending || updateMutation.isPending || isSubmitting

  const onSubmit = (values: FormValues) => {
    if (mode === 'create') {
      createMutation.mutate(values)
      return
    }
    if (!productId) {
      toast.error(t('admin_shop_save_error'))
      return
    }
    updateMutation.mutate({ id: productId, ...values })
  }

  return (
    <div className='mx-auto w-full max-w-2xl space-y-8'>
      <Link href='/admin/shop' className='font-medium text-primary text-sm hover:underline'>
        {t('admin_shop_back')}
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <label className='font-medium text-sm' htmlFor='product-name'>
            {t('admin_shop_field_name')}
          </label>
          <input
            id='product-name'
            type='text'
            className='h-9 rounded-md border px-3 text-sm shadow-sm'
            {...register('name')}
          />
          {errors.name && <p className='text-destructive text-xs'>{errors.name.message}</p>}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-sm' htmlFor='product-description'>
            {t('admin_shop_field_description')}
          </label>
          <textarea
            id='product-description'
            rows={4}
            className='rounded-md border px-3 py-2 text-sm shadow-sm'
            {...register('description')}
          />
          {errors.description && <p className='text-destructive text-xs'>{String(errors.description.message)}</p>}
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label className='font-medium text-sm' htmlFor='product-type'>
              {t('admin_shop_field_type')}
            </label>
            <select id='product-type' className='h-9 rounded-md border px-3 text-sm shadow-sm' {...register('type')}>
              <option value='PHYSICAL'>{t('admin_shop_type_physical')}</option>
              <option value='DIGITAL'>{t('admin_shop_type_digital')}</option>
            </select>
            {errors.type && <p className='text-destructive text-xs'>{errors.type.message}</p>}
          </div>

          <div className='flex flex-col gap-2'>
            <label className='font-medium text-sm' htmlFor='product-price'>
              {t('admin_shop_field_price')}
            </label>
            <input
              id='product-price'
              type='number'
              step='0.01'
              min='0.01'
              className='h-9 rounded-md border px-3 text-sm shadow-sm'
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <p className='text-destructive text-xs'>{errors.price.message}</p>}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-sm' htmlFor='product-image'>
            {t('admin_shop_field_image_url')}
          </label>
          <input
            id='product-image'
            type='url'
            placeholder='https://'
            className='h-9 rounded-md border px-3 text-sm shadow-sm'
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className='text-destructive text-xs'>{errors.imageUrl.message}</p>}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-sm' htmlFor='product-stock'>
            {t('admin_shop_field_stock')}
          </label>
          <input
            id='product-stock'
            type='number'
            min={0}
            step={1}
            className='h-9 rounded-md border px-3 text-sm shadow-sm'
            {...register('stock', { valueAsNumber: true })}
          />
          {errors.stock && <p className='text-destructive text-xs'>{errors.stock.message}</p>}
        </div>

        <div className='flex flex-col gap-2'>
          <label className='font-medium text-sm' htmlFor='product-amazon'>
            {t('admin_shop_field_amazon_url')}
          </label>
          <input
            id='product-amazon'
            type='url'
            placeholder='https://'
            className='h-9 rounded-md border px-3 text-sm shadow-sm'
            {...register('amazonUrl')}
          />
          {errors.amazonUrl && <p className='text-destructive text-xs'>{errors.amazonUrl.message}</p>}
        </div>

        <label className='flex cursor-pointer items-center gap-2'>
          <input type='checkbox' className='size-4 rounded border' {...register('isActive')} />
          <span className='font-medium text-sm'>{t('admin_shop_field_active')}</span>
        </label>
        {errors.isActive && <p className='text-destructive text-xs'>{errors.isActive.message}</p>}

        <Button type='submit' disabled={pending} className='w-fit'>
          {t('save')}
        </Button>
      </form>
    </div>
  )
}
