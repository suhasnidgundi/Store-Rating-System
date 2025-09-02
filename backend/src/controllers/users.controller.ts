import { Request, Response } from 'express'
import { listUsers, getUserById, updateUser, deleteUser } from '../services/user.service'
import { parsePagination } from '../utils/pagination'
import { Forbidden } from '../utils/errors'

export async function list(req: Request, res: Response) {
  const { skip, take, page, pageSize } = parsePagination({ page: Number(req.query.page), pageSize: Number(req.query.pageSize) })
  const result = await listUsers(skip, take)
  return res.json({ page, pageSize, total: result.total, items: result.items })
}

export async function me(req: Request, res: Response) {
  const userId: string | undefined = req.user?.id
  if (!userId) throw Forbidden()
  const user = await getUserById(userId)
  return res.json({ user })
}

export async function getById(req: Request, res: Response) {
  const user = await getUserById(req.params.id)
  return res.json({ user })
}

export async function updateById(req: Request, res: Response) {
  const requester = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  if (requester.role !== 'ADMIN' && requester.id !== req.params.id) throw Forbidden('Cannot update other users')
  const user = await updateUser(req.params.id, req.body)
  return res.json({ user })
}

export async function remove(req: Request, res: Response) {
  const requester = req.user as { id: string; role: 'ADMIN' | 'USER' | 'OWNER' }
  if (requester.role !== 'ADMIN' && requester.id !== req.params.id) throw Forbidden('Cannot delete other users')
  await deleteUser(req.params.id)
  return res.status(204).send()
}