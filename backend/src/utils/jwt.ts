import jwt, { type SignOptions, type Secret } from 'jsonwebtoken'
import { config } from './config'

type JwtPayloadBase = {
  sub: string
  role: 'ADMIN' | 'USER' | 'OWNER'
}

const accessTokenOptions: SignOptions = { expiresIn: config.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
const refreshTokenOptions: SignOptions = { expiresIn: config.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] }

export function signAccessToken(payload: JwtPayloadBase) {
  try {
    console.log('Signing access token for user:', payload.sub)
    const token = jwt.sign({ ...payload }, config.JWT_SECRET as Secret, accessTokenOptions)
    console.log('Access token signed successfully')
    return token
  } catch (error) {
    console.error('signAccessToken error:', error)
    throw error
  }
}

export function signRefreshToken(payload: JwtPayloadBase) {
  try {
    console.log('Signing refresh token for user:', payload.sub)
    const token = jwt.sign({ ...payload }, config.JWT_REFRESH_SECRET as Secret, refreshTokenOptions)
    console.log('Refresh token signed successfully')
    return token
  } catch (error) {
    console.error('signRefreshToken error:', error)
    throw error
  }
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.JWT_SECRET as Secret) as JwtPayloadBase & jwt.JwtPayload
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as Secret) as JwtPayloadBase & jwt.JwtPayload
}