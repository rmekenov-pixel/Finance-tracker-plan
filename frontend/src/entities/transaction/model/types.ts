export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: TransactionType
  category: string
  description?: string
  date: string
  createdAt: string
}

export interface CreateTransactionDto {
  amount: number
  type: TransactionType
  category: string
  description?: string
  date: string
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
}
