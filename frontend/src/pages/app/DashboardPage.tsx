import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Bell,
  Plus,
  ArrowRight,
  ArrowLeftRight,
  Wallet,
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { Button } from '@/shared/ui/Button'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { Badge } from '@/shared/ui/Badge'
import { CreateTransactionModal } from '@/features/create-transaction/ui/CreateTransactionModal'
import { CreateGoalModal } from '@/features/create-goal/ui/CreateGoalModal'
import { AddDepositModal } from '@/features/add-deposit/ui/AddDepositModal'
import { transactionApi } from '@/entities/transaction/api/transactionApi'
import { goalApi } from '@/entities/goal/api/goalApi'
import { analyticsApi } from '@/entities/analytics/api/analyticsApi'
import type { Transaction, TransactionSummary } from '@/entities/transaction/model/types'
import type { Goal } from '@/entities/goal/model/types'
import type { BalanceTrendPoint } from '@/entities/analytics/model/types'
import { useUserStore } from '@/entities/user/model/userStore'
import { formatCurrency, formatDate } from '@/shared/lib/format'

export const DashboardPage: React.FC = () => {
  const user = useUserStore((state) => state.user)
  const currency = user?.currency || 'KZT'

  const [summary, setSummary] = useState<TransactionSummary>({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [topSavings, setTopSavings] = useState<Goal[]>([])
  const [upcomingReminders, setUpcomingReminders] = useState<Goal[]>([])
  const [miniTrend, setMiniTrend] = useState<BalanceTrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [depositGoal, setDepositGoal] = useState<Goal | null>(null)

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const today = now.toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    try {
      const [sum, recent, savings, reminders, trend] = await Promise.all([
        transactionApi.getSummary({ dateFrom: firstDayOfMonth, dateTo: today }),
        transactionApi.getRecent(),
        goalApi.getTopSavings(),
        goalApi.getUpcomingReminders(),
        analyticsApi.getBalanceTrend({ dateFrom: thirtyDaysAgo, dateTo: today }),
      ])

      setSummary(sum)
      setRecentTransactions(recent)
      setTopSavings(savings)
      setUpcomingReminders(reminders)
      setMiniTrend(trend)
    } catch (err) {
      console.error('Ошибка загрузки данных дашборда:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f0f6fc]">
            С возвращением, {user?.name || 'Пользователь'}! 👋
          </h1>
          <p className="text-xs text-[#8d96a0]">
            Сводка личных финансов и целей за текущий месяц
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setIsGoalModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Добавить цель
          </Button>
          <Button size="sm" onClick={() => setIsTxModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Новая транзакция
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-zinc-500">Загрузка данных...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Balance */}
            <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-[#8d96a0] uppercase tracking-wider">
                  Чистый остаток (Месяц)
                </span>
                <div className="p-1.5 bg-zinc-800/60 border border-zinc-700/60 rounded-md text-zinc-400">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="my-2">
                <span
                  className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight ${
                    Number(summary.balance) >= 0 ? 'text-[#f0f6fc]' : 'text-[#f85149]'
                  }`}
                >
                  {formatCurrency(summary.balance, currency)}
                </span>
              </div>

              {miniTrend.length > 1 && (
                <div className="w-full h-8 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniTrend}>
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(val, currency), 'Баланс']}
                        labelFormatter={(d) => formatDate(String(d))}
                        contentStyle={{
                          backgroundColor: '#161b22',
                          borderColor: '#30363d',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#f0f6fc',
                          padding: '4px 8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#3fb950"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Income */}
            <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xs flex flex-col justify-between">
              <span className="text-xs font-medium text-[#8d96a0] uppercase tracking-wider">
                Доходы за месяц
              </span>
              <div className="my-2">
                <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[#3fb950]">
                  +{formatCurrency(summary.totalIncome, currency)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3fb950] text-xs font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[11px]">Поступления за месяц</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xs flex flex-col justify-between">
              <span className="text-xs font-medium text-[#8d96a0] uppercase tracking-wider">
                Расходы за месяц
              </span>
              <div className="my-2">
                <span className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-[#f85149]">
                  -{formatCurrency(summary.totalExpense, currency)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#f85149] text-xs font-medium">
                <TrendingDown className="w-3.5 h-3.5" />
                <span className="text-[11px]">Суммарные затраты за месяц</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Active Goals & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Savings Goals */}
            <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-[#d29922]" />
                  <h2 className="text-sm font-bold text-[#f0f6fc]">Активные накопления</h2>
                </div>
                <Link
                  to="/app/kanban"
                  className="text-xs text-[#8d96a0] hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                >
                  Все цели <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {topSavings.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8d96a0] bg-zinc-950/40 rounded-lg border border-zinc-800">
                  Активных накоплений пока нет.{' '}
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="text-emerald-400 hover:underline ml-1 cursor-pointer font-medium"
                  >
                    Создать цель
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {topSavings.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-3.5 bg-zinc-900/70 border border-zinc-800/80 rounded-lg flex flex-col gap-2 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-zinc-200">{goal.title}</span>
                        <button
                          onClick={() => setDepositGoal(goal)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                        >
                          + Пополнить
                        </button>
                      </div>
                      <ProgressBar
                        current={Number(goal.currentAmount)}
                        target={Number(goal.targetAmount || 0)}
                        color="bg-amber-400"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple-400" />
                  <h2 className="text-sm font-bold text-[#f0f6fc]">Ближайшие напоминания (ЖКХ, счета)</h2>
                </div>
                <Link
                  to="/app/kanban"
                  className="text-xs text-[#8d96a0] hover:text-purple-400 flex items-center gap-1 font-medium transition-colors"
                >
                  Канбан <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {upcomingReminders.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8d96a0] bg-zinc-950/40 rounded-lg border border-zinc-800">
                  На ближайшие 7 дней напоминаний нет.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-xs font-medium text-zinc-200">{reminder.title}</h3>
                        <p className="text-[11px] text-purple-400 mt-0.5">
                          Дедлайн: {reminder.dueDate ? formatDate(reminder.dueDate) : 'Скоро'}
                        </p>
                      </div>
                      <Badge variant="reminder">НАПОМИНАНИЕ</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xs flex flex-col gap-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-bold text-[#f0f6fc]">Последние транзакции</h2>
                </div>
                <Link
                  to="/app/transactions"
                  className="text-xs text-[#8d96a0] hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                >
                  Все транзакции <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8d96a0] bg-zinc-950/40 rounded-lg border border-zinc-800">
                  Транзакций пока нет.{' '}
                  <button
                    onClick={() => setIsTxModalOpen(true)}
                    className="text-emerald-400 hover:underline ml-1 cursor-pointer font-medium"
                  >
                    Добавить первую запись
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'INCOME'
                    return (
                      <div
                        key={tx.id}
                        className="py-2.5 flex items-center justify-between hover:bg-zinc-800/30 px-2 rounded transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant={isIncome ? 'income' : 'expense'}>
                            {isIncome ? '+ Доход' : '- Расход'}
                          </Badge>
                          <div>
                            <span className="text-xs font-medium text-zinc-200">
                              {tx.description || tx.category}
                            </span>
                            <span className="text-[11px] text-[#8d96a0] block">
                              {tx.category} • {formatDate(tx.date)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-mono font-bold text-xs ${
                            isIncome ? 'text-[#3fb950]' : 'text-[#f85149]'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <CreateTransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <CreateGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={loadDashboardData}
      />

      <AddDepositModal
        goal={depositGoal}
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        onSuccess={loadDashboardData}
      />
    </div>
  )
}
