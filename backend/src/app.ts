import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import type { Request, Response } from 'express'
import { config, isDev } from './utils/config'
import { logger } from './utils/logger'
import { generalLimiter } from './middleware/rateLimiter.middleware'
import { apiRouter } from './routes'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'

export const app = express()

app.set('trust proxy', 1)
app.use(helmet())
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  })
)
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(generalLimiter)

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }))

app.use(
  morgan(isDev ? 'dev' : 'combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
)

app.use('/api', apiRouter)

app.use(notFoundHandler)
app.use(errorHandler)