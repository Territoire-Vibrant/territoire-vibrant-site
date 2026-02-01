'use client'

import { EnvelopeIcon, PhoneIcon, PaperPlaneTiltIcon, CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { useTranslations } from 'next-intl'
import { useActionState, useOptimistic } from 'react'
import { flushSync } from 'react-dom'

import { Button } from '~/components/ui/button'
import { Section } from '~/layouts/Section'
import { cn } from '~/lib/utils'
import { ContactFormSchema, SUBJECT_OPTIONS } from '~/schemas/contact'
import { api } from '~/trpc/react'

type FormState = {
  errors?: Record<string, string[] | undefined>
  success?: boolean
  message?: string
}

const CONTACT_INFO = {
  phone: '+1 514 710-8532',
  email: 'macneves@territoirevibrant.ca',
}

export const ContactSection = () => {
  const t = useTranslations()

  const [optimisticSuccess, setOptimisticSuccess] = useOptimistic(false)

  const mutation = api.contact.send.useMutation()

  const [state, action, isPending] = useActionState(
    async (_prev: FormState | null, formData: FormData): Promise<FormState> => {
      const raw = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      }

      const validation = ContactFormSchema.safeParse(raw)

      if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors }
      }

      // Optimistic update with View Transition
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => setOptimisticSuccess(true))
        })
      } else {
        setOptimisticSuccess(true)
      }

      try {
        await mutation.mutateAsync(validation.data)
        return { success: true, message: t('Contact.success') }
      } catch {
        setOptimisticSuccess(false)
        return { success: false, message: t('Contact.error') }
      }
    },
    null
  )

  const showSuccess = optimisticSuccess || state?.success

  return (
    <Section id='contact' className='px-6 py-16'>
      <div className='grid gap-12 md:grid-cols-2'>
        {/* Contact Info */}
        <div className='flex flex-col gap-8'>
          <div>
            <h2 className='font-bold text-3xl text-foreground'>{t('Contact.title')}</h2>
            <p className='mt-3 text-foreground/70 leading-relaxed'>{t('Contact.subtitle')}</p>
          </div>

          <div className='flex flex-col gap-4'>
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}
              className='group flex items-center gap-4 rounded-xl border border-foreground/10 bg-foreground/2 p-4 transition-all hover:border-primary/40 hover:bg-primary/5'
            >
              <div className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-background'>
                <PhoneIcon className='size-5' weight='bold' />
              </div>
              <div>
                <p className='font-medium text-foreground text-sm'>{t('Contact.phone')}</p>
                <p className='text-foreground/70'>{CONTACT_INFO.phone}</p>
              </div>
            </a>

            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className='group flex items-center gap-4 rounded-xl border border-foreground/10 bg-foreground/2 p-4 transition-all hover:border-primary/40 hover:bg-primary/5'
            >
              <div className='flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-background'>
                <EnvelopeIcon className='size-5' weight='bold' />
              </div>
              <div>
                <p className='font-medium text-foreground text-sm'>{t('Contact.email')}</p>
                <p className='text-foreground/70'>{CONTACT_INFO.email}</p>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div
          className='rounded-2xl border border-foreground/10 bg-foreground/2 p-6 sm:p-8'
          style={{ viewTransitionName: 'contact-form' }}
        >
          {showSuccess ? (
            <div className='flex h-full flex-col items-center justify-center gap-4 py-12 text-center'>
              <div className='flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <CheckCircleIcon className='size-8' weight='fill' />
              </div>
              <h3 className='font-semibold text-foreground text-xl'>{t('Contact.success_title')}</h3>
              <p className='max-w-xs text-foreground/70'>{t('Contact.success')}</p>
            </div>
          ) : (
            <form action={action} className='flex flex-col gap-5'>
              <h3 className='font-semibold text-foreground text-lg'>{t('Contact.form_title')}</h3>

              {/* Subject Select */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='subject' className='font-medium text-foreground text-sm'>
                  {t('Contact.subject')}
                </label>
                <select
                  id='subject'
                  name='subject'
                  required
                  defaultValue=''
                  className={cn(
                    'h-11 rounded-lg border border-foreground/15 bg-background px-4 text-foreground outline-none transition-all',
                    'focus:border-primary focus:ring-2 focus:ring-primary/20',
                    state?.errors?.subject && 'border-destructive'
                  )}
                >
                  <option value='' disabled>
                    {t('Contact.select_subject')}
                  </option>
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
                {state?.errors?.subject && <p className='text-destructive text-sm'>{state.errors.subject[0]}</p>}
              </div>

              {/* Name Input */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='name' className='font-medium text-foreground text-sm'>
                  {t('Contact.name')}
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  required
                  placeholder={t('Contact.name_placeholder')}
                  className={cn(
                    'h-11 rounded-lg border border-foreground/15 bg-background px-4 text-foreground outline-none transition-all',
                    'placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
                    state?.errors?.name && 'border-destructive'
                  )}
                />
                {state?.errors?.name && <p className='text-destructive text-sm'>{state.errors.name[0]}</p>}
              </div>

              {/* Email Input */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='email' className='font-medium text-foreground text-sm'>
                  {t('Contact.your_email')}
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  placeholder={t('Contact.email_placeholder')}
                  className={cn(
                    'h-11 rounded-lg border border-foreground/15 bg-background px-4 text-foreground outline-none transition-all',
                    'placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
                    state?.errors?.email && 'border-destructive'
                  )}
                />
                {state?.errors?.email && <p className='text-destructive text-sm'>{state.errors.email[0]}</p>}
              </div>

              {/* Message Textarea */}
              <div className='flex flex-col gap-2'>
                <label htmlFor='message' className='font-medium text-foreground text-sm'>
                  {t('Contact.message')}
                </label>
                <textarea
                  id='message'
                  name='message'
                  required
                  rows={5}
                  placeholder={t('Contact.message_placeholder')}
                  className={cn(
                    'resize-none rounded-lg border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none transition-all',
                    'placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20',
                    state?.errors?.message && 'border-destructive'
                  )}
                />
                {state?.errors?.message && <p className='text-destructive text-sm'>{state.errors.message[0]}</p>}
              </div>

              {/* Error Message */}
              {state?.message && !state.success && <p className='text-destructive text-sm'>{state.message}</p>}

              {/* Submit Button */}
              <Button type='submit' size='lg' isLoading={isPending} className='mt-2'>
                <PaperPlaneTiltIcon weight='bold' />
                {t('Contact.send')}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  )
}
