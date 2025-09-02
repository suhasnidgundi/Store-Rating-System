export class HttpError extends Error {
  statusCode: number
  code?: string
  details?: unknown

  constructor(statusCode: number, message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    Error.captureStackTrace?.(this, this.constructor)
  }
}

export const BadRequest = (message = 'Bad Request', details?: unknown) => new HttpError(400, message, 'BAD_REQUEST', details)
export const Unauthorized = (message = 'Unauthorized') => new HttpError(401, message, 'UNAUTHORIZED')
export const Forbidden = (message = 'Forbidden') => new HttpError(403, message, 'FORBIDDEN')
export const NotFound = (message = 'Not Found') => new HttpError(404, message, 'NOT_FOUND')
export const Conflict = (message = 'Conflict') => new HttpError(409, message, 'CONFLICT')
export const Unprocessable = (message = 'Unprocessable Entity', details?: unknown) => new HttpError(422, message, 'UNPROCESSABLE_ENTITY', details)
export const TooMany = (message = 'Too Many Requests') => new HttpError(429, message, 'TOO_MANY_REQUESTS')
export const Internal = (message = 'Internal Server Error', details?: unknown) => new HttpError(500, message, 'INTERNAL', details)
