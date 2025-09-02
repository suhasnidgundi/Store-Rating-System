import { Request, Response } from 'express'
import { prisma } from '../services/prisma.service'

export async function summary(_req: Request, res: Response) {
  const [users, stores, ratings, topStores] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
    prisma.store.findMany({
      orderBy: [{ averageRating: 'desc' }, { totalRatings: 'desc' }],
      take: 5,
      select: { id: true, name: true, averageRating: true, totalRatings: true },
    }),
  ])

  return res.json({
    users,
    stores,
    ratings,
    topStores,
  })
}