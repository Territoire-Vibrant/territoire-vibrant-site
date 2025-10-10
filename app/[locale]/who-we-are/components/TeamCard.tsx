type TeamCardProps = {
  name: string
  position: string
  bio: string
}

export const TeamCard = ({ name, position, bio }: TeamCardProps) => {
  return (
    <div className='rounded-xl border bg-white p-6 shadow-sm'>
      <div aria-hidden className='mb-4 aspect-[4/3] w-full rounded-lg bg-neutral-200' />

      <h3 className='font-semibold text-lg text-neutral-900'>{name}</h3>

      <p className='font-medium text-neutral-600 text-sm'>{position}</p>

      <p className='mt-2 text-neutral-700 text-sm leading-relaxed'>{bio}</p>
    </div>
  )
}
