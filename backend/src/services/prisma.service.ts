import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'
import { isDev } from '../utils/config'

export const prisma = new PrismaClient({
  log: isDev ? ['query', 'error', 'warn'] : ['error'],
})

export async function initPrisma() {
  try {
    await prisma.$connect()
    logger.info('Prisma connected')
  } catch (err) {
    logger.error('Prisma connection error', { err })
    process.exit(1)
  }
}
