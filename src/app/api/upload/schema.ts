import { z } from 'zod'

export const UploadResponseSchema = z.object({
  url: z.string().url(),
})

export const UploadErrorSchema = z.object({
  error: z.string(),
})

export const DeleteRequestSchema = z.object({
  url: z.string().url(),
})

export type UploadResponse = z.infer<typeof UploadResponseSchema>
export type UploadError = z.infer<typeof UploadErrorSchema>
