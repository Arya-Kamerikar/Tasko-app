import React from 'react'

const NAV = [
  { id: 'All',       icon: '✦',  label: 'All Tasks'  },
  { id: 'Today',     icon: '☀️',  label: 'Today'      },
  { id: 'Tomorrow',  icon: '🌅',  label: 'Tomorrow'   },
  { id: 'This Week', icon: '📆',  label: 'This Week'  },
  { id: 'Weekend',   icon: '🌴',  label: 'Weekend'    },
  { id: 'Overdue',   icon: '🔥',  label: 'Overdue'    },
]

export default function Sidebar({ section, onSection, counts, open, onClose }) {
  return (
    <>
      {open && <div className="sb-overlay" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="sb-logo">
            <span className="sb-logo-check">✓</span>
            <div className="sb-logo-ring" />
          </div>
          <div>
            <div className="sb-name">Tasko</div>
            <div className="sb-tagline"> Get things done!</div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-group-label">📋 Views</div>
          {NAV.map(item => (
            <button
              key={item.id}
              className={`sb-item ${section === item.id ? 'active' : ''}`}
              onClick={() => { onSection(item.id); onClose() }}
            >
              <span className="sb-icon">{item.icon}</span>
              <span className="sb-label">{item.label}</span>
              {counts[item.id] > 0 && (
                <span className="sb-badge">{counts[item.id]}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-quote"> "Done is better than perfect"</div>
        </div>
      </aside>
    </>
  )
}
