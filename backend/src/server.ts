import { app } from './app'
import { config } from './utils/config'
import { initPrisma } from './services/prisma.service'
import { logger } from './utils/logger'

async function bootstrap() {
  await initPrisma()

  app.listen(config.PORT, () => {
    logger.info(`API listening on http://localhost:${config.PORT}`)
  })
}

bootstrap().catch((err) => {
  logger.error('Failed to start server', { err })
  process.exit(1)
})