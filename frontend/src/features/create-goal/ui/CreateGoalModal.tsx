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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">Создать цель или задачу</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Category selector pills */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setCategory('SAVING')}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              category === 'SAVING'
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PiggyBank className="w-4 h-4" />
            Накопление
          </button>

          <button
            type="button"
            onClick={() => setCategory('TASK')}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              category === 'TASK'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Задача
          </button>

          <button
            type="button"
            onClick={() => setCategory('REMINDER')}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              category === 'REMINDER'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            Напоминание
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <label className="text-xs font-medium text-slate-400">Статус</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="PLANNED">Запланировано</option>
                <option value="IN_PROGRESS">В процессе</option>
                <option value="DONE">Готово</option>
              </select>
            </div>

            <Input
              label="Дедлайн (необязательно)"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-3">
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
