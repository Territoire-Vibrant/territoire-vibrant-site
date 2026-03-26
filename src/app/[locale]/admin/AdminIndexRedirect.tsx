'use client'

import { useEffect } from 'react'

import { useRouter } from '~/i18n/navigation'

/**
 * Fallback when this route is hit without a prior proxy redirect (e.g. some client navigations).
 * Uses client navigation so we never throw NEXT_REDIRECT from an RSC (dev error overlay flash).
 */
export function AdminIndexRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/admin/content')
  }, [router])

  return null
}
