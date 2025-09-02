import { useAuthStore } from '../stores/auth'
import { api } from '../utils/api'
import type { LoginForm, RegisterForm, User, AuthTokens } from '../types'
import { useMutation } from '@tanstack/react-query'

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/login', data)
      return response
    },
    onSuccess: (data) => {
      login(data.user, data.tokens)
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register', data)
      return response
    },
    onSuccess: (data) => {
      login(data.user, data.tokens)
    },
  })

  const logoutUser = () => {
    logout()
  }

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutUser,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  }
}