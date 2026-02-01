import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '~/env'

// Normalize SSL mode to avoid pg v9 warning: prefer/require/verify-ca → verify-full (current behavior)
const connectionString = env.DATABASE_URL.replace(
  /([?&])sslmode=(?:prefer|require|verify-ca)(?=&|$)/i,
  '$1sslmode=verify-full'
)

const adapter = new PrismaPg({
  connectionString,
})

const createPrismaClient = () => new PrismaClient({ adapter })

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db
