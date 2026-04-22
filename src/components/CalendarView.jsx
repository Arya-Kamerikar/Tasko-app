import React, { useState } from 'react'
import { toDateStr, today, tomorrow } from '../utils/dateUtils'

export default function CalendarView({ tasks }) {
  const [cur, setCur] = useState(new Date())
  const [selected, setSelected] = useState(null)

  const yr = cur.getFullYear()
  const mo = cur.getMonth()
  const firstDay = new Date(yr, mo, 1).getDay()
  const daysInMonth = new Date(yr, mo + 1, 0).getDate()
  const todayStr = today()
  const tomStr = tomorrow()

  const byDate = {}
  tasks.forEach(t => {
    if (t.dueDate) {
      if (!byDate[t.dueDate]) byDate[t.dueDate] = []
      byDate[t.dueDate].push(t)
    }
  })

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = cur.toLocaleString('default', { month: 'long', year: 'numeric' })
  const prev = () => setCur(new Date(yr, mo - 1, 1))
  const next = () => setCur(new Date(yr, mo + 1, 1))

  const selectedTasks = selected ? (byDate[selected] || []) : []

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <button className="cal-nav" onClick={prev}>‹</button>
        <span className="cal-month">📆 {monthLabel}</span>
        <button className="cal-nav" onClick={next}>›</button>
      </div>

      <div className="cal-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} className="cal-cell cal-empty" />
          const ds = `${yr}-${String(mo+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const dayTasks = byDate[ds] || []
          const isToday = ds === todayStr
          const isTom = ds === tomStr
          const isSelected = ds === selected
          const hasOverdue = dayTasks.some(t => !t.completed && ds < todayStr)
          const allDone = dayTasks.length > 0 && dayTasks.every(t => t.completed)

          return (
            <div key={ds}
              className={`cal-cell
                ${isToday ? 'cal-today' : ''}
                ${isTom ? 'cal-tom' : ''}
                ${isSelected ? 'cal-sel' : ''}
                ${dayTasks.length ? 'cal-busy' : ''}
                ${hasOverdue ? 'cal-od' : ''}
                ${allDone ? 'cal-alldon' : ''}
              `}
              onClick={() => setSelected(isSelected ? null : ds)}
            >
              <span className="cal-dn">{day}</span>
              {isToday && <span className="cal-today-dot" />}
              {dayTasks.length > 0 && (
                <div className="cal-dots">
                  {dayTasks.slice(0, 3).map(t => (
                    <span key={t.id} className={`cdot ${t.completed ? 'cdot-done' : hasOverdue ? 'cdot-late' : 'cdot-active'}`} />
                  ))}
                  {dayTasks.length > 3 && <span className="cdot-more">+{dayTasks.length - 3}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selected && selectedTasks.length > 0 && (
        <div className="cal-detail">
          <div className="cal-detail-hd">
            📅 Tasks for {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            <button className="cal-detail-close" onClick={() => setSelected(null)}>✕</button>
          </div>
          <ul className="cal-detail-list">
            {selectedTasks.map(t => (
              <li key={t.id} className={`cal-task-row ${t.completed ? 'cal-task-done' : ''}`}>
                <span className="cal-task-cb">{t.completed ? '✅' : '⬜'}</span>
                <span className="cal-task-txt">{t.text}</span>
                <span className="cal-task-pri">{t.priority}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selected && selectedTasks.length === 0 && (
        <div className="cal-detail cal-detail-empty">
          🌟 No tasks scheduled for this day
        </div>
      )}
    </div>
  )
}
