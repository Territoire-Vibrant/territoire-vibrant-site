import { z } from 'zod'

export const LeadCaptureSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(7, 'Telefone deve ter pelo menos 7 caracteres')
    .regex(/^[\d\s+\-()]+$/, 'Telefone inválido'),
})

export type LeadCaptureDTO = z.infer<typeof LeadCaptureSchema>
