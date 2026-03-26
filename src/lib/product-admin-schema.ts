import { z } from 'zod'

export const productTypeSchema = z.enum(['PHYSICAL', 'DIGITAL'])

export const productAdminUpsertSchema = z
  .object({
    name: z.string().min(1).max(500),
    description: z.string().max(20000).optional(),
    price: z.number().finite().positive().max(99_999_999),
    type: productTypeSchema,
    imageUrl: z.string().max(2048).optional(),
    isActive: z.boolean(),
    amazonUrl: z.string().max(2048).optional(),
  })
  .superRefine((data, ctx) => {
    for (const key of ['imageUrl', 'amazonUrl'] as const) {
      const raw = data[key]
      const s = raw?.trim() ?? ''
      if (!s) {
        continue
      }
      if (!z.string().url().safeParse(s).success) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid URL', path: [key] })
      }
    }
  })

export const productAdminUpdateSchema = productAdminUpsertSchema.extend({
  id: z.string().uuid(),
})

export type ProductAdminUpsertInput = z.infer<typeof productAdminUpsertSchema>

/** Maps optional strings to null for Prisma nullable columns. */
export function toPrismaProductData(input: ProductAdminUpsertInput) {
  return {
    name: input.name,
    description: (input.description?.trim() ?? '') || null,
    price: input.price,
    type: input.type,
    imageUrl: (input.imageUrl?.trim() ?? '') || null,
    isActive: input.isActive,
    amazonUrl: (input.amazonUrl?.trim() ?? '') || null,
  }
}
