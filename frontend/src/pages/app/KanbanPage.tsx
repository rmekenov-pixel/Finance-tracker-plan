import React from 'react'
import { Plus, CheckCircle, Clock, Calendar } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'
import { ProgressBar } from '@/shared/ui/ProgressBar'

export const KanbanPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Канбан-доска: Цели и задачи</h1>
          <p className="text-sm text-slate-400">
            Управляйте финансовыми целями, задачами и напоминаниями
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Создать карточку
        </Button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1: PLANNED */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Запланировано</h3>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-medium">1</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">Отпуск в горах</span>
              <Badge variant="saving">SAVING</Badge>
            </div>
            <ProgressBar current={50000} target={300000} color="bg-amber-500" />
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> До дек 2026
              </span>
              <button className="text-emerald-400 hover:underline font-medium">+ Пополнить</button>
            </div>
          </div>
        </div>

        {/* Column 2: IN_PROGRESS */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">В процессе</h3>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-medium">2</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">Ноутбук для работы</span>
              <Badge variant="saving">SAVING</Badge>
            </div>
            <ProgressBar current={350000} target={700000} color="bg-emerald-500" />
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> До ноя 2026
              </span>
              <button className="text-emerald-400 hover:underline font-medium">+ Пополнить</button>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200">Оплатить налог на транспорт</span>
              <Badge variant="reminder">REMINDER</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-purple-400 font-medium">
                <Clock className="w-3.5 h-3.5" /> До 1 октября
              </span>
              <button className="text-slate-400 hover:text-slate-200">Подробнее</button>
            </div>
          </div>
        </div>

        {/* Column 3: DONE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Выполнено</h3>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-medium">1</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-3 opacity-75">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-200 line-through">
                Закрыть рассрочку за телефон
              </span>
              <Badge variant="task">TASK</Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle className="w-3.5 h-3.5" /> Завершено
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
