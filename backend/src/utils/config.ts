import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  JWT_SECRET: z.string().min(16, 'JWT_SECRET too short'),
  JWT_EXPIRES_IN: z.string().default('15m'),

  JWT_REFRESH_SECRET: z.string().min(16).default(process.env.JWT_SECRET || 'missing-secret-refresh'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors)
  process.exit(1)
}

export const config = parsed.data
export const isProd = config.NODE_ENV === 'production'
export const isDev = config.NODE_ENV === 'development'
