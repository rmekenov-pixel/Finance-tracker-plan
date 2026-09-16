import React, { useState, useEffect, useCallback } from 'react'
import { Plus, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { TransactionCard } from '@/entities/transaction/ui/TransactionCard'
import { CreateTransactionModal } from '@/features/create-transaction/ui/CreateTransactionModal'
import { transactionApi } from '@/entities/transaction/api/transactionApi'
import type { Transaction, TransactionSummary, TransactionType } from '@/entities/transaction/model/types'
import { useUserStore } from '@/entities/user/model/userStore'
import { formatCurrency } from '@/shared/lib/format'

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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f0f6fc]">Транзакции</h1>
          <p className="text-xs text-[#8d96a0]">История и учет всех ваших доходов и расходов</p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Добавить запись
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-xs font-medium text-[#8d96a0] uppercase tracking-wider">Всего доходов</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#3fb950]">
              +{formatCurrency(summary.totalIncome, currency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#3fb950] text-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">Сумма всех поступлений</span>
          </div>
        </div>

        <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-xs font-medium text-[#8d96a0] uppercase tracking-wider">Всего расходов</span>
          <div className="my-1.5">
            <span className="text-2xl font-bold font-mono tracking-tight text-[#f85149]">
              -{formatCurrency(summary.totalExpense, currency)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[#f85149] text-xs">
            <TrendingDown className="w-3.5 h-3.5" />
            <span className="text-[11px]">Сумма всех затрат</span>
          </div>
        </div>

        <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-between shadow-xs">
          <span className="text-xs font-medium text-[#8d96a0] uppercase tracking-wider">Итоговый баланс</span>
          <div className="my-1.5">
            <span
              className={`text-2xl font-bold font-mono tracking-tight ${
                Number(summary.balance) >= 0 ? 'text-[#f0f6fc]' : 'text-[#f85149]'
              }`}
            >
              {formatCurrency(summary.balance, currency)}
            </span>
          </div>
          <span className="text-[11px] text-[#8d96a0]">Доходы минус расходы</span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <Input
            placeholder="Поиск по категории..."
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700/80 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="">Все типы</option>
            <option value="INCOME">Только доходы</option>
            <option value="EXPENSE">Только расходы</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center text-xs text-zinc-500">Загрузка транзакций...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-2.5">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-300">Записей пока нет</h3>
            <p className="text-[11px] text-zinc-500 max-w-sm">
              Нажмите «Добавить запись», чтобы внести свой первый доход или расход.
            </p>
            <Button size="sm" onClick={() => setIsModalOpen(true)} className="mt-1">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Добавить транзакцию
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
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
