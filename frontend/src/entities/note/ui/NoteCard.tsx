import React from 'react'
import { Trash2, Link as LinkIcon, Calendar } from 'lucide-react'
import type { Note } from '../model/types'
import { Badge } from '@/shared/ui/Badge'
import { formatDate } from '@/shared/lib/format'

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
    <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-xl flex flex-col justify-between gap-3 hover:border-zinc-700 transition-colors shadow-xs">
      <p className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed">
        {note.content}
      </p>

      <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/80 text-[11px]">
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant(note.entityType)}>
            {note.entityType !== 'GENERAL' && <LinkIcon className="w-3 h-3 mr-1" />}
            {getBadgeLabel(note.entityType)}
          </Badge>
          <span className="flex items-center gap-1 text-[#8d96a0]">
            <Calendar className="w-3 h-3" />
            {formatDate(note.createdAt)}
          </span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="text-zinc-500 hover:text-rose-400 p-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700"
            title="Удалить заметку"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
