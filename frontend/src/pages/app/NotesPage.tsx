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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Заметки и комментарии</h1>
          <p className="text-sm text-slate-400">
            Свободные заметки и важные напоминания, привязанные к расходам и целям
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Новая заметка
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterType('')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterType === ''
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Все ({notes.length})
        </button>

        <button
          onClick={() => setFilterType('GENERAL')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterType === 'GENERAL'
              ? 'bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <StickyNote className="w-3.5 h-3.5" />
          Общие
        </button>

        <button
          onClick={() => setFilterType('TRANSACTION')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterType === 'TRANSACTION'
              ? 'bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          К транзакциям
        </button>

        <button
          onClick={() => setFilterType('GOAL')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            filterType === 'GOAL'
              ? 'bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          К целям
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-500">Загрузка заметок...</div>
      ) : notes.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="p-3 bg-slate-800 rounded-2xl text-slate-500">
            <StickyNote className="w-8 h-8" />
          </div>
          <h3 className="font-semibold text-slate-300">Заметок пока нет</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Записывайте важные финансовые мысли, планы или комментарии к покупкам.
          </p>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)} className="mt-2">
            <Plus className="w-4 h-4 mr-1.5" />
            Создать первую заметку
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
