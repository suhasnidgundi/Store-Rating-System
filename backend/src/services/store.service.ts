import { prisma } from "./prisma.service";
import { Forbidden, NotFound } from "../utils/errors";
import { Prisma } from "@prisma/client";

export async function createStore(
  ownerId: string,
  data: {
    name: string;
    email: string;
    address: string;
    requesterRole: "ADMIN" | "OWNER" | "USER";
  }
) {
  if (!(data.requesterRole === "ADMIN" || data.requesterRole === "OWNER")) {
    throw Forbidden("Only owners or admins can create stores");
  }
  const store = await prisma.store.create({
    data: {
      name: data.name,
      email: data.email,
      address: data.address,
      ownerId,
    },
  });
  return store;
}

export async function updateStore(
  storeId: string,
  requester: { id: string; role: "ADMIN" | "OWNER" | "USER" },
  data: Partial<{ name: string; email: string; address: string }>
) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw NotFound("Store not found");
  if (requester.role !== "ADMIN" && store.ownerId !== requester.id)
    throw Forbidden("Only the store owner or admin can update");
  return prisma.store.update({ where: { id: storeId }, data });
}

export async function deleteStore(
  storeId: string,
  requester: { id: string; role: "ADMIN" | "OWNER" | "USER" }
) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw NotFound("Store not found");
  if (requester.role !== "ADMIN" && store.ownerId !== requester.id)
    throw Forbidden("Only the store owner or admin can delete");
  await prisma.store.delete({ where: { id: storeId } });
}

export async function listStores(params: {
  q?: string;
  ownerId?: string;
  minRating?: number;
  maxRating?: number;
  skip: number;
  take: number;
  sort?: "name" | "rating" | "createdAt";
  order?: "asc" | "desc";
}) {
  const where: Prisma.StoreWhereInput = {
    AND: [
      params.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { email: { contains: params.q } },
              { address: { contains: params.q } },
            ],
          }
        : {},
      params.ownerId ? { ownerId: params.ownerId } : {},
      params.minRating != null
        ? { averageRating: { gte: params.minRating } }
        : {},
      params.maxRating != null
        ? { averageRating: { lte: params.maxRating } }
        : {},
    ],
  };

  const orderBy =
    params.sort === "name"
      ? { name: params.order ?? "asc" }
      : params.sort === "rating"
      ? { averageRating: params.order ?? "desc" }
      : { createdAt: params.order ?? "desc" };

  const [items, total] = await Promise.all([
    prisma.store.findMany({
      where,
      orderBy,
      skip: params.skip,
      take: params.take,
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.store.count({ where }),
  ]);

  return { items, total };
}

export async function getStoreById(id: string) {
  const store = await prisma.store.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
  if (!store) throw NotFound("Store not found");
  return store;
}
