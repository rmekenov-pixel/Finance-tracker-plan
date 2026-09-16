import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Badge } from '@/shared/ui/Badge'

export const NotesPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Заметки</h1>
          <p className="text-sm text-slate-400">
            Свободные заметки и комментарии, привязанные к транзакциям и целям
          </p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Новая заметка
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4">
          <p className="text-sm text-slate-200">
            Не забыть сверить показания счетчиков воды перед оплатой квитанции за сентябрь.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <Badge variant="reminder">Привязано к цели</Badge>
            <span className="text-slate-500">12 сен 2026</span>
          </div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4">
          <p className="text-sm text-slate-200">
            Рассчитать бюджет на новогодние подарки до конца октября.
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <Badge variant="default">GENERAL</Badge>
            <span className="text-slate-500">10 сен 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
