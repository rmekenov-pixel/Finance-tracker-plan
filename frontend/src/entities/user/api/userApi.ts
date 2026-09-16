import { apiClient } from '@/shared/api/apiClient'
import type { User } from '../model/userStore'

export interface UpdateProfileDto {
  name: string
  currency?: string
  avatarUrl?: string
}

export interface ChangePasswordDto {
  oldPassword: string
  newPassword: string
}

export const userApi = {
  getProfile: async () => {
    const res = await apiClient.get<User>('/auth/me')
    return res.data
  },

  updateProfile: async (dto: UpdateProfileDto) => {
    const res = await apiClient.patch<User>('/auth/profile', dto)
    return res.data
  },

  changePassword: async (dto: ChangePasswordDto) => {
    const res = await apiClient.post<{ message: string }>('/auth/change-password', dto)
    return res.data
  },

  logout: async () => {
    const res = await apiClient.post<{ message: string }>('/auth/logout')
    return res.data
  },
}
