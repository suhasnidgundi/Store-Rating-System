export interface User {
  id: string
  name: string
  email: string
  address?: string
  role: 'ADMIN' | 'USER' | 'OWNER'
  createdAt: string
  updatedAt: string
}

export interface Store {
  id: string
  name: string
  email: string
  address: string
  ownerId: string
  averageRating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
  owner: Pick<User, 'id' | 'name' | 'email'>
}

export interface Rating {
  id: string
  userId: string
  storeId: string
  rating: number
  createdAt: string
  updatedAt: string
  user: Pick<User, 'id' | 'name' | 'email'>
  store: Pick<Store, 'id' | 'name'>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  address?: string
  role: 'USER' | 'OWNER'
}

export interface StoreForm {
  name: string
  email: string
  address: string
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface StoresQuery extends PaginationParams {
  q?: string
  ownerId?: string
  minRating?: number
  maxRating?: number
  sort?: 'name' | 'rating' | 'createdAt'
  order?: 'asc' | 'desc'
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}