import path from 'node:path'

import nodemailer from 'nodemailer'

import { env } from '~/env'
import { LeadCaptureSchema } from '~/schemas/lead'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
})

export const leadRouter = createTRPCRouter({
  capture: publicProcedure.input(LeadCaptureSchema).mutation(async ({ ctx, input }) => {
    // Always save to DB first — if this throws, no email is sent
    await ctx.db.lead.create({ data: input })

    // Email delivery is best-effort — failure is logged but non-blocking
    try {
      await transporter.sendMail({
        from: `"Território Vibrante" <${env.SMTP_USER}>`,
        to: input.email,
        subject: 'Seu e-book: Territórios Vibrantes',
        html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#579514">Olá, ${input.name}!</h2>
              <p style="color:#333;line-height:1.6">
                Obrigado pelo interesse no nosso e-book.
                O seu guia gratuito <strong>Territórios Vibrantes</strong> está em anexo neste email.
              </p>
              <p style="color:#333;line-height:1.6">
                Esperamos que seja uma leitura inspiradora!
              </p>
              <hr style="margin:30px 0;border:none;border-top:1px solid #e0e0e0"/>
              <p style="color:#888;font-size:12px">
                Territoire Vibrant® —
                <a href="https://territoirevibrant.ca" style="color:#579514">territoirevibrant.ca</a>
              </p>
            </div>
          `,
        attachments: [
          {
            filename: 'ebook.pdf',
            path: path.join(process.cwd(), 'public', 'ebook.pdf'),
          },
        ],
      })
    } catch (err) {
      // Log but do not throw — lead is already captured in the DB
      console.error('[lead.capture] Email delivery failed:', err)
    }

    return { success: true }
  }),
})
