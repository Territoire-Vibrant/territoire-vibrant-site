import { useTranslations } from 'next-intl'

export const Hero = () => {
  const t = useTranslations('Hero')

  return (
    <div className='mt-8 flex h-[600px] w-full flex-col items-center justify-between px-6 md:flex-row'>
      <div className='flex flex-col gap-8'>
        <h1 className='size-full text-center font-bold text-3xl'>{t('h1')}</h1>

        <h2 className='size-full text-center text-2xl text-neutral-600'>{t('h2')}</h2>
      </div>
    </div>
  )
}
