import React, { useState } from 'react'
import { X, PiggyBank } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { goalApi } from '@/entities/goal/api/goalApi'
import type { Goal } from '@/entities/goal/model/types'
import { useUserStore } from '@/entities/user/model/userStore'

interface AddDepositModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const AddDepositModal: React.FC<AddDepositModalProps> = ({
  goal,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const currency = useUserStore((state) => state.user?.currency) || 'KZT'
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !goal) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setError('Введите сумму пополнения больше 0')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await goalApi.addDeposit(goal.id, {
        amount: Number(amount),
        comment: comment.trim() || undefined,
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось внести пополнение')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-[#f0f6fc]">Пополнить цель</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8d96a0] hover:text-[#f0f6fc] p-1.5 rounded-lg hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-[#0a0a0c] rounded-xl border border-[#30363d] flex flex-col gap-1.5">
          <span className="text-xs text-[#8d96a0]">Цель</span>
          <span className="text-sm font-semibold text-[#f0f6fc]">{goal.title}</span>
          <span className="text-xs text-[#8d96a0] font-mono mt-1">
            Текущий прогресс: {Number(goal.currentAmount).toLocaleString('ru-RU')} /{' '}
            {Number(goal.targetAmount).toLocaleString('ru-RU')} {currency}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-[#f85149] text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label={`Сумма пополнения (${currency})`}
            type="number"
            step="any"
            min="1"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Комментарий (необязательно)"
            placeholder="Например: Премия или Сдача"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex gap-3 mt-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Внесение...' : 'Пополнить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
