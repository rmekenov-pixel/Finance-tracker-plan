import { apiClient } from '@/shared/api/apiClient'
import type {
  Goal,
  GoalCategory,
  CreateGoalDto,
  UpdateGoalStatusDto,
  AddDepositDto,
  GoalDeposit,
} from '../model/types'

export const goalApi = {
  getGoals: async (category?: GoalCategory) => {
    const res = await apiClient.get<Goal[]>('/goals', {
      params: category ? { category } : undefined,
    })
    return res.data
  },

  getTopSavings: async () => {
    const res = await apiClient.get<Goal[]>('/goals/savings/top')
    return res.data
  },

  getUpcomingReminders: async () => {
    const res = await apiClient.get<Goal[]>('/goals/reminders/upcoming')
    return res.data
  },

  create: async (dto: CreateGoalDto) => {
    const res = await apiClient.post<Goal>('/goals', dto)
    return res.data
  },

  updateStatus: async (id: string, dto: UpdateGoalStatusDto) => {
    const res = await apiClient.patch<Goal>(`/goals/${id}/status`, dto)
    return res.data
  },

  addDeposit: async (id: string, dto: AddDepositDto) => {
    const res = await apiClient.post<Goal>(`/goals/${id}/deposits`, dto)
    return res.data
  },

  getDeposits: async (id: string) => {
    const res = await apiClient.get<GoalDeposit[]>(`/goals/${id}/deposits`)
    return res.data
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/goals/${id}`)
    return res.data
  },
}
