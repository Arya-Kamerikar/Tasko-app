import React from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import TaskItem from './TaskItem'

export default function TaskList({ tasks, allTasks, onToggle, onDelete, onEdit, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oi = allTasks.findIndex(t => t.id === active.id)
    const ni = allTasks.findIndex(t => t.id === over.id)
    onReorder(arrayMove(allTasks, oi, ni).map((t, i) => ({ ...t, order: i })))
  }

  if (tasks.length === 0) {
    return (
      <div className="empty">
        <div className="empty-anim">
          <span className="empty-star s1">⭐</span>
          <span className="empty-star s2">✦</span>
          <span className="empty-star s3">💛</span>
        </div>
        <div className="empty-icon">📋</div>
        <div className="empty-title">Nothing here yet!</div>
        <div className="empty-sub">Hit <strong>New Task</strong> to get started ✨</div>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task}
              onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
