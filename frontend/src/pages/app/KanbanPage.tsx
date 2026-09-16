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
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#f0f6fc]">Канбан-доска: Цели и задачи</h1>
          <p className="text-xs text-[#8d96a0]">
            Управляйте финансовыми целями, задачами и напоминаниями с помощью Drag & Drop
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Создать карточку
        </Button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            selectedCategory === ''
              ? 'bg-zinc-100 text-zinc-950 border-zinc-200 font-semibold shadow-xs'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Все карточки
        </button>

        <button
          onClick={() => setSelectedCategory('SAVING')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            selectedCategory === 'SAVING'
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          Накопления
        </button>

        <button
          onClick={() => setSelectedCategory('TASK')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            selectedCategory === 'TASK'
              ? 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-semibold'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Задачи
        </button>

        <button
          onClick={() => setSelectedCategory('REMINDER')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
            selectedCategory === 'REMINDER'
              ? 'bg-purple-500/15 text-purple-400 border-purple-500/30 font-semibold'
              : 'bg-[#161b22] border-[#30363d] text-[#8d96a0] hover:text-zinc-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Напоминания
        </button>
      </div>

      {/* Board */}
      {loading ? (
        <div className="p-12 text-center text-xs text-zinc-500">Загрузка канбан-доски...</div>
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
