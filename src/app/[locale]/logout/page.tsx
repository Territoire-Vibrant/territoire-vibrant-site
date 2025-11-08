'use client'

import { useClerk } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function LogoutPage() {
  const { signOut } = useClerk()

  useEffect(() => {
    // Immediately sign out and redirect to home
    void signOut({ redirectUrl: '/' })
  }, [signOut])

  return null
}
