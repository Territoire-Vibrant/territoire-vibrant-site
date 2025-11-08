import { SignOutButton } from '@clerk/nextjs'

export default function AdminPage() {
  return (
    <div>
      <div>Admin Page</div>

      <button type='button' className='cursor-pointer bg-red-500 p-2 font-bold'>
        <SignOutButton />
      </button>
    </div>
  )
}
