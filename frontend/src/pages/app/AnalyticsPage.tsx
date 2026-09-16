import React, { useState, useEffect, useCallback } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react'
import { analyticsApi } from '@/entities/analytics/api/analyticsApi'
import type {
  IncomeExpensePoint,
  CategoryExpensePoint,
  BalanceTrendPoint,
  PeriodType,
} from '@/entities/analytics/model/types'
import { useUserStore } from '@/entities/user/model/userStore'

export const AnalyticsPage: React.FC = () => {
  const currency = useUserStore((state) => state.user?.currency) || 'KZT'
  const [period, setPeriod] = useState<PeriodType>('MONTH')
  const [incomeExpense, setIncomeExpense] = useState<IncomeExpensePoint[]>([])
  const [categoryData, setCategoryData] = useState<CategoryExpensePoint[]>([])
  const [balanceTrend, setBalanceTrend] = useState<BalanceTrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  const getDateRange = (type: PeriodType) => {
    const now = new Date()
    const dateTo = now.toISOString().split('T')[0]
    let fromDate = new Date()

    if (type === 'MONTH') {
      fromDate.setMonth(now.getMonth() - 1)
    } else if (type === 'QUARTER') {
      fromDate.setMonth(now.getMonth() - 3)
    } else if (type === 'YEAR') {
      fromDate.setFullYear(now.getFullYear() - 1)
    }

    const dateFrom = fromDate.toISOString().split('T')[0]
    return { dateFrom, dateTo }
  }

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    const { dateFrom, dateTo } = getDateRange(period)

    try {
      const [ie, cat, trend] = await Promise.all([
        analyticsApi.getIncomeExpense({ dateFrom, dateTo }),
        analyticsApi.getByCategory({ dateFrom, dateTo }),
        analyticsApi.getBalanceTrend({ dateFrom, dateTo }),
      ])
      setIncomeExpense(ie)
      setCategoryData(cat)
      setBalanceTrend(trend)
    } catch (err) {
      console.error('Ошибка загрузки аналитики:', err)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Финансовая аналитика</h1>
          <p className="text-sm text-slate-400">Наглядные отчеты по доходам, расходам и категориям</p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-medium">
          <button
            onClick={() => setPeriod('MONTH')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              period === 'MONTH'
                ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setPeriod('QUARTER')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              period === 'QUARTER'
                ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Квартал
          </button>
          <button
            onClick={() => setPeriod('YEAR')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              period === 'YEAR'
                ? 'bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Год
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-sm text-slate-500">Загрузка графиков...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Income vs Expenses Bar Chart */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Доходы vs Расходы (По периодам)</h2>
            </div>

            {incomeExpense.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-xs text-slate-500">
                Недостаточно данных за выбранный период
              </div>
            ) : (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpense}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      formatter={(val: any) => [`${Number(val).toLocaleString('ru-RU')} ${currency}`, '']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Доходы" />
                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Расходы" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Expenses by Category Pie Chart */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-sm">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Расходы по категориям</h2>
            </div>

            {categoryData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-xs text-slate-500">
                За выбранный период расходов не найдено
              </div>
            ) : (
              <>
                <div className="w-full h-56 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [
                          `${Number(val).toLocaleString('ru-RU')} ${currency}`,
                          '',
                        ]}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#f8fafc',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-3 justify-center text-xs pt-2 border-t border-slate-800">
                  {categoryData.map((item) => (
                    <div key={item.category} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-medium">
                        {item.category}: {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Chart 3: Balance Trend Line Chart (Full width) */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-slate-100 text-sm">Динамика изменения баланса</h2>
            </div>

            {balanceTrend.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-slate-500">
                Недостаточно транзакций для построения графика тренда
              </div>
            ) : (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={12}
                      tickFormatter={(d) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip
                      formatter={(val: any) => [`${Number(val).toLocaleString('ru-RU')} ${currency}`, 'Баланс']}
                      labelFormatter={(d) => (d ? new Date(String(d)).toLocaleDateString('ru-RU') : '')}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#3b82f6' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
