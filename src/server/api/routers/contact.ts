import { ContactFormSchema } from '~/schemas/contact'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { sendContactEmail } from '~/server/email/mailersend'

export const contactRouter = createTRPCRouter({
  send: publicProcedure.input(ContactFormSchema).mutation(async ({ input }) => {
    const { name, email, subject, message } = input

    const emailId = await sendContactEmail({ email, message, name, subject })

    return {
      success: true,
      emailId,
    }
  }),
})
