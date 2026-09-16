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
import { formatCurrency, formatDate } from '@/shared/lib/format'

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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f0f6fc]">Финансовая аналитика</h1>
          <p className="text-xs text-[#8d96a0]">Наглядные отчеты по доходам, расходам и категориям</p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-[#161b22] border border-[#30363d] rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setPeriod('MONTH')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              period === 'MONTH'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                : 'text-[#8d96a0] hover:text-zinc-200'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setPeriod('QUARTER')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              period === 'QUARTER'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                : 'text-[#8d96a0] hover:text-zinc-200'
            }`}
          >
            Квартал
          </button>
          <button
            onClick={() => setPeriod('YEAR')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              period === 'YEAR'
                ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                : 'text-[#8d96a0] hover:text-zinc-200'
            }`}
          >
            Год
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-zinc-500">Загрузка графиков...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1: Income vs Expenses Bar Chart */}
          <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-xs">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#3fb950]" />
              <h2 className="font-bold text-[#f0f6fc] text-xs uppercase tracking-wider">
                Доходы vs Расходы
              </h2>
            </div>

            {incomeExpense.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-[#8d96a0]">
                Недостаточно данных за выбранный период
              </div>
            ) : (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incomeExpense}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                    <XAxis dataKey="period" stroke="#8d96a0" fontSize={11} />
                    <YAxis stroke="#8d96a0" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(val, currency), '']}
                      contentStyle={{
                        backgroundColor: '#161b22',
                        borderColor: '#30363d',
                        borderRadius: '6px',
                        color: '#f0f6fc',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="income" fill="#3fb950" radius={[3, 3, 0, 0]} name="Доходы" />
                    <Bar dataKey="expense" fill="#f85149" radius={[3, 3, 0, 0]} name="Расходы" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Expenses by Category Pie Chart */}
          <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-xs">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#d29922]" />
              <h2 className="font-bold text-[#f0f6fc] text-xs uppercase tracking-wider">
                Расходы по категориям
              </h2>
            </div>

            {categoryData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-[#8d96a0]">
                За выбранный период расходов не найдено
              </div>
            ) : (
              <>
                <div className="w-full h-52 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(val, currency), '']}
                        contentStyle={{
                          backgroundColor: '#161b22',
                          borderColor: '#30363d',
                          borderRadius: '6px',
                          color: '#f0f6fc',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-2.5 justify-center text-[11px] pt-2 border-t border-zinc-800/80">
                  {categoryData.map((item) => (
                    <div key={item.category} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 font-medium">
                        {item.category}: <span className="font-mono text-zinc-400">{item.percentage}%</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Chart 3: Balance Trend Line Chart */}
          <div className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col gap-4 shadow-xs lg:col-span-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#388bfd]" />
              <h2 className="font-bold text-[#f0f6fc] text-xs uppercase tracking-wider">
                Динамика изменения баланса
              </h2>
            </div>

            {balanceTrend.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-xs text-[#8d96a0]">
                Недостаточно транзакций для построения графика тренда
              </div>
            ) : (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
                    <XAxis
                      dataKey="date"
                      stroke="#8d96a0"
                      fontSize={11}
                      tickFormatter={(d) => formatDate(d)}
                    />
                    <YAxis stroke="#8d96a0" fontSize={11} />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(val, currency), 'Баланс']}
                      labelFormatter={(d) => formatDate(String(d))}
                      contentStyle={{
                        backgroundColor: '#161b22',
                        borderColor: '#30363d',
                        borderRadius: '6px',
                        color: '#f0f6fc',
                        fontSize: '11px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#388bfd"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#388bfd' }}
                      activeDot={{ r: 5 }}
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
