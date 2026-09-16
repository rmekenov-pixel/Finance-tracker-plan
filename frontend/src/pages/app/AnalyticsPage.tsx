import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export const AnalyticsPage: React.FC = () => {
  const barData = [
    { month: 'Май', income: 450000, expense: 220000 },
    { month: 'Июн', income: 480000, expense: 260000 },
    { month: 'Июл', income: 520000, expense: 310000 },
    { month: 'Авг', income: 500000, expense: 210000 },
    { month: 'Сен', income: 650000, expense: 200000 },
  ]

  const pieData = [
    { name: 'Продукты', value: 95000, color: '#10b981' },
    { name: 'Жилье & ЖКХ', value: 45000, color: '#3b82f6' },
    { name: 'Транспорт', value: 25000, color: '#f59e0b' },
    { name: 'Развлечения', value: 20000, color: '#ec4899' },
    { name: 'Прочее', value: 15000, color: '#8b5cf6' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Финансовая аналитика</h1>
          <p className="text-sm text-slate-400">Наглядные отчеты по доходам, расходам и категориям</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-medium">Месяц</button>
          <button className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200">Квартал</button>
          <button className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200">Год</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Bar Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
          <h2 className="font-semibold text-slate-100 text-sm">Доходы vs Расходы (Динамика)</h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Доходы" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Расходы" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category Pie Chart */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
          <h2 className="font-semibold text-slate-100 text-sm">Расходы по категориям</h2>
          <div className="w-full h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
