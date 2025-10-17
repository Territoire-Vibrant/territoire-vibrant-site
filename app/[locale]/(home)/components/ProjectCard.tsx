import Image, { type StaticImageData } from 'next/image'
import { Link } from '~/i18n/navigation'

type ProjectCardProps = {
  image: StaticImageData
  title: string
  description: string
}

export const ProjectCard = ({ image, title, description }: ProjectCardProps) => {
  return (
    <Link href='' className='flex h-[34rem] w-72 select-none flex-col items-center justify-center rounded-2xl bg-white'>
      <Image src={image} alt={title} className='h-1/2 w-full rounded-t-2xl object-cover' />

      <div className='flex h-1/2 flex-col items-center space-y-2 p-6 text-center'>
        <div className='font-bold text-lg'>{title}</div>

        <div className='opacity-80'>{description}</div>
      </div>
    </Link>
  )
}
