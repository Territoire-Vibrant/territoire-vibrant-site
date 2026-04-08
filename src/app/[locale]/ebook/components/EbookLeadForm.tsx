'use client'

import { ArrowDownIcon, BookOpenIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { LeadCaptureSchema } from '~/schemas/lead'
import { api } from '~/trpc/react'

type FormState = {
  errors?: Record<string, string[] | undefined>
  success?: boolean
  message?: string
}

export const EbookLeadForm = () => {
  const t = useTranslations('Ebook')
  const mutation = api.lead.capture.useMutation()

  const [state, action, isPending] = useActionState(
    async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
      const raw = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
      }

      const validation = LeadCaptureSchema.safeParse(raw)

      if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors }
      }

      try {
        await mutation.mutateAsync(validation.data)
        return { success: true }
      } catch {
        return { success: false, message: t('error') }
      }
    },
    null
  )

  if (state?.success) {
    return (
      <div className='flex flex-col items-center gap-6 py-8 text-center'>
        <div className='flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
          <CheckCircleIcon className='size-8' weight='fill' />
        </div>
        <div>
          <h3 className='font-semibold text-foreground text-xl'>{t('success_title')}</h3>
          <p className='mt-1 text-foreground/70'>{t('success_subtitle')}</p>
        </div>
        <a
          href='/ebook.pdf'
          download
          className={cn(
            'inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3',
            'font-medium text-primary-foreground text-sm shadow-xs',
            'transition-all hover:bg-primary/90 focus-visible:outline-none',
            'focus-visible:ring-2 focus-visible:ring-primary/50'
          )}
        >
          <ArrowDownIcon className='size-4' weight='bold' />
          {t('download')}
        </a>
      </div>
    )
  }

  return (
    <form action={action} className='flex flex-col gap-5'>
      <h3 className='font-semibold text-foreground text-lg'>{t('form_title')}</h3>

      {/* Name */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='name' className='font-medium text-foreground text-sm'>
          {t('name')}
        </label>
        <input
          type='text'
          id='name'
          name='name'
          required
          placeholder={t('name_placeholder')}
          className={cn(
            'h-11 rounded-lg border border-foreground/15 bg-background px-4 text-foreground outline-none transition-all',
            'placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
            state?.errors?.name && 'border-destructive'
          )}
        />
        {state?.errors?.name && <p className='text-destructive text-sm'>{state.errors.name[0]}</p>}
      </div>

      {/* Email */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='email' className='font-medium text-foreground text-sm'>
          {t('email')}
        </label>
        <input
          type='email'
          id='email'
          name='email'
          required
          placeholder={t('email_placeholder')}
          className={cn(
            'h-11 rounded-lg border border-foreground/15 bg-background px-4 text-foreground outline-none transition-all',
            'placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
            state?.errors?.email && 'border-destructive'
          )}
        />
        {state?.errors?.email && <p className='text-destructive text-sm'>{state.errors.email[0]}</p>}
      </div>

      {/* Phone */}
      <div className='flex flex-col gap-2'>
        <label htmlFor='phone' className='font-medium text-foreground text-sm'>
          {t('phone')}
        </label>
        <input
          type='tel'
          id='phone'
          name='phone'
          required
          placeholder={t('phone_placeholder')}
          className={cn(
            'h-11 rounded-lg border border-foreground/15 bg-background px-4 text-foreground outline-none transition-all',
            'placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
            state?.errors?.phone && 'border-destructive'
          )}
        />
        {state?.errors?.phone && <p className='text-destructive text-sm'>{state.errors.phone[0]}</p>}
      </div>

      {/* General error */}
      {state?.message && !state.success && <p className='text-destructive text-sm'>{state.message}</p>}

      <Button type='submit' size='lg' isLoading={isPending} className='mt-2'>
        <BookOpenIcon weight='bold' />
        {t('submit')}
      </Button>
    </form>
  )
}
