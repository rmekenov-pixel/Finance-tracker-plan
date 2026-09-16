import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Badge } from '@/shared/ui/Badge'

export const TransactionsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Транзакции</h1>
          <p className="text-sm text-slate-400">История и учет всех ваших доходов и расходов</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Добавить запись
        </Button>
      </div>

      {/* Filters */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Input placeholder="Поиск по описанию..." className="py-2" />
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none">
            <option value="ALL">Все типы</option>
            <option value="INCOME">Доходы</option>
            <option value="EXPENSE">Расходы</option>
          </select>
          <select className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none">
            <option value="ALL">Все категории</option>
            <option value="FOOD">Еда и продукты</option>
            <option value="TRANSPORT">Транспорт</option>
            <option value="HOUSING">Жилье и ЖКХ</option>
            <option value="SALARY">Зарплата</option>
          </select>
        </div>
      </div>

      {/* Sample Transactions List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800">
          <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <Badge variant="income">+ Доход</Badge>
              <div>
                <h4 className="text-sm font-medium text-slate-200">Основная зарплата</h4>
                <p className="text-xs text-slate-400">Категория: Зарплата • 15 сен 2026</p>
              </div>
            </div>
            <span className="font-bold text-emerald-400 text-base">+500 000 ₸</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <Badge variant="expense">- Расход</Badge>
              <div>
                <h4 className="text-sm font-medium text-slate-200">Супермаркет Magnum</h4>
                <p className="text-xs text-slate-400">Категория: Продукты • 14 сен 2026</p>
              </div>
            </div>
            <span className="font-bold text-rose-400 text-base">-24 500 ₸</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <Badge variant="expense">- Расход</Badge>
              <div>
                <h4 className="text-sm font-medium text-slate-200">Яндекс Такси</h4>
                <p className="text-xs text-slate-400">Категория: Транспорт • 13 сен 2026</p>
              </div>
            </div>
            <span className="font-bold text-rose-400 text-base">-3 200 ₸</span>
          </div>
        </div>
      </div>
    </div>
  )
}
