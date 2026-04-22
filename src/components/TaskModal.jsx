import React, { useState, useEffect, useRef } from 'react'
import { PRIORITIES, CATEGORIES, RECURRENCE, CATEGORY_EMOJI, PRIORITY_EMOJI } from '../utils/dateUtils'

const EMPTY = { text: '', description: '', priority: 'Medium', category: 'Personal', dueDate: '', dueTime: '', recurrence: 'None', tags: [] }

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task ? {
    text: task.text, description: task.description || '',
    priority: task.priority, category: task.category,
    dueDate: task.dueDate || '', dueTime: task.dueTime || '',
    recurrence: task.recurrence || 'None', tags: task.tags || []
  } : EMPTY)
  const [tagInput, setTagInput] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const ref = useRef(null)

  useEffect(() => { ref.current?.focus() }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.text.trim()) {
      setError('Task name cannot be empty!')
      setShake(true); setTimeout(() => setShake(false), 400)
      return
    }
    onSave(form); onClose()
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t])
    setTagInput('')
  }

  const PRIORITY_BG = { Low: '#dcfce7', Medium: '#fef9c3', High: '#ffedd5', Urgent: '#fee2e2' }
  const PRIORITY_BORDER = { Low: '#86efac', Medium: '#fde047', High: '#fdba74', Urgent: '#fca5a5' }
  const PRIORITY_TEXT = { Low: '#15803d', Medium: '#a16207', High: '#c2410c', Urgent: '#b91c1c' }

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${shake ? 'shake' : ''}`}>
        <div className="modal-hd">
          <div className="modal-title-row">
            <span className="modal-emoji">{task ? '✏️' : '✨'}</span>
            <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="flbl">📝 Task Name</label>
            <input ref={ref} className={`finput ${error ? 'finput-err' : ''}`}
              value={form.text} onChange={e => { set('text', e.target.value); setError('') }}
              placeholder="What do you need to do?" maxLength={200} />
            {error && <span className="ferr">⚠️ {error}</span>}
          </div>

          <div className="field">
            <label className="flbl">📄 Notes (optional)</label>
            <textarea className="finput ftarea" value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Add details or notes..." rows={2} maxLength={500} />
          </div>

          <div className="field">
            <label className="flbl">🎯 Priority</label>
            <div className="priority-row">
              {PRIORITIES.map(p => (
                <button key={p} type="button"
                  className={`pri-chip ${form.priority === p ? 'pri-active' : ''}`}
                  style={form.priority === p ? {
                    background: PRIORITY_BG[p], borderColor: PRIORITY_BORDER[p], color: PRIORITY_TEXT[p]
                  } : {}}
                  onClick={() => set('priority', p)}>
                  {PRIORITY_EMOJI[p]} {p}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row2">
            <div className="field">
              <label className="flbl">🗂 Category</label>
              <select className="finput fsel" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{CATEGORY_EMOJI[c]} {c}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="flbl">🔁 Repeats</label>
              <select className="finput fsel" value={form.recurrence} onChange={e => set('recurrence', e.target.value)}>
                {RECURRENCE.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="field-row2">
            <div className="field">
              <label className="flbl">📅 Due Date</label>
              <input type="date" className="finput" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
            </div>
            <div className="field">
              <label className="flbl">⏰ Due Time</label>
              <input type="time" className="finput" value={form.dueTime} onChange={e => set('dueTime', e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label className="flbl">🏷 Tags</label>
            <div className="tag-row">
              <input className="finput" value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="Type a tag and press Enter..." />
              <button type="button" className="tag-add" onClick={addTag}>＋</button>
            </div>
            {form.tags.length > 0 && (
              <div className="tags-list">
                {form.tags.map(tag => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                    <button type="button" onClick={() => set('tags', form.tags.filter(t => t !== tag))}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {task ? '💾 Save Changes' : '✨ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
