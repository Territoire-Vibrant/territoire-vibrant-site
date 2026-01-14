import { PutObjectCommand } from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { R2_BUCKET, R2_PUBLIC_URL, r2Client } from '~/server/r2'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const UploadConfigSchema = z.object({
  allowedTypes: z.array(z.string()),
  maxSize: z.number(),
})

const uploadConfig = UploadConfigSchema.parse({
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize: MAX_FILE_SIZE,
})

export const UploadResponseSchema = z.object({
  url: z.string().url(),
})

export const UploadErrorSchema = z.object({
  error: z.string(),
})

export type UploadResponse = z.infer<typeof UploadResponseSchema>
export type UploadError = z.infer<typeof UploadErrorSchema>

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json<UploadError>({ error: 'No file provided' }, { status: 400 })
    }

    if (!uploadConfig.allowedTypes.includes(file.type)) {
      return NextResponse.json<UploadError>(
        { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    if (file.size > uploadConfig.maxSize) {
      return NextResponse.json<UploadError>(
        { error: 'File too large. Maximum size: 5MB' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const extension = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: `uploads/${filename}`,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })
    )

    const url = `${R2_PUBLIC_URL}/uploads/${filename}`

    return NextResponse.json<UploadResponse>({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json<UploadError>(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
