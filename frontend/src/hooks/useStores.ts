import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../utils/api'
import type { Store, StoresQuery, StoreForm, PaginatedResponse } from '../types'

export const useStores = (params?: StoresQuery) => {
  return useQuery({
    queryKey: ['stores', params],
    queryFn: () => api.get<PaginatedResponse<Store>>('/stores', params),
  })
}

export const useStore = (id: string) => {
  return useQuery({
    queryKey: ['store', id],
    queryFn: () => api.get<Store>(`/stores/${id}`),
    enabled: !!id,
  })
}

export const useCreateStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: StoreForm) => api.post<Store>('/stores', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
  })
}

export const useUpdateStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StoreForm> }) =>
      api.put<Store>(`/stores/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
  })
}

export const useDeleteStore = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/stores/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
    },
  })
}