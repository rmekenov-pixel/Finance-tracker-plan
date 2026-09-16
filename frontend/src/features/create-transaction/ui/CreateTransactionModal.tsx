import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { transactionApi } from '@/entities/transaction/api/transactionApi'
import type { TransactionType } from '@/entities/transaction/model/types'

interface CreateTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES_EXPENSE = [
  'Продукты',
  'Жилье & ЖКХ',
  'Транспорт & Авто',
  'Кафе & Рестораны',
  'Здоровье & Медицина',
  'Развлечения & Хобби',
  'Одежда & Покупки',
  'Связь & Интернет',
  'Прочее',
]

const CATEGORIES_INCOME = [
  'Зарплата',
  'Фриланс & Проекты',
  'Инвестиции & Дивиденды',
  'Подарки & Кэшбэк',
  'Продажа вещей',
  'Прочее',
]

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [type, setType] = useState<TransactionType>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(CATEGORIES_EXPENSE[0])
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    setCategory(newType === 'EXPENSE' ? CATEGORIES_EXPENSE[0] : CATEGORIES_INCOME[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setError('Введите корректную сумму')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await transactionApi.create({
        amount: Number(amount),
        type,
        category,
        description: description.trim() || undefined,
        date,
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сохранить запись')
    } finally {
      setLoading(false)
    }
  }

  const currentCategories = type === 'EXPENSE' ? CATEGORIES_EXPENSE : CATEGORIES_INCOME

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl p-5 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-sm font-bold text-[#f0f6fc] uppercase tracking-wide">Новая транзакция</h3>
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

        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#0a0a0c] p-1 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => handleTypeChange('EXPENSE')}
            className={`py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              type === 'EXPENSE'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('INCOME')}
            className={`py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              type === 'INCOME'
                ? 'bg-emerald-500/20 text-[#3fb950] border border-emerald-500/40 shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Доход
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Input
            label="Сумма"
            type="number"
            step="any"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Описание / Заметка (необязательно)"
            placeholder="Например: Супермаркет или Аванс"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Дата"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="flex gap-2.5 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant={type === 'EXPENSE' ? 'danger' : 'primary'}
              className="flex-1"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
