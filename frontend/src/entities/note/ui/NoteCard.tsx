import React from 'react'
import { Trash2, Link as LinkIcon, Calendar } from 'lucide-react'
import type { Note } from '../model/types'
import { Badge } from '@/shared/ui/Badge'

interface NoteCardProps {
  note: Note
  onDelete?: (id: string) => void
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return 'income'
      case 'GOAL':
        return 'saving'
      default:
        return 'default'
    }
  }

  const getBadgeLabel = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return 'К транзакции'
      case 'GOAL':
        return 'К цели'
      default:
        return 'Общая заметка'
    }
  }

  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between gap-4 hover:border-slate-700 transition-all shadow-sm">
      <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
        {note.content}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant(note.entityType)}>
            {note.entityType !== 'GENERAL' && <LinkIcon className="w-3 h-3 mr-1" />}
            {getBadgeLabel(note.entityType)}
          </Badge>
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3 h-3" />
            {new Date(note.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Удалить заметку"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
