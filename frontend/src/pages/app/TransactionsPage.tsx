import React, { useState, useEffect, useCallback } from 'react'
import { Plus, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { TransactionCard } from '@/entities/transaction/ui/TransactionCard'
import { CreateTransactionModal } from '@/features/create-transaction/ui/CreateTransactionModal'
import { transactionApi } from '@/entities/transaction/api/transactionApi'
import type { Transaction, TransactionSummary, TransactionType } from '@/entities/transaction/model/types'
import { useUserStore } from '@/entities/user/model/userStore'

export const TransactionsPage: React.FC = () => {
  const currency = useUserStore((state) => state.user?.currency) || 'KZT'
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [summary, setSummary] = useState<TransactionSummary>({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [txData, sumData] = await Promise.all([
        transactionApi.getTransactions({
          type: typeFilter ? typeFilter : undefined,
          category: categoryFilter ? categoryFilter : undefined,
          size: 50,
        }),
        transactionApi.getSummary(),
      ])
      setTransactions(txData.content)
      setSummary(sumData)
    } catch (err) {
      console.error('Ошибка загрузки транзакций:', err)
    } finally {
      setLoading(false)
    }
  }, [typeFilter, categoryFilter])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      try {
        await transactionApi.delete(id)
        loadData()
      } catch (err) {
        alert('Не удалось удалить транзакцию')
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Транзакции</h1>
          <p className="text-sm text-slate-400">История и учет всех ваших доходов и расходов</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Добавить запись
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Всего доходов</span>
          <div className="my-2">
            <span className="text-2xl font-bold text-emerald-400">
              +{Number(summary.totalIncome).toLocaleString('ru-RU')} {currency}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Сумма всех поступлений</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Всего расходов</span>
          <div className="my-2">
            <span className="text-2xl font-bold text-rose-400">
              -{Number(summary.totalExpense).toLocaleString('ru-RU')} {currency}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 text-xs">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Сумма всех затрат</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Итоговый баланс</span>
          <div className="my-2">
            <span
              className={`text-2xl font-bold ${
                Number(summary.balance) >= 0 ? 'text-slate-100' : 'text-rose-400'
              }`}
            >
              {Number(summary.balance).toLocaleString('ru-RU')} {currency}
            </span>
          </div>
          <span className="text-xs text-slate-500">Доходы минус расходы</span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Input
            placeholder="Поиск по категории..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="">Все типы</option>
            <option value="INCOME">Только доходы</option>
            <option value="EXPENSE">Только расходы</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Загрузка транзакций...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="p-3 bg-slate-800 rounded-2xl text-slate-500">
              <ArrowLeftRight className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-slate-300">Записей пока нет</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Нажмите «Добавить запись», чтобы внести свой первый доход или расход.
            </p>
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="mt-2">
              <Plus className="w-4 h-4 mr-1.5" />
              Добавить транзакцию
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {transactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  )
}
