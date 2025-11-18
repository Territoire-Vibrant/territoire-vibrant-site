import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const articleRouter = createTRPCRouter({
  // hello: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
  //   return {
  //     greeting: `Hello ${input.text}`,
  //   }
  // }),
  // create: publicProcedure.input(z.object({ name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
  //   return ctx.db.post.create({
  //     data: {
  //       name: input.name,
  //     },
  //   })
  // }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const articles = await ctx.db.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          select: { id: true, locale: true, title: true, bodyMd: true, published: true },
        },
      },
    })
    return articles
  }),
  getArticleById: publicProcedure
    .input(
      z.object({
        articleId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const translation = await ctx.db.articleTranslation.findFirst({
        where: { articleId: input.articleId },
        include: { article: true },
      })
      return translation
    }),
  getArticleForEdit: publicProcedure
    .input(
      z.object({
        articleId: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const translation = await ctx.db.articleTranslation.findFirst({
        where: { articleId: input.articleId },
        include: { article: { include: { translations: true } } },
      })
      return translation
    }),
  createArticle: publicProcedure
    .input(
      z.object({
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
        translations: z
          .array(
            z.object({
              locale: z.enum(['en', 'es', 'fr', 'pt']),
              title: z.string().min(1),
              bodyMd: z.string().min(1),
              published: z.boolean().optional(),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.db.article.create({
        data: {
          status: input.status,
          translations: {
            create: input.translations.map((t) => ({
              locale: t.locale,
              title: t.title,
              bodyMd: t.bodyMd,
              published: t.published ?? false,
            })),
          },
        },
        include: { translations: true },
      })
      return created
    }),
  updateArticle: publicProcedure
    .input(
      z.object({
        articleId: z.string().min(1),
        status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
        translations: z.array(
          z.object({
            locale: z.enum(['en', 'es', 'fr', 'pt']),
            title: z.string().min(1),
            bodyMd: z.string().min(1),
            published: z.boolean().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.article.update({ where: { id: input.articleId }, data: { status: input.status } })
      for (const tr of input.translations) {
        await ctx.db.articleTranslation.upsert({
          where: { articleId_locale: { articleId: input.articleId, locale: tr.locale } },
          update: { title: tr.title, bodyMd: tr.bodyMd, published: tr.published ?? false },
          create: {
            articleId: input.articleId,
            locale: tr.locale,
            title: tr.title,
            bodyMd: tr.bodyMd,
            published: tr.published ?? false,
          },
        })
      }
      const updated = await ctx.db.article.findUnique({
        where: { id: input.articleId },
        include: { translations: true },
      })
      return updated
    }),
})
