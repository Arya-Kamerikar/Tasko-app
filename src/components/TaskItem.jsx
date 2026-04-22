import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate, formatTime, isOverdue, PRIORITY_COLOR, PRIORITY_EMOJI, CATEGORY_EMOJI } from '../utils/dateUtils'

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [removing, setRemoving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  const overdue = isOverdue(task)

  const handleDelete = () => {
    setRemoving(true)
    setTimeout(() => onDelete(task.id), 320)
  }

  return (
    <li ref={setNodeRef} style={style}
      className={`task-item
        ${task.completed ? 'task-done' : ''}
        ${removing ? 'task-out' : ''}
        ${overdue ? 'task-overdue' : ''}
        ${task.priority === 'Urgent' && !task.completed ? 'task-urgent' : ''}
      `}>

      {/* accent bar */}
      <span className="task-accent" style={{ background: PRIORITY_COLOR[task.priority] }} />

      <div className="task-row">
        {/* drag handle */}
        <button className="drag-h" {...attributes} {...listeners} aria-label="Drag">⠿</button>

        {/* checkbox */}
        <button
          className={`cb ${task.completed ? 'cb-done' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label="Toggle"
        >
          {task.completed && <span className="cb-check">✓</span>}
        </button>

        {/* content */}
        <div className="task-body" onClick={() => task.description && setExpanded(e => !e)}>
          <div className="task-top">
            <span className="task-text">{task.text}</span>
            <div className="task-pills">
              {task.recurrence !== 'None' && (
                <span className="pill pill-recur">🔁 {task.recurrence}</span>
              )}
              <span className="pill pill-pri" style={{ color: PRIORITY_COLOR[task.priority] }}>
                {PRIORITY_EMOJI[task.priority]} {task.priority}
              </span>
            </div>
          </div>

          <div className="task-meta">
            <span className="meta-cat">
              {CATEGORY_EMOJI[task.category] || '📌'} {task.category}
            </span>
            {task.dueDate && (
              <span className={`meta-due ${overdue ? 'meta-late' : ''}`}>
                {formatDate(task.dueDate)}
                {task.dueTime && ' ' + formatTime(task.dueTime)}
                {overdue && ' ⚠️'}
              </span>
            )}
            {task.tags?.map(tag => (
              <span key={tag} className="meta-tag">#{tag}</span>
            ))}
          </div>

          {task.description && (
            <div className="task-desc-hint">
              {expanded ? '🔼' : '🔽'} {expanded ? 'Hide' : 'Show'} notes
            </div>
          )}
        </div>

        {/* actions */}
        <div className="task-acts">
          {!task.completed && (
            <button className="act-btn act-edit" onClick={() => onEdit(task)} aria-label="Edit">✏️</button>
          )}
          <button className="act-btn act-del" onClick={handleDelete} aria-label="Delete">🗑️</button>
        </div>
      </div>

      {expanded && task.description && (
        <div className="task-desc">{task.description}</div>
      )}
    </li>
  )
}
