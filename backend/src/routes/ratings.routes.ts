import { Router } from 'express'
import * as ctl from '../controllers/ratings.controller'
import { authMiddleware, requireRoles } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { ratingCreateOrUpdateSchema, ratingDeleteSchema } from '../utils/validation'

export const ratingsRouter = Router()

ratingsRouter.get('/', ctl.list)
ratingsRouter.use(authMiddleware)
ratingsRouter.post('/', requireRoles('USER', 'ADMIN'), validate(ratingCreateOrUpdateSchema), ctl.createOrUpdate)
ratingsRouter.put('/', requireRoles('USER', 'ADMIN'), validate(ratingCreateOrUpdateSchema), ctl.createOrUpdate)
ratingsRouter.delete('/:id', requireRoles('USER', 'ADMIN'), validate(ratingDeleteSchema), ctl.remove)