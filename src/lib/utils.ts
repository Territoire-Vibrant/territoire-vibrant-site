import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Determine whether a user has admin privileges based on Clerk session claims.
// Supports:
// - claims.metadata.role === 'admin'
// - claims.org_role === 'admin'
// - organization claim map values like 'org:admin' or any value ending with ':admin'
// - organizations may be an object map or array of strings.
export const isAdminFromSessionClaims = (sessionClaims: unknown): boolean => {
  if (!sessionClaims || typeof sessionClaims !== 'object') return false
  const claims: any = sessionClaims

  if (claims?.metadata?.role === 'admin') return true
  if (claims?.org_role === 'admin') return true

  const orgClaims = claims.organizations
  let orgRoles: string[] = []
  if (Array.isArray(orgClaims)) {
    orgRoles = orgClaims.filter((v) => typeof v === 'string') as string[]
  } else if (orgClaims && typeof orgClaims === 'object') {
    orgRoles = Object.values(orgClaims).filter((v) => typeof v === 'string') as string[]
  }

  return orgRoles.some((r) => r === 'org:admin' || r.endsWith(':admin'))
}
