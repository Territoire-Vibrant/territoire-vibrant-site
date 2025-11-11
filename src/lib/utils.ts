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
/**
 * Checks if a user has admin privileges based on their session claims.
 *
 * This function examines various locations in the session claims object to determine
 * if the user has admin role, including:
 * - Direct metadata role
 * - Organization role
 * - Organization-specific roles in the organizations claim
 *
 * @param sessionClaims - The session claims object to check for admin privileges
 * @returns `true` if the user has admin privileges, `false` otherwise
 *
 * @remarks
 * The function checks for admin privileges in the following order:
 * 1. `claims.metadata.role === 'admin'`
 * 2. `claims.org_role === 'admin'`
 * 3. Any organization role that equals 'org:admin' or ends with ':admin'
 *
 * @example
 * ```typescript
 * const claims = { metadata: { role: 'admin' } };
 * isAdminFromSessionClaims(claims); // returns true
 * ```
 */
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

// Create a short, plain-text excerpt from Markdown content
/**
 * Converts markdown text to a plain text excerpt by stripping markdown syntax.
 *
 * @param md - The markdown string to convert to an excerpt
 * @param max - The maximum length of the excerpt (default: 80)
 * @returns A plain text excerpt with markdown syntax removed. If the text exceeds
 *          the maximum length, it will be truncated and appended with an ellipsis (…)
 *
 * @remarks
 * This function removes the following markdown elements:
 * - Images: `![alt](url)`
 * - Links: `[text](url)` (preserves link text)
 * - Inline code: `` `code` `` or ``` ```code``` ```
 * - Headings, emphasis, quotes, and list markers: `#`, `>`, `*`, `_`, `~`, `-`
 * - Collapses multiple whitespace characters into single spaces
 *
 * @example
 * ```typescript
 * toExcerpt('# Hello **world**!', 20)
 * // Returns: 'Hello world!'
 *
 * toExcerpt('This is a [link](http://example.com) with some text', 30)
 * // Returns: 'This is a link with some te…'
 * ```
 */
export const toExcerpt = (md: string, max = 80) => {
  const plain = md
    // images ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    // inline code `code` or ```code```
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    // headings/emphasis/quotes/lists
    .replace(/[#>*_~\-]+/g, ' ')
    // collapse whitespace
    .replace(/\s+/g, ' ')
    .trim()

  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain
}
