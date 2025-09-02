import { prisma } from './prisma.service'
import { Forbidden, NotFound } from '../utils/errors'

export async function upsertRating(params: { userId: string; storeId: string; rating: number }) {
  // Prevent owners from rating their own store
  const store = await prisma.store.findUnique({ where: { id: params.storeId }, select: { ownerId: true } })
  if (!store) throw NotFound('Store not found')
  if (store.ownerId === params.userId) throw Forbidden('Owners cannot rate their own stores')

  return prisma.$transaction(async (tx) => {
    const existing = await tx.rating.findUnique({ where: { user_store_unique: { userId: params.userId, storeId: params.storeId } } })
    if (existing) {
      await tx.rating.update({ where: { id: existing.id }, data: { rating: params.rating } })
    } else {
      await tx.rating.create({ data: { userId: params.userId, storeId: params.storeId, rating: params.rating } })
    }

    const agg = await tx.rating.aggregate({
      where: { storeId: params.storeId },
      _avg: { rating: true },
      _count: { rating: true },
    })
    const average = Number(agg._avg.rating ?? 0)
    const count = agg._count.rating

    await tx.store.update({
      where: { id: params.storeId },
      data: { averageRating: average, totalRatings: count },
    })

    return { averageRating: average, totalRatings: count }
  })
}

export async function deleteRating(params: { ratingId: string; requester: { id: string; role: 'ADMIN' | 'OWNER' | 'USER' } }) {
  const rating = await prisma.rating.findUnique({ where: { id: params.ratingId } })
  if (!rating) throw NotFound('Rating not found')
  if (params.requester.role !== 'ADMIN' && rating.userId !== params.requester.id) throw Forbidden('Not allowed')

  return prisma.$transaction(async (tx) => {
    await tx.rating.delete({ where: { id: params.ratingId } })
    const agg = await tx.rating.aggregate({
      where: { storeId: rating.storeId },
      _avg: { rating: true },
      _count: { rating: true },
    })
    await tx.store.update({
      where: { id: rating.storeId },
      data: {
        averageRating: Number(agg._avg.rating ?? 0),
        totalRatings: agg._count.rating,
      },
    })
  })
}

export async function listRatings(skip: number, take: number) {
  const [items, total] = await Promise.all([
    prisma.rating.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        store: { select: { id: true, name: true } },
      },
    }),
    prisma.rating.count(),
  ])
  return { items, total }
}