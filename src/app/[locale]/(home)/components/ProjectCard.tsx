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
      className='hover:-mt-5 group flex h-100 w-72 select-none flex-col items-center justify-center rounded-2xl shadow-lg transition-all ease-in'
    >
      <Image src={image} alt={title} className='h-[45%] w-full rounded-t-2xl bg-background object-cover' />

      <div className='flex h-[65%] flex-col items-center space-y-2 rounded-b-2xl bg-tertiary p-6 text-center transition-all ease-in group-hover:bg-primary group-hover:text-background'>
        <div className='font-bold text-lg'>{title}</div>

        <div className='opacity-80'>{description}</div>
      </div>
    </Link>
  )
}
