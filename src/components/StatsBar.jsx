import React from 'react'
import { getTasksCompletedToday, getTasksCompletedThisWeek, isOverdue } from '../utils/dateUtils'

export default function StatsBar({ tasks }) {
  const total = tasks.length
  const completed = tasks.filter(t => t.completed).length
  const pending = total - completed
  const overdue = tasks.filter(t => isOverdue(t)).length
  const todayDone = getTasksCompletedToday(tasks)
  const weekDone = getTasksCompletedThisWeek(tasks)
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="stats-bar">
      <div className="stats-grid">
        {[
          { emoji: '📊', val: total,     label: 'Total',       cls: '' },
          { emoji: '⏳', val: pending,   label: 'Pending',     cls: 'c-pending' },
          { emoji: '✅', val: completed, label: 'Done',        cls: 'c-done' },
          { emoji: '🔥', val: overdue,   label: 'Overdue',     cls: 'c-over' },
          { emoji: '⚡', val: todayDone, label: "Today's ✓",   cls: 'c-today' },
          { emoji: '🏆', val: weekDone,  label: 'This Week ✓', cls: 'c-week' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-emoji">{s.emoji}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="prog-wrap">
        <div className="prog-hd">
          <span className="prog-lbl">🎯 Overall Progress</span>
          <span className="prog-pct">{pct}% complete</span>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{ width: `${pct}%` }}>
            {pct > 8 && <span className="prog-shine" />}
          </div>
        </div>
        <div className="prog-msg">
          {pct === 0 && "🌱 Let's get started!"}
          {pct > 0 && pct < 40 && '💪 Keep going, you got this!'}
          {pct >= 40 && pct < 75 && '🔥 Halfway there — great work!'}
          {pct >= 75 && pct < 100 && '🚀 Almost done — final push!'}
          {pct === 100 && '🎉 All done! You crushed it!'}
        </div>
      </div>
    </div>
  )
}
