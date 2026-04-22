'use client'

import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchStreamLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { type ReactNode, useEffect, useState } from 'react'
import SuperJSON from 'superjson'

import type { AppRouter } from '~/server/api/root'

import { createQueryClient } from './query-client'

let clientQueryClientSingleton: QueryClient | undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient()

  return clientQueryClientSingleton
}

export const api = createTRPCReact<AppRouter>()

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

const isModifiedClick = (e: MouseEvent) => {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0
}

const NavigationLoadingSlot = ({ children }: { children: ReactNode }) => {
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (isModifiedClick(e)) {
        return
      }
      const a = (e.target as HTMLElement | null)?.closest('a')
      if (!a || !('href' in a)) {
        return
      }
      const el = a as HTMLAnchorElement
      if (el.target && el.target !== '_self') {
        return
      }
      if (el.hasAttribute('download')) {
        return
      }
      try {
        const nextUrl = new URL(el.href, window.location.href)
        if (nextUrl.origin !== window.location.origin) {
          return
        }
        const next = `${nextUrl.pathname}${nextUrl.search}`
        const current = `${window.location.pathname}${window.location.search}`
        if (next === current) {
          return
        }
        setPending(true)
      } catch {
        // ignore invalid href
      }
    }

    document.addEventListener('click', onClickCapture, true)
    return () => document.removeEventListener('click', onClickCapture, true)
  }, [])

  useEffect(() => {
    const clearPending = () => setPending(false)
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function pushState(...args) {
      const result = originalPushState.apply(this, args)
      clearPending()
      return result
    }

    window.history.replaceState = function replaceState(...args) {
      const result = originalReplaceState.apply(this, args)
      clearPending()
      return result
    }

    window.addEventListener('popstate', clearPending)
    window.addEventListener('pageshow', clearPending)

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', clearPending)
      window.removeEventListener('pageshow', clearPending)
    }
  }, [])

  useEffect(() => {
    if (!pending) {
      return
    }
    const id = window.setTimeout(() => setPending(false), 15000)
    return () => window.clearTimeout(id)
  }, [pending])

  if (pending) {
    return null
  }

  return <div className='shrink-0'>{children}</div>
}

export function TRPCReactProvider(props: { children: ReactNode; trailing?: ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: `${getBaseUrl()}/api/trpc`,
          headers: () => {
            const headers = new Headers()
            headers.set('x-trpc-source', 'nextjs-react')
            return headers
          },
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex min-h-dvh flex-col'>
        <api.Provider client={trpcClient} queryClient={queryClient}>
          {props.children}
        </api.Provider>
        {props.trailing != null ? <NavigationLoadingSlot>{props.trailing}</NavigationLoadingSlot> : null}
      </div>
    </QueryClientProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
