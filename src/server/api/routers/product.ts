import { z } from 'zod'

import { productAdminUpdateSchema, productAdminUpsertSchema, toPrismaProductData } from '~/lib/product-admin-schema'
import { adminProcedure, createTRPCRouter } from '~/server/api/trpc'

export const productRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: { updatedAt: 'desc' },
    })
  }),

  getById: adminProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ ctx, input }) => {
    const product = await ctx.db.product.findUnique({
      where: { id: input.id },
    })
    if (!product) {
      return null
    }
    return product
  }),

  create: adminProcedure.input(productAdminUpsertSchema).mutation(async ({ ctx, input }) => {
    return ctx.db.product.create({
      data: toPrismaProductData(input),
    })
  }),

  update: adminProcedure.input(productAdminUpdateSchema).mutation(async ({ ctx, input }) => {
    const { id, ...rest } = input
    return ctx.db.product.update({
      where: { id },
      data: toPrismaProductData(rest),
    })
  }),
})
