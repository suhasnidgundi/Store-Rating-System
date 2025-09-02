import { prisma } from './prisma.service'
import { comparePassword, hashPassword } from '../utils/crypto'
import { Conflict, Unauthorized } from '../utils/errors'
import { signAccessToken, signRefreshToken } from '../utils/jwt'

export async function registerUser(input: { name: string; email: string; password: string; address?: string; role: 'USER' | 'OWNER' }) {
  const exists = await prisma.user.findUnique({ where: { email: input.email } })
  if (exists) throw Conflict('Email already in use')

  const passwordHash = await hashPassword(input.password)
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: passwordHash,
      address: input.address,
      role: input.role,
    },
  })

  const accessToken = signAccessToken({ sub: user.id, role: user.role })
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role })
  return { user: sanitizeUser(user), tokens: { accessToken, refreshToken } }
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw Unauthorized('Invalid credentials')

  const ok = await comparePassword(input.password, user.password)
  if (!ok) throw Unauthorized('Invalid credentials')

  const accessToken = signAccessToken({ sub: user.id, role: user.role })
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role })
  return { user: sanitizeUser(user), tokens: { accessToken, refreshToken } }
}

export function sanitizeUser<T extends { password: string }>(u: T) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = u
  return rest
}