import nodemailer from 'nodemailer'

import { env } from '~/env'
import { ContactFormSchema, type ContactSubject } from '~/schemas/contact'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
})

const SUBJECT_LABELS: Record<ContactSubject, string> = {
  partnership: 'Propor parceria',
  quote: 'Solicitação de orçamento',
  invitation: 'Convite',
  other: 'Outros',
}

export const contactRouter = createTRPCRouter({
  send: publicProcedure.input(ContactFormSchema).mutation(async ({ input }) => {
    const { name, email, subject, message } = input
    const subjectLabel = SUBJECT_LABELS[subject]

    // Send email via Gmail SMTP
    const emailResult = await transporter.sendMail({
      from: `"Território Vibrante" <${env.SMTP_USER}>`,
      to: env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[${subjectLabel}] Nova mensagem de ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #579514;">Nova mensagem de contato</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Nome:</strong> ${name}</p>
            <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 10px;"><strong>Assunto:</strong> ${subjectLabel}</p>
          </div>
          
          <div style="background: #fff; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Mensagem:</h3>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
          
          <p style="color: #888; font-size: 12px;">
            Esta mensagem foi enviada através do formulário de contato do site Território Vibrante.
          </p>
        </div>
      `,
    })

    return {
      success: true,
      emailId: emailResult.messageId,
    }
  }),
})
