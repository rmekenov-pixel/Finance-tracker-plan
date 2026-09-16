export interface IncomeExpensePoint {
  period: string
  income: number
  expense: number
}

export interface CategoryExpensePoint {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface BalanceTrendPoint {
  date: string
  balance: number
}

export type PeriodType = 'MONTH' | 'QUARTER' | 'YEAR'
