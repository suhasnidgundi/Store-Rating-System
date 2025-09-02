import { NextFunction, Request, Response } from 'express'
import { HttpError, Internal } from '../utils/errors'
import { logger } from '../utils/logger'

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, 'Route not found'))
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    if (err.statusCode >= 500) logger.error(err.message, { stack: err.stack, details: err.details, code: err.code })
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code, details: err.details },
    })
  }

  logger.error('Unhandled error', { err })
  const e = Internal()
  return res.status(e.statusCode).json({ error: { message: e.message, code: e.code } })
}
