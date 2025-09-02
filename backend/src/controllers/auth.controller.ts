import { Request, Response } from 'express'
import { loginUser, registerUser } from '../services/auth.service'
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../utils/jwt'
import { Unauthorized } from '../utils/errors'

export async function register(req: Request, res: Response) {
  const { user, tokens } = await registerUser(req.body)
  return res.status(201).json({ user, tokens })
}

export async function login(req: Request, res: Response) {
  const { user, tokens } = await loginUser(req.body)
  return res.json({ user, tokens })
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body as { refreshToken: string }
  try {
    const payload = verifyRefreshToken(refreshToken)
    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role })
    const newRefreshToken = signRefreshToken({ sub: payload.sub, role: payload.role })
    return res.json({ tokens: { accessToken, refreshToken: newRefreshToken } })
  } catch {
    throw Unauthorized('Invalid refresh token')
  }
}