import React, { useState, useEffect, useCallback } from 'react'
import { Plus, PiggyBank, CheckSquare, Bell, LayoutGrid } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { KanbanBoard } from '@/widgets/KanbanBoard/KanbanBoard'
import { CreateGoalModal } from '@/features/create-goal/ui/CreateGoalModal'
import { AddDepositModal } from '@/features/add-deposit/ui/AddDepositModal'
import { goalApi } from '@/entities/goal/api/goalApi'
import type { Goal, GoalCategory, GoalStatus } from '@/entities/goal/model/types'

export const KanbanPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory | ''>('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [depositGoal, setDepositGoal] = useState<Goal | null>(null)

  const loadGoals = useCallback(async () => {
    setLoading(true)
    try {
      const data = await goalApi.getGoals(selectedCategory ? selectedCategory : undefined)
      setGoals(data)
    } catch (err) {
      console.error('Ошибка загрузки целей:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  const handleStatusChange = async (goalId: string, newStatus: GoalStatus, newIndex: number) => {
    // Optimistic UI update
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, status: newStatus, sortOrder: newIndex } : g))
    )

    try {
      await goalApi.updateStatus(goalId, { status: newStatus, sortOrder: newIndex })
    } catch (err) {
      console.error('Ошибка изменения статуса:', err)
      loadGoals() // rollback on error
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
      try {
        await goalApi.delete(id)
        loadGoals()
      } catch (err) {
        alert('Не удалось удалить карточку')
      }
    }
  }

  const handleToggleTask = async (goal: Goal) => {
    const nextStatus: GoalStatus = goal.status === 'DONE' ? 'IN_PROGRESS' : 'DONE'
    handleStatusChange(goal.id, nextStatus, goal.sortOrder)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Канбан-доска: Цели и задачи</h1>
          <p className="text-sm text-slate-400">
            Управляйте финансовыми целями, задачами и напоминаниями с помощью Drag & Drop
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          Создать карточку
        </Button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            selectedCategory === ''
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Все карточки
        </button>

        <button
          onClick={() => setSelectedCategory('SAVING')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            selectedCategory === 'SAVING'
              ? 'bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          Накопления (SAVING)
        </button>

        <button
          onClick={() => setSelectedCategory('TASK')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            selectedCategory === 'TASK'
              ? 'bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Задачи (TASK)
        </button>

        <button
          onClick={() => setSelectedCategory('REMINDER')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            selectedCategory === 'REMINDER'
              ? 'bg-purple-500 text-white font-semibold shadow-lg shadow-purple-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Напоминания (REMINDER)
        </button>
      </div>

      {/* Board */}
      {loading ? (
        <div className="p-12 text-center text-sm text-slate-500">Загрузка канбан-доски...</div>
      ) : (
        <KanbanBoard
          goals={goals}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddDeposit={(goal) => setDepositGoal(goal)}
          onToggleTask={handleToggleTask}
        />
      )}

      {/* Modals */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadGoals}
      />

      <AddDepositModal
        goal={depositGoal}
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        onSuccess={loadGoals}
      />
    </div>
  )
}
