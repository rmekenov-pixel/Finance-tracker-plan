import { apiClient } from '@/shared/api/apiClient'
import type { Transaction, CreateTransactionDto, TransactionSummary, TransactionType } from '../model/types'

export const transactionApi = {
  getTransactions: async (params?: {
    type?: TransactionType
    category?: string
    dateFrom?: string
    dateTo?: string
    page?: number
    size?: number
  }) => {
    const res = await apiClient.get<{ content: Transaction[]; totalElements: number; totalPages: number }>(
      '/transactions',
      { params }
    )
    return res.data
  },

  getSummary: async (params?: { dateFrom?: string; dateTo?: string }) => {
    const res = await apiClient.get<TransactionSummary>('/transactions/summary', { params })
    return res.data
  },

  getRecent: async () => {
    const res = await apiClient.get<Transaction[]>('/transactions/recent')
    return res.data
  },

  create: async (dto: CreateTransactionDto) => {
    const res = await apiClient.post<Transaction>('/transactions', dto)
    return res.data
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(`/transactions/${id}`)
    return res.data
  },
}
