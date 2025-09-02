import { Request, Response } from 'express'
import { createStore, deleteStore, getStoreById, listStores, updateStore } from '../services/store.service'
import { parsePagination } from '../utils/pagination'

export async function create(req: Request, res: Response) {
  const requester = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  const store = await createStore(requester.id, { ...req.body, requesterRole: requester.role })
  return res.status(201).json({ store })
}

export async function update(req: Request, res: Response) {
  const requester = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  const store = await updateStore(req.params.id, requester, req.body)
  return res.json({ store })
}

export async function remove(req: Request, res: Response) {
  const requester = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  await deleteStore(req.params.id, requester)
  return res.status(204).send()
}

export async function getOne(req: Request, res: Response) {
  const store = await getStoreById(req.params.id)
  return res.json({ store })
}

export async function list(req: Request, res: Response) {
  const { page, pageSize, skip, take } = parsePagination({ page: Number(req.query.page), pageSize: Number(req.query.pageSize) })
  const result = await listStores({
    q: req.query.q as string | undefined,
    ownerId: req.query.ownerId as string | undefined,
    minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
    maxRating: req.query.maxRating ? Number(req.query.maxRating) : undefined,
    skip,
    take,
    sort: (req.query.sort as 'name' | 'rating' | 'createdAt') || 'createdAt',
    order: (req.query.order as 'asc' | 'desc') || 'desc',
  })
  return res.json({ page, pageSize, total: result.total, items: result.items })
}