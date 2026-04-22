import React, { useRef } from 'react'
import PomodoroTimer from './PomodoroTimer'

export default function Header({ section, onMenu, onAdd, onExport, onImport, count, darkMode, onToggleDark }) {
  const fileRef = useRef(null)

  return (
    <header className="topbar">
      <div className="topbar-l">
        <button className="menu-btn" onClick={onMenu} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="topbar-title">
          <h1 className="topbar-section">{section}</h1>
          <span className="topbar-count">🗂 {count} task{count !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="topbar-r">
        <PomodoroTimer />

        <button className="tb-btn" onClick={onToggleDark} title="Toggle theme">
          {darkMode ? '☀️' : '🌙'}
        </button>

        <button className="tb-btn" onClick={onExport} title="Export JSON">
          <span>⬇</span><span className="tb-label">Export</span>
        </button>

        <button className="tb-btn" onClick={() => fileRef.current?.click()} title="Import JSON">
          <span>⬆</span><span className="tb-label">Import</span>
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }}
          onChange={e => { onImport(e.target.files[0]); e.target.value = '' }} />

        <button className="add-btn" onClick={onAdd}>
          <span className="add-plus">＋</span>
          <span>New Task</span>
        </button>
      </div>
    </header>
  )
}
