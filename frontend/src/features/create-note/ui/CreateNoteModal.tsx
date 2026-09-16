import React, { useState } from 'react'
import { X, StickyNote } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { noteApi } from '@/entities/note/api/noteApi'
import type { NoteEntityType } from '@/entities/note/model/types'

interface CreateNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [content, setContent] = useState('')
  const [entityType, setEntityType] = useState<NoteEntityType>('GENERAL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      setError('Введите текст заметки')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await noteApi.create({
        content: content.trim(),
        entityType,
      })
      setContent('')
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сохранить заметку')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-[#f0f6fc]">Новая заметка</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8d96a0] hover:text-[#f0f6fc] p-1.5 rounded-lg hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-[#f85149] text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8d96a0]">Тип заметки</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as NoteEntityType)}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-[#30363d] rounded-xl text-[#f0f6fc] focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="GENERAL">Общая свободная запись</option>
              <option value="TRANSACTION">Привязать к транзакции</option>
              <option value="GOAL">Привязать к финансовой цели</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8d96a0]">Текст заметки</label>
            <textarea
              rows={4}
              placeholder="Напишите мысли, комментарии, напоминания о покупках или планах..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0a0a0c] border border-[#30363d] rounded-xl text-[#f0f6fc] placeholder-[#484f58] focus:outline-none focus:border-emerald-500 text-sm resize-none"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-3 mt-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
