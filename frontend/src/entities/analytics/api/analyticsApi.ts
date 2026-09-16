import { apiClient } from '@/shared/api/apiClient'
import type {
  IncomeExpensePoint,
  CategoryExpensePoint,
  BalanceTrendPoint,
} from '../model/types'

export const analyticsApi = {
  getIncomeExpense: async (params?: { dateFrom?: string; dateTo?: string }) => {
    const res = await apiClient.get<IncomeExpensePoint[]>('/analytics/income-expense', {
      params,
    })
    return res.data
  },

  getByCategory: async (params?: { dateFrom?: string; dateTo?: string }) => {
    const res = await apiClient.get<CategoryExpensePoint[]>('/analytics/by-category', {
      params,
    })
    return res.data
  },

  getBalanceTrend: async (params?: { dateFrom?: string; dateTo?: string }) => {
    const res = await apiClient.get<BalanceTrendPoint[]>('/analytics/balance-trend', {
      params,
    })
    return res.data
  },
}
