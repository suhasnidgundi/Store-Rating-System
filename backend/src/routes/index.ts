import { Router } from 'express'
import { authRouter } from './auth.routes'
import { usersRouter } from './users.routes'
import { storesRouter } from './stores.routes'
import { ratingsRouter } from './ratings.routes'
import { dashboardRouter } from './dashboard.routes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/stores', storesRouter)
apiRouter.use('/ratings', ratingsRouter)
apiRouter.use('/dashboard', dashboardRouter)