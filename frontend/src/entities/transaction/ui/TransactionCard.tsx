import React from 'react'
import { Trash2 } from 'lucide-react'
import type { Transaction } from '../model/types'
import { Badge } from '@/shared/ui/Badge'
import { useUserStore } from '@/entities/user/model/userStore'
import { formatCurrency, formatDate } from '@/shared/lib/format'

interface TransactionCardProps {
  transaction: Transaction
  onDelete?: (id: string) => void
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onDelete }) => {
  const currency = useUserStore((state) => state.user?.currency) || 'KZT'
  const isIncome = transaction.type === 'INCOME'

  return (
    <div className="p-3.5 flex items-center justify-between hover:bg-zinc-800/40 transition-colors border-b border-zinc-800/80 last:border-0">
      <div className="flex items-center gap-3">
        <Badge variant={isIncome ? 'income' : 'expense'}>
          {isIncome ? '+ Доход' : '- Расход'}
        </Badge>
        <div>
          <h4 className="text-xs font-semibold text-zinc-200">
            {transaction.description || transaction.category}
          </h4>
          <p className="text-[11px] text-[#8d96a0]">
            Категория: {transaction.category} • {formatDate(transaction.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`font-mono font-bold text-xs ${
            isIncome ? 'text-[#3fb950]' : 'text-[#f85149]'
          }`}
        >
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
        </span>

        {onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
            title="Удалить"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
