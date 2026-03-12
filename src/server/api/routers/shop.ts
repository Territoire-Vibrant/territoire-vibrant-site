import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import Stripe from 'stripe'
import { env } from '~/env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const shopRouter = createTRPCRouter({
  createCheckoutSession: publicProcedure.input(z.object({ productId: z.string() })).mutation(async ({ ctx, input }) => {
    const product = await ctx.db.product.findUnique({
      where: { id: input.productId },
    })

    if (!product) throw new Error('Product not found')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad', // default to CAD, can be adjusted
            product_data: {
              name: product.name,
              description: product.description ?? undefined,
              images: product.imageUrl ? [product.imageUrl] : undefined,
            },
            unit_amount: Math.round(Number(product.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/shop?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/shop?canceled=true`,
    })

    return { url: session.url }
  }),
})
