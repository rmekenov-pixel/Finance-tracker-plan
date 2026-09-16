import React from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import type { Goal, GoalStatus } from '@/entities/goal/model/types'
import { GoalCard } from '@/entities/goal/ui/GoalCard'

interface KanbanBoardProps {
  goals: Goal[]
  onStatusChange: (goalId: string, newStatus: GoalStatus, newIndex: number) => void
  onDelete: (id: string) => void
  onAddDeposit: (goal: Goal) => void
  onToggleTask: (goal: Goal) => void
}

const COLUMNS: { id: GoalStatus; title: string }[] = [
  { id: 'PLANNED', title: 'Запланировано' },
  { id: 'IN_PROGRESS', title: 'В процессе' },
  { id: 'DONE', title: 'Выполнено' },
]

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  goals,
  onStatusChange,
  onDelete,
  onAddDeposit,
  onToggleTask,
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    onStatusChange(
      draggableId,
      destination.droppableId as GoalStatus,
      destination.index
    )
  }

  const getColumnGoals = (status: GoalStatus) => {
    return goals.filter((g) => g.status === status)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((col) => {
          const colGoals = getColumnGoals(col.id)

          return (
            <div
              key={col.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200">{col.title}</h3>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-medium">
                  {colGoals.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col gap-3 min-h-[400px] rounded-xl transition-colors ${
                      snapshot.isDraggingOver ? 'bg-slate-800/30' : ''
                    }`}
                  >
                    {colGoals.map((goal, index) => (
                      <Draggable key={goal.id} draggableId={goal.id} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            style={{
                              ...dragProvided.draggableProps.style,
                              opacity: dragSnapshot.isDragging ? 0.9 : 1,
                            }}
                          >
                            <GoalCard
                              goal={goal}
                              onDelete={onDelete}
                              onAddDeposit={onAddDeposit}
                              onToggleTask={onToggleTask}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
