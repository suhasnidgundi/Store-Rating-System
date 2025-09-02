import { prisma } from "./prisma.service";
import { NotFound } from "../utils/errors";

export async function listUsers(skip: number, take: number) {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count(),
  ]);
  return { items, total };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) throw NotFound("User not found");
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    address?: string;
    role: "ADMIN" | "USER" | "OWNER";
  }>
) {
  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
