import { Request, Response } from 'express'
import { listRatings, upsertRating, deleteRating } from '../services/rating.service'
import { parsePagination } from '../utils/pagination'

export async function createOrUpdate(req: Request, res: Response) {
  const user = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  const result = await upsertRating({ userId: user.id, storeId: req.body.storeId, rating: req.body.rating })
  return res.status(201).json({ message: 'Rating saved', stats: result })
}

export async function remove(req: Request, res: Response) {
  const requester = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  await deleteRating({ ratingId: req.params.id, requester })
  return res.status(204).send()
}

export async function list(req: Request, res: Response) {
  const { page, pageSize, skip, take } = parsePagination({ page: Number(req.query.page), pageSize: Number(req.query.pageSize) })
  const result = await listRatings(skip, take)
  return res.json({ page, pageSize, total: result.total, items: result.items })
}