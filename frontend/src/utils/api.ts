import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { AuthTokens, ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor: Add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor: Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            try {
              const { data } = await axios.post<{ tokens: AuthTokens } | AuthTokens>(
                `${API_BASE_URL}/auth/refresh`,
                { refreshToken }
              )
              const tokens: AuthTokens = (data as any).tokens ?? (data as any)
              localStorage.setItem('accessToken', tokens.accessToken)
              localStorage.setItem('refreshToken', tokens.refreshToken)
              // Retry original request
              error.config.headers.Authorization = `Bearer ${tokens.accessToken}`
              return this.client.request(error.config)
            } catch {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              window.location.href = '/login'
            }
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<ApiResponse<T> | T> = await this.client.get(url, { params })
    return (response.data as any).data ?? (response.data as any)
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T> | T> = await this.client.post(url, data)
    return (response.data as any).data ?? (response.data as any)
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T> | T> = await this.client.put(url, data)
    return (response.data as any).data ?? (response.data as any)
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T> | T> = await this.client.delete(url)
    return (response.data as any).data ?? (response.data as any)
  }
}

export const api = new ApiClient()