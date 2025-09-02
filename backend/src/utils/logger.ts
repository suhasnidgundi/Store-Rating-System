import { createLogger, format, transports } from 'winston'
import { isDev } from './config'

const { combine, timestamp, json, colorize, printf, errors } = format

const devFormat = combine(
  colorize(),
  timestamp(),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
  })
)

export const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: isDev ? devFormat : combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new transports.Console(),
  ],
})
