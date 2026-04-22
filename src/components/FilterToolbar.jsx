import React from 'react'
import { PRIORITIES, CATEGORIES } from '../utils/dateUtils'

export default function FilterToolbar({ filters, sort, onFilter, onSort }) {
  const set = (k, v) => onFilter({ ...filters, [k]: v })

  return (
    <div className="filter-bar">
      <div className="search-box">
        <span className="search-ico">🔍</span>
        <input className="search-in" placeholder="Search tasks, tags, notes..."
          value={filters.search} onChange={e => set('search', e.target.value)} />
        {filters.search && (
          <button className="search-clr" onClick={() => set('search', '')}>✕</button>
        )}
      </div>

      <div className="filter-row">
        <select className="fsel" value={filters.status} onChange={e => set('status', e.target.value)}>
          <option value="All">📋 All Status</option>
          <option value="Pending">⏳ Pending</option>
          <option value="Completed">✅ Completed</option>
        </select>

        <select className="fsel" value={filters.priority} onChange={e => set('priority', e.target.value)}>
          <option value="All">🎯 All Priority</option>
          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="fsel" value={filters.category} onChange={e => set('category', e.target.value)}>
          <option value="All">🗂 All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select className="fsel" value={sort} onChange={e => onSort(e.target.value)}>
          <option value="manual">↕ Manual Order</option>
          <option value="created">🕐 Date Created</option>
          <option value="dueDate">📅 Due Date</option>
          <option value="priority">🔥 Priority</option>
        </select>
      </div>
    </div>
  )
}
