import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { Attachment, EmailParams, MailerSend, Recipient, Sender } from 'mailersend'

import { env } from '~/env'
import type { ContactSubject } from '~/schemas/contact'
import type { LeadLocale } from '~/schemas/lead'

const mailerSend = new MailerSend({
  apiKey: env.MAILERSEND_API_KEY,
})

const APP_NAME = 'Território Vibrante'
const SITE_URL = 'https://territoirevibrant.ca'

const CONTACT_SUBJECT_LABELS: Record<ContactSubject, string> = {
  partnership: 'Propor parceria',
  quote: 'Solicitação de orçamento',
  invitation: 'Convite',
  other: 'Outros',
}

const EBOOK_EMAIL_CONTENT: Record<
  LeadLocale,
  {
    subject: string
    greeting: (name: string) => string
    intro: string
    outro: string
    footer: string
  }
> = {
  en: {
    subject: 'Your e-book: Vibrant Territories',
    greeting: (name) => `Hello, ${name}!`,
    intro:
      'Thank you for your interest in our e-book. Your free guide, "Vibrant Territories", is attached to this email.',
    outro: 'We hope it inspires your next project.',
    footer: 'Território Vibrante',
  },
  es: {
    subject: 'Tu e-book: Territorios Vibrantes',
    greeting: (name) => `¡Hola, ${name}!`,
    intro:
      'Gracias por tu interés en nuestro e-book. Tu guía gratuita, "Territorios Vibrantes", está adjunta a este correo.',
    outro: 'Esperamos que inspire tu próximo proyecto.',
    footer: 'Território Vibrante',
  },
  fr: {
    subject: 'Votre e-book : Territoires Vibrants',
    greeting: (name) => `Bonjour, ${name} !`,
    intro: `Merci pour votre intérêt pour notre e-book. Votre guide gratuit, "Territoires Vibrants", est joint à cet email.`,
    outro: "Nous espérons qu'il inspirera votre prochain projet.",
    footer: 'Território Vibrante',
  },
  pt: {
    subject: 'Seu e-book: Territórios Vibrantes',
    greeting: (name) => `Olá, ${name}!`,
    intro:
      'Obrigado pelo interesse no nosso e-book. O seu guia gratuito "Territórios Vibrantes" está anexado neste email.',
    outro: 'Esperamos que ele inspire o seu próximo projeto.',
    footer: 'Território Vibrante',
  },
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const sendEmail = async (params: {
  attachments?: Array<{ content: string; filename: string }>
  html: string
  replyTo?: { email: string; name?: string }
  subject: string
  text: string
  to: Array<{ email: string; name?: string }>
}) => {
  const emailParams = new EmailParams()
    .setFrom(new Sender(env.MAILERSEND_FROM_EMAIL, APP_NAME))
    .setTo(params.to.map((recipient) => new Recipient(recipient.email, recipient.name ?? recipient.email)))
    .setSubject(params.subject)
    .setHtml(params.html)
    .setText(params.text)

  if (params.replyTo) {
    emailParams.setReplyTo(new Recipient(params.replyTo.email, params.replyTo.name ?? params.replyTo.email))
  }

  if (params.attachments?.length) {
    emailParams.setAttachments(
      params.attachments.map((attachment) => new Attachment(attachment.content, attachment.filename, 'attachment'))
    )
  }

  const response = await mailerSend.email.send(emailParams)
  const emailId = response.headers?.['x-message-id']

  if (!emailId || typeof emailId !== 'string') {
    throw new Error('MailerSend did not return a message id.')
  }

  return emailId
}

export const sendContactEmail = async (input: {
  email: string
  message: string
  name: string
  subject: ContactSubject
}) => {
  const name = escapeHtml(input.name)
  const email = escapeHtml(input.email)
  const message = escapeHtml(input.message)
  const subjectLabel = CONTACT_SUBJECT_LABELS[input.subject]

  return sendEmail({
    to: [{ email: env.CONTACT_EMAIL }],
    replyTo: { email: input.email, name: input.name },
    subject: `[${subjectLabel}] Nova mensagem de ${input.name}`,
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
    text: [
      'Nova mensagem de contato',
      '',
      `Nome: ${input.name}`,
      `Email: ${input.email}`,
      `Assunto: ${subjectLabel}`,
      '',
      'Mensagem:',
      input.message,
    ].join('\n'),
  })
}

export const sendEbookEmail = async (input: { email: string; locale: LeadLocale; name: string }) => {
  const content = EBOOK_EMAIL_CONTENT[input.locale]
  const ebookContent = await readFile(path.join(process.cwd(), 'public', 'ebook.pdf'))

  return sendEmail({
    to: [{ email: input.email, name: input.name }],
    subject: content.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #579514;">${escapeHtml(content.greeting(input.name))}</h2>
        <p style="color: #333; line-height: 1.6;">
          ${escapeHtml(content.intro)}
        </p>
        <p style="color: #333; line-height: 1.6;">
          ${escapeHtml(content.outro)}
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />
        <p style="color: #888; font-size: 12px;">
          ${escapeHtml(content.footer)} -
          <a href="${SITE_URL}" style="color: #579514;">${SITE_URL.replace('https://', '')}</a>
        </p>
      </div>
    `,
    text: [
      content.greeting(input.name),
      '',
      content.intro,
      '',
      content.outro,
      '',
      `${content.footer} - ${SITE_URL}`,
    ].join('\n'),
    attachments: [
      {
        filename: 'ebook.pdf',
        content: ebookContent.toString('base64'),
      },
    ],
  })
}
