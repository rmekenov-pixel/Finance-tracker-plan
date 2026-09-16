export type GoalCategory = 'SAVING' | 'TASK' | 'REMINDER'
export type GoalStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE'

export interface GoalDeposit {
  id: string
  goalId: string
  amount: number
  comment?: string
  depositedAt: string
}

export interface Goal {
  id: string
  userId: string
  title: string
  category: GoalCategory
  status: GoalStatus
  targetAmount?: number
  currentAmount: number
  dueDate?: string
  sortOrder: number
  color?: string
  createdAt: string
}

export interface CreateGoalDto {
  title: string
  category: GoalCategory
  status?: GoalStatus
  targetAmount?: number
  currentAmount?: number
  dueDate?: string
  color?: string
}

export interface UpdateGoalStatusDto {
  status: GoalStatus
  sortOrder?: number
}

export interface AddDepositDto {
  amount: number
  comment?: string
}
