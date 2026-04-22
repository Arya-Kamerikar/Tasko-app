import React, { useState } from 'react'
import { usePomodoro } from '../hooks/usePomodoro'

const MODE_LABEL = { work: '🍅 Focus', break: '☕ Break', longBreak: '🌿 Long Break' }
const MODE_COLOR = { work: '#f0d830', break: '#86efac', longBreak: '#93c5fd' }

export default function PomodoroTimer() {
  const { mode, timeLeft, running, sessions, toggle, reset, switchMode, fmt } = usePomodoro()
  const [open, setOpen] = useState(false)

  const durations = { work: 25 * 60, break: 5 * 60, longBreak: 15 * 60 }
  const total = durations[mode]
  const pct = ((total - timeLeft) / total) * 100
  const r = 38
  const circ = 2 * Math.PI * r
  const dashOffset = circ - (pct / 100) * circ

  return (
    <div className="pom-widget">
      <button className={`pom-trigger ${running ? 'pom-running' : ''}`} onClick={() => setOpen(o => !o)}>
        🍅 {running ? fmt(timeLeft) : 'Focus'}
      </button>

      {open && (
        <div className="pom-panel">
          <div className="pom-panel-hd">
            <span>🍅 Pomodoro Timer</span>
            <button className="pom-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="pom-modes">
            {Object.entries(MODE_LABEL).map(([m, label]) => (
              <button key={m} className={`pom-mode ${mode === m ? 'pom-mode-on' : ''}`}
                onClick={() => switchMode(m)}>
                {label}
              </button>
            ))}
          </div>

          <div className="pom-ring-wrap">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={r} fill="none" stroke="var(--y-light)" strokeWidth="7" />
              <circle cx="55" cy="55" r={r} fill="none"
                stroke={MODE_COLOR[mode]} strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 55 55)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="pom-time">{fmt(timeLeft)}</div>
            <div className="pom-mode-label">{MODE_LABEL[mode]}</div>
          </div>

          <div className="pom-controls">
            <button className="pom-btn pom-reset" onClick={reset} title="Reset">↺</button>
            <button className="pom-btn pom-play" onClick={toggle}
              style={{ background: mode === 'work' ? '#f0d830' : mode === 'break' ? '#bbf7d0' : '#bfdbfe' }}>
              {running ? '⏸' : '▶'}
            </button>
          </div>

          <div className="pom-sessions">
            {'🍅'.repeat(Math.min(sessions, 8))} {sessions > 0 ? `${sessions} session${sessions !== 1 ? 's' : ''}` : 'No sessions yet'}
          </div>
        </div>
      )}
    </div>
  )
}
