import React from 'react'
import { Trash2 } from 'lucide-react'
import type { Transaction } from '../model/types'
import { Badge } from '@/shared/ui/Badge'
import { useUserStore } from '@/entities/user/model/userStore'

interface TransactionCardProps {
  transaction: Transaction
  onDelete?: (id: string) => void
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onDelete }) => {
  const currency = useUserStore((state) => state.user?.currency) || 'KZT'
  const isIncome = transaction.type === 'INCOME'

  return (
    <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors border-b border-slate-800/80 last:border-0">
      <div className="flex items-center gap-4">
        <Badge variant={isIncome ? 'income' : 'expense'}>
          {isIncome ? '+ Доход' : '- Расход'}
        </Badge>
        <div>
          <h4 className="text-sm font-semibold text-slate-200">
            {transaction.description || transaction.category}
          </h4>
          <p className="text-xs text-slate-400">
            Категория: {transaction.category} • {new Date(transaction.date).toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span
          className={`font-bold text-base ${
            isIncome ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {isIncome ? '+' : '-'}{Number(transaction.amount).toLocaleString('ru-RU')} {currency}
        </span>

        {onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Удалить"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
