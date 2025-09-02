import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  address: z.string().optional(),
  role: z.enum(['USER', 'OWNER']),
})

export const storeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().min(2, 'Address must be at least 2 characters'),
})

export const ratingSchema = z.object({
  storeId: z.string().min(10, 'Invalid store ID'),
  rating: z.number().int().min(1).max(5),
})