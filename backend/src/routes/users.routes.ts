import { Router } from 'express'
import * as ctl from '../controllers/users.controller'
import { authMiddleware, requireRoles } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { z } from 'zod'

export const usersRouter = Router()

usersRouter.use(authMiddleware)
usersRouter.get('/', requireRoles('ADMIN'), ctl.list)
usersRouter.get('/me', ctl.me)
usersRouter.get('/:id', requireRoles('ADMIN'), ctl.getById)
usersRouter.put(
  '/:id',
  validate(
    z.object({
      body: z.object({ name: z.string().min(2).max(120).optional(), email: z.string().email().optional(), address: z.string().max(255).optional(), role: z.enum(['ADMIN', 'USER', 'OWNER']).optional() }),
      params: z.object({ id: z.string().min(10) }),
      query: z.object({}).passthrough(),
    })
  ),
  ctl.updateById
)
usersRouter.delete('/:id', ctl.remove)