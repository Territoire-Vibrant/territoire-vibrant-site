# Repository Instructions

## Scope

territoire-vibrant-site is the Next.js 16 site for Territoire Vibrant: localized public pages, a content
section, a small shop, and an admin area. It is a T3-style app — App Router, tRPC, Prisma, Clerk, Tailwind.
All source lives under `src/`, which the `~/*` alias points to.

## Commands

- Bun is the package manager: `bun add <package>`, `bun run <script>`, `bunx <package>`.
- Run `bun run check:unsafe` and review the resulting diff, because Biome's unsafe fixes rewrite files. Keep
  rewrites that preserve behavior; revert any that change it and fix the underlying lint manually.
- Run `bun run typecheck` for typed changes and `bun run react-doctor` for React changes.
- There is no test suite. When a change needs real verification, `bun run build` is the closest thing, since
  it surfaces Server Component and route errors that typecheck alone misses.

## Commands Not To Run

Every `db:*` script writes to whatever `DATABASE_URL` resolves to. Do not run them without an explicit
request naming the database: `db:migrate` runs `prisma migrate deploy`, `db:generate` runs `prisma migrate
dev` (it creates and applies a migration despite the name), and `db:push` mutates the schema with no
migration at all. `prisma/seed.ts` and `db:studio` are equally live. To regenerate the Prisma client without
touching data, run `bunx prisma generate`.

`bun run dev` is a long-running Turbopack server. Do not use it as a verification step; start it only when
asked, and run it in the background.

## Architecture

- Next.js 16 App Router. Components are Server Components by default; add `'use client'` only where
  interactivity requires it. Every route lives under `src/app/[locale]/`.
- tRPC v11 is the only API layer. **This codebase has no Server Actions** — do not introduce `'use server'`
  when an existing router covers the work.
  - Server Components call `import { api } from '~/trpc/server'`, which wraps the RSC caller and hydration
    helpers.
  - Client Components call `import { api } from '~/trpc/api'`, then `api.<router>.<procedure>.useMutation()`.
  - Routers live in `src/server/api/routers/` and are registered in `src/server/api/root.ts`.
  - `publicProcedure` and `adminProcedure` are the only procedures. `adminProcedure` enforces Clerk session
    claims through `isAdminFromSessionClaims`; never re-implement that check inline.
- Prisma 7 with the `@prisma/adapter-pg` driver adapter. The client is generated into `generated/prisma`, not
  `node_modules`. Import the shared `db` singleton from `~/server/db`; never construct a `PrismaClient`.
- Environment variables go through `~/env` (`@t3-oss/env-nextjs`) with a Zod schema. Never read `process.env`
  directly in application code.
- Object storage is Cloudflare R2 through the S3 client in `~/server/r2`. Email is MailerSend via
  `~/server/email/mailersend`.

## Routing, Auth, And i18n

- `src/proxy.ts` is the middleware. Next.js 16 renamed `middleware.ts` to `proxy.ts`; do not recreate a
  `middleware.ts`. It chains Clerk with next-intl, gates `/admin`, and deliberately skips intl for `/api` and
  `/trpc`.
- Two workarounds in that file are load-bearing. `/admin` is redirected to `/admin/content` inside the proxy
  rather than with an RSC `redirect()`, which throws `NEXT_REDIRECT` and flashes the dev error overlay. The
  matcher explicitly lists `/api/trpc/:path*` so dotted procedure paths still pass through.
- Locales are `fr` (default), `es`, `en`, and `pt`, with `localePrefix: 'always'`. Add every new or changed
  key to all four files in `src/messages/`; a missing entry is a bug.
- Import navigation from `~/i18n/navigation`, not `next/navigation` — Biome enforces this as an error. The
  same rule requires `@phosphor-icons/react/dist/ssr` rather than `@phosphor-icons/react`.
- Message files cover UI strings only. Database-backed content is translated per row through
  `ArticleTranslation`, which is unique on `articleId` plus `locale`.

## UI And Forms

- shadcn/ui in the `new-york` style lives in `src/components/ui/`. Prefer composing those primitives over
  hand-rolling equivalents, and compose class names with `cn` from `~/lib/utils`.
- Tailwind v4 with no config file. Theme tokens are CSS variables in `src/app/globals.css`.
- Zod owns form contracts: shared schemas in `src/schemas/`, admin product schemas in `~/lib`. Use React Hook
  Form with `@hookform/resolvers` for complex or multi-step forms, and `useActionState` for simple ones.
- For animated state changes, prefer React's `<ViewTransition>` component over calling
  `document.startViewTransition` directly.

## Coding Style

Prefer arrow functions, including for components. Use `function` declarations only where Next.js requires a
default export, such as pages and layouts.

## Repository Rules

- Preserve established local patterns and match the file you are editing. Change only what the task requires;
  do not refactor or restyle adjacent code the change does not force you to touch.
- Never edit `generated/` or existing files in `prisma/migrations/`.
- Keep server-only modules out of Client Components. `~/server/*` reaches the database, R2, and MailerSend.
