import Image, { type StaticImageData } from 'next/image'
import { Link } from '~/i18n/navigation'

type ProjectCardProps = {
  image: StaticImageData
  title: string
  description: string
}

export const ProjectCard = ({ image, title, description }: ProjectCardProps) => {
  return (
    <Link
      href=''
      className='group flex h-111 w-64 select-none flex-col items-center justify-center shadow-lg transition-all ease-in hover:-mt-5'
    >
      <Image src={image} alt={title} className='h-[45%] w-full bg-background object-cover' />

      <div className='flex h-[65%] flex-col items-center space-y-2 bg-tertiary p-6 text-center transition-all ease-in group-hover:bg-primary group-hover:text-background'>
        <div className='font-bold text-lg'>{title}</div>

        <div className='text-sm opacity-80'>{description}</div>
      </div>
    </Link>
  )
}
