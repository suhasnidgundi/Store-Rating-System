import { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { Unauthorized, Forbidden } from '../utils/errors'

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined
  if (!token) return next(Unauthorized('Missing access token'))

  try {
    const payload = verifyAccessToken(token)
    // Attach to request
    req.user = { id: payload.sub, role: payload.role }
    return next()
  } catch {
    return next(Unauthorized('Invalid or expired access token'))
  }
}

export function requireRoles(...roles: Array<'ADMIN' | 'USER' | 'OWNER'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' } | undefined
    if (!user) return next(Unauthorized())
    if (!roles.includes(user.role)) return next(Forbidden('Insufficient role'))
    return next()
  }
}
