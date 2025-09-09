import { Link } from '~/i18n/navigation'

export const Header = () => {
  return (
    <header className='flex h-16 items-center justify-center border-b'>
      <nav className='flex w-full max-w-6xl items-center justify-between px-6'>
        <ul className='flex items-center'>
          <li>
            <Link href='/'>Territoire Vibrant</Link>
          </li>
        </ul>

        <ul className='flex items-center gap-6'>
          <li>
            <Link href='/about'>About</Link>
          </li>

          <li>
            <Link href='/contact'>Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
