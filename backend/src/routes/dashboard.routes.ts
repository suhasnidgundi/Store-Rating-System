import { Router } from 'express'
import { summary } from '../controllers/dashboard.controller'
import { authMiddleware, requireRoles } from '../middleware/auth.middleware'

export const dashboardRouter = Router()
dashboardRouter.use(authMiddleware, requireRoles('ADMIN'))
dashboardRouter.get('/summary', summary)