import React from 'react'
import { Calendar, Bell, CheckSquare, Square, Trash2, PlusCircle } from 'lucide-react'
import type { Goal } from '../model/types'
import { Badge } from '@/shared/ui/Badge'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { useUserStore } from '@/entities/user/model/userStore'

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

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col gap-3 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {isTask && onToggleTask && (
            <button
              onClick={() => onToggleTask(goal)}
              className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isDone ? (
                <CheckSquare className="w-4 h-4 text-emerald-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          )}

          <h4
            className={`text-sm font-semibold leading-tight text-slate-100 ${
              isDone && isTask ? 'line-through text-slate-500' : ''
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
            {goal.category}
          </Badge>

          {onDelete && (
            <button
              onClick={() => onDelete(goal.id)}
              className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
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
            color={isDone ? 'bg-emerald-500' : 'bg-amber-500'}
          />
          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span>
              {Number(goal.currentAmount).toLocaleString('ru-RU')} / {Number(goal.targetAmount).toLocaleString('ru-RU')} {currency}
            </span>
            {onAddDeposit && !isDone && (
              <button
                onClick={() => onAddDeposit(goal)}
                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Пополнить
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reminder / Due date */}
      {goal.dueDate && (
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <span className="flex items-center gap-1.5">
            {isReminder ? (
              <Bell className="w-3.5 h-3.5 text-purple-400" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            )}
            До {new Date(goal.dueDate).toLocaleDateString('ru-RU')}
          </span>
          {isDone && <span className="text-emerald-400 font-medium">Выполнено</span>}
        </div>
      )}
    </div>
  )
}
