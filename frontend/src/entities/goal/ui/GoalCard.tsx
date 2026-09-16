import React from 'react'
import { Calendar, Bell, CheckSquare, Square, Trash2, PlusCircle } from 'lucide-react'
import type { Goal } from '../model/types'
import { Badge } from '@/shared/ui/Badge'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { useUserStore } from '@/entities/user/model/userStore'
import { formatCurrency, formatDate } from '@/shared/lib/format'

interface GoalCardProps {
  goal: Goal
  onDelete?: (id: string) => void
  onAddDeposit?: (goal: Goal) => void
  onToggleTask?: (goal: Goal) => void
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onDelete,
  onAddDeposit,
  onToggleTask,
}) => {
  const currency = useUserStore((state) => state.user?.currency) || 'KZT'
  const isSaving = goal.category === 'SAVING'
  const isTask = goal.category === 'TASK'
  const isReminder = goal.category === 'REMINDER'
  const isDone = goal.status === 'DONE'

  const categoryLabels = {
    SAVING: 'Накопление',
    TASK: 'Задача',
    REMINDER: 'Напоминание',
  }

  return (
    <div className="p-3.5 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xs flex flex-col gap-2.5 hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {isTask && onToggleTask && (
            <button
              onClick={() => onToggleTask(goal)}
              className="text-zinc-500 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isDone ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          )}

          <h4
            className={`text-xs font-semibold leading-snug text-zinc-100 ${
              isDone && isTask ? 'line-through text-zinc-500' : ''
            }`}
          >
            {goal.title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Badge
            variant={
              isSaving
                ? 'saving'
                : isTask
                ? 'task'
                : isReminder
                ? 'reminder'
                : 'default'
            }
          >
            {categoryLabels[goal.category] || goal.category}
          </Badge>

          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Удалить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Saving Content */}
      {isSaving && goal.targetAmount && (
        <div className="flex flex-col gap-2 pt-1">
          <ProgressBar
            current={Number(goal.currentAmount)}
            target={Number(goal.targetAmount)}
            color={isDone ? 'bg-emerald-500' : 'bg-amber-400'}
          />
          <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 pt-0.5">
            <span>
              {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
            </span>
            {onAddDeposit && !isDone && (
              <button
                onClick={() => onAddDeposit(goal)}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                <PlusCircle className="w-3 h-3" />
                Пополнить
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reminder / Due date */}
      {goal.dueDate && (
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/80">
          <span className="flex items-center gap-1.5">
            {isReminder ? (
              <Bell className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            )}
            До {formatDate(goal.dueDate)}
          </span>
          {isDone && <span className="text-[#3fb950] font-medium">Выполнено</span>}
        </div>
      )}
    </div>
  )
}
