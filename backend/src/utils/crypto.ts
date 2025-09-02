import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 12

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}
