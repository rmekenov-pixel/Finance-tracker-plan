import { TrendingUp, TrendingDown, PiggyBank, Bell, Plus } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { Badge } from '@/shared/ui/Badge'
import { useUserStore } from '@/entities/user/model/userStore'

export const DashboardPage: React.FC = () => {
  const user = useUserStore((state) => state.user)

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            С возвращением, {user?.name || 'Пользователь'}! 👋
          </h1>
          <p className="text-sm text-slate-400">Обзор ваших личных финансов за текущий месяц</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Добавить цель
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Новая транзакция
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Текущий баланс
          </span>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-slate-100">450 000 ₸</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5% по сравнению с прошлым месяцем</span>
          </div>
        </div>

        {/* Income */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Доходы за месяц</span>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-emerald-400">+650 000 ₸</span>
          </div>
          <span className="text-xs text-slate-500">Зарплата, фриланс, кэшбэк</span>
        </div>

        {/* Expenses */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Расходы за месяц</span>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-rose-400">-200 000 ₸</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
            <TrendingDown className="w-4 h-4" />
            <span>В пределах запланированного бюджета</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Goals & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Goals / Savings */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-amber-400" />
              <h2 className="font-semibold text-slate-100">Накопления и цели</h2>
            </div>
            <span className="text-xs text-slate-400">Топ активных</span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-200">Ноутбук для работы</span>
                <Badge variant="saving">SAVING</Badge>
              </div>
              <ProgressBar current={350000} target={700000} color="bg-amber-500" />
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-200">Подушка безопасности</span>
                <Badge variant="saving">SAVING</Badge>
              </div>
              <ProgressBar current={800000} target={1000000} color="bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Reminders / Tasks */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold text-slate-100">Ближайшие напоминания</h2>
            </div>
            <span className="text-xs text-slate-400">След. 7 дней</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-200">Оплата коммунальных услуг</h3>
                <p className="text-xs text-slate-400">Дедлайн: 20-е число месяца</p>
              </div>
              <Badge variant="reminder">REMINDER</Badge>
            </div>

            <div className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-200">Продление подписки на интернет</h3>
                <p className="text-xs text-slate-400">Дедлайн: 25-е число месяца</p>
              </div>
              <Badge variant="reminder">REMINDER</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
