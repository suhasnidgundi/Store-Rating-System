import jwt, { type SignOptions, type Secret } from 'jsonwebtoken'
import { config } from './config'

type JwtPayloadBase = {
  sub: string
  role: 'ADMIN' | 'USER' | 'OWNER'
}

const accessTokenOptions: SignOptions = { expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
const refreshTokenOptions: SignOptions = { expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] }

export function signAccessToken(payload: JwtPayloadBase) {
  return jwt.sign({ ...payload }, config.JWT_SECRET as Secret, accessTokenOptions)
}

export function signRefreshToken(payload: JwtPayloadBase) {
  return jwt.sign({ ...payload }, config.JWT_REFRESH_SECRET as Secret, refreshTokenOptions)
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.JWT_SECRET as Secret) as JwtPayloadBase & jwt.JwtPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as Secret) as JwtPayloadBase & jwt.JwtPayload
}