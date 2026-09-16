import React, { useState } from 'react'
import { X, PiggyBank, CheckSquare, Bell } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { goalApi } from '@/entities/goal/api/goalApi'
import type { GoalCategory, GoalStatus } from '@/entities/goal/model/types'

interface CreateGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<GoalCategory>('SAVING')
  const [status, setStatus] = useState<GoalStatus>('PLANNED')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('0')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Введите название карточки')
      return
    }

    if (category === 'SAVING' && (!targetAmount || Number(targetAmount) <= 0)) {
      setError('Для накоплений укажите целевую сумму')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await goalApi.create({
        title: title.trim(),
        category,
        status,
        targetAmount: category === 'SAVING' ? Number(targetAmount) : undefined,
        currentAmount: category === 'SAVING' ? Number(currentAmount) : 0,
        dueDate: dueDate || undefined,
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сохранить цель')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-sm font-bold text-[#f0f6fc] uppercase tracking-wide">Создать цель или задачу</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-[#f85149] text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Category selector pills */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#0a0a0c] p-1 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setCategory('SAVING')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              category === 'SAVING'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            Накопление
          </button>

          <button
            type="button"
            onClick={() => setCategory('TASK')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              category === 'TASK'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Задача
          </button>

          <button
            type="button"
            onClick={() => setCategory('REMINDER')}
            className={`flex flex-col items-center gap-1 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              category === 'REMINDER'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Напоминание
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Input
            label="Название"
            placeholder={
              category === 'SAVING'
                ? 'Например: Ноутбук или Отпуск'
                : category === 'REMINDER'
                ? 'Например: Оплата ЖКХ'
                : 'Например: Закрыть рассрочку'
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          {category === 'SAVING' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Целевая сумма"
                type="number"
                step="any"
                min="1"
                placeholder="500000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
              <Input
                label="Уже накоплено"
                type="number"
                step="any"
                min="0"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
              >
                <option value="PLANNED">В планах</option>
                <option value="IN_PROGRESS">В процессе</option>
                <option value="DONE">Выполнено</option>
              </select>
            </div>

            <Input
              label="Дедлайн (необязательно)"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2.5 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
