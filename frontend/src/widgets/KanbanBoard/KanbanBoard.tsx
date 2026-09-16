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
  { id: 'PLANNED', title: 'В планах' },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colGoals = getColumnGoals(col.id)

          return (
            <div
              key={col.id}
              className="bg-[#121216] border border-[#30363d] rounded-xl p-3.5 flex flex-col gap-3 min-h-[500px] shadow-xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">{col.title}</h3>
                <span className="text-[11px] font-mono bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-semibold border border-zinc-700/60">
                  {colGoals.length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col gap-2.5 min-h-[400px] rounded-lg p-1 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-zinc-800/30' : ''
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
                              opacity: dragSnapshot.isDragging ? 0.85 : 1,
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
