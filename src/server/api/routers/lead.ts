import { LeadCaptureSchema } from '~/schemas/lead'
import { sendEbookEmail } from '~/server/email/mailersend'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

export const leadRouter = createTRPCRouter({
  capture: publicProcedure.input(LeadCaptureSchema).mutation(async ({ ctx, input }) => {
    const { locale, ...leadData } = input

    // Always save to DB first — if this throws, no email is sent
    await ctx.db.lead.create({ data: leadData })

    // Email delivery is best-effort — failure is logged but non-blocking
    try {
      await sendEbookEmail({
        email: input.email,
        locale,
        name: input.name,
      })

      return { success: true, deliveryStatus: 'sent' as const }
    } catch (err) {
      // Log but do not throw — lead is already captured in the DB
      console.error('[lead.capture] Email delivery failed:', err)

      return { success: true, deliveryStatus: 'email_failed' as const }
    }
  }),
})
