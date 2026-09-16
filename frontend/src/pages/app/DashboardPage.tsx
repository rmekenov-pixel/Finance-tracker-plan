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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            С возвращением, {user?.name || 'Пользователь'}! 👋
          </h1>
          <p className="text-sm text-slate-400">Обзор ваших личных финансов за текущий месяц</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => setIsGoalModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Добавить цель
          </Button>
          <Button size="sm" onClick={() => setIsTxModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Новая транзакция
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-sm text-slate-500">Загрузка дашборда...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Чистый остаток (Месяц)
                </span>
                <div className="p-2 bg-slate-800/80 rounded-xl text-slate-400">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>

              <div className="my-3">
                <span
                  className={`text-3xl font-extrabold ${
                    Number(summary.balance) >= 0 ? 'text-slate-100' : 'text-rose-400'
                  }`}
                >
                  {Number(summary.balance).toLocaleString('ru-RU')} {currency}
                </span>
              </div>

              {miniTrend.length > 1 && (
                <div className="w-full h-10 mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={miniTrend}>
                      <Tooltip
                        formatter={(val: any) => [`${Number(val).toLocaleString('ru-RU')} ${currency}`, '']}
                        labelFormatter={(d) => (d ? new Date(String(d)).toLocaleDateString('ru-RU') : '')}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          fontSize: '11px',
                          padding: '4px 8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Income */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Доходы за месяц
              </span>
              <div className="my-3">
                <span className="text-3xl font-extrabold text-emerald-400">
                  +{Number(summary.totalIncome).toLocaleString('ru-RU')} {currency}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>Поступления за текущий месяц</span>
              </div>
            </div>

            {/* Expenses */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-sm">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Расходы за месяц
              </span>
              <div className="my-3">
                <span className="text-3xl font-extrabold text-rose-400">
                  -{Number(summary.totalExpense).toLocaleString('ru-RU')} {currency}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
                <TrendingDown className="w-4 h-4" />
                <span>Суммарные затраты за месяц</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Active Goals & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Savings Goals */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-amber-400" />
                  <h2 className="font-semibold text-slate-100">Активные накопления</h2>
                </div>
                <Link
                  to="/app/kanban"
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-medium"
                >
                  Все цели <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {topSavings.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  Активных накоплений пока нет.{' '}
                  <button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="text-emerald-400 underline ml-1 cursor-pointer"
                  >
                    Создать цель
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {topSavings.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-4 bg-slate-800/40 border border-slate-800/80 rounded-xl flex flex-col gap-2 hover:border-slate-700 transition-all"
                    >
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-200">{goal.title}</span>
                        <button
                          onClick={() => setDepositGoal(goal)}
                          className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                        >
                          + Пополнить
                        </button>
                      </div>
                      <ProgressBar
                        current={Number(goal.currentAmount)}
                        target={Number(goal.targetAmount || 0)}
                        color="bg-amber-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Reminders */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <h2 className="font-semibold text-slate-100">Ближайшие напоминания (ЖКХ, счета)</h2>
                </div>
                <Link
                  to="/app/kanban"
                  className="text-xs text-slate-400 hover:text-purple-400 flex items-center gap-1 font-medium"
                >
                  Канбан <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {upcomingReminders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  На ближайшие 7 дней напоминаний нет.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="p-4 bg-slate-800/40 border border-slate-800/80 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-slate-200">{reminder.title}</h3>
                        <p className="text-xs text-purple-400 mt-0.5">
                          Дедлайн: {reminder.dueDate ? new Date(reminder.dueDate).toLocaleDateString('ru-RU') : 'Скоро'}
                        </p>
                      </div>
                      <Badge variant="reminder">REMINDER</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Transactions (Full width on bottom) */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-semibold text-slate-100">Последние транзакции</h2>
                </div>
                <Link
                  to="/app/transactions"
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-medium"
                >
                  Все транзакции <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentTransactions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                  Транзакций пока нет.{' '}
                  <button
                    onClick={() => setIsTxModalOpen(true)}
                    className="text-emerald-400 underline ml-1 cursor-pointer"
                  >
                    Добавить первую запись
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {recentTransactions.map((tx) => {
                    const isIncome = tx.type === 'INCOME'
                    return (
                      <div
                        key={tx.id}
                        className="py-3 flex items-center justify-between hover:bg-slate-800/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant={isIncome ? 'income' : 'expense'}>
                            {isIncome ? '+ Доход' : '- Расход'}
                          </Badge>
                          <div>
                            <span className="text-sm font-medium text-slate-200">
                              {tx.description || tx.category}
                            </span>
                            <span className="text-xs text-slate-500 block">
                              {tx.category} • {new Date(tx.date).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-bold text-sm ${
                            isIncome ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isIncome ? '+' : '-'}{Number(tx.amount).toLocaleString('ru-RU')} {currency}
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
