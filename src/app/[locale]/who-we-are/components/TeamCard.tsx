import Image, { type StaticImageData } from 'next/image'

import PlaceholderImage from '~/assets/images/placeholder.png'

type TeamCardProps = {
  name: string
  position: string
  bio: string
  image?: StaticImageData | string
}

export const TeamCard = ({ name, position, bio, image }: TeamCardProps) => {
  return (
    <div className='h-[400px] select-none rounded-xl border bg-background p-6 shadow-sm'>
      <Image
        src={image ?? PlaceholderImage}
        alt={name}
        className='mb-4 aspect-4/3 w-full rounded-lg bg-neutral-200 object-cover'
      />

      <h3 className='font-semibold text-lg text-neutral-900'>{name}</h3>

      <p className='font-medium text-neutral-600 text-sm'>{position}</p>

      <p className='mt-2 text-neutral-700 text-sm leading-relaxed'>{bio}</p>
    </div>
  )
}
