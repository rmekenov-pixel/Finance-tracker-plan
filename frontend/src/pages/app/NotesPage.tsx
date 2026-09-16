import React, { useState, useEffect, useCallback } from 'react'
import { Plus, StickyNote, LayoutGrid, ArrowLeftRight, Target } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { NoteCard } from '@/entities/note/ui/NoteCard'
import { CreateNoteModal } from '@/features/create-note/ui/CreateNoteModal'
import { noteApi } from '@/entities/note/api/noteApi'
import type { Note, NoteEntityType } from '@/entities/note/model/types'

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<NoteEntityType | ''>('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const loadNotes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await noteApi.getNotes(filterType ? filterType : undefined)
      setNotes(data)
    } catch (err) {
      console.error('Ошибка загрузки заметок:', err)
    } finally {
      setLoading(false)
    }
  }, [filterType])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await noteApi.delete(id)
        loadNotes()
      } catch (err) {
        alert('Не удалось удалить заметку')
      }
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f0f6fc]">Заметки и комментарии</h1>
          <p className="text-xs text-[#8d96a0]">
            Свободные заметки и важные напоминания, привязанные к расходам и целям
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Новая заметка
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType('')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            filterType === ''
              ? 'bg-zinc-100 text-zinc-950 border-zinc-200 font-semibold shadow-xs'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Все ({notes.length})
        </button>

        <button
          onClick={() => setFilterType('GENERAL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            filterType === 'GENERAL'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <StickyNote className="w-3.5 h-3.5" />
          Общие
        </button>

        <button
          onClick={() => setFilterType('TRANSACTION')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            filterType === 'TRANSACTION'
              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-semibold'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          К транзакциям
        </button>

        <button
          onClick={() => setFilterType('GOAL')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            filterType === 'GOAL'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          К целям
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Загрузка заметок...</div>
      ) : notes.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center gap-2.5 bg-[#161b22] border border-[#30363d] rounded-xl shadow-xs">
          <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
            <StickyNote className="w-6 h-6" />
          </div>
          <h3 className="text-xs font-semibold text-zinc-300">Заметок пока нет</h3>
          <p className="text-[11px] text-[#8d96a0] max-w-sm">
            Записывайте важные финансовые мысли, планы или комментарии к покупкам.
          </p>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="mt-1">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Создать первую заметку
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadNotes}
      />
    </div>
  )
}
